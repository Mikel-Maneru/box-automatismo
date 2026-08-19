const BOX_URL = process.env.WODBUSTER_BOX_URL || 'https://anboto.wodbuster.com';
const BOX_SLUG = process.env.WODBUSTER_BOX_SLUG || 'anboto';
const PUBLIC_URL = BOX_URL;
const LOGIN_URL = `https://wodbuster.com/account/login.aspx?cb=${BOX_SLUG}`;

class WodbusterAuthError extends Error {
  constructor(message = 'Sesion de WodBuster expirada') {
    super(message);
    this.name = 'WodbusterAuthError';
  }
}

// --- Cookie management with Supabase persistence ---

let memoryCookie = null;

async function getSupabase() {
  try {
    return require('./supabase');
  } catch {
    return null;
  }
}

async function getCookie() {
  // 1. In-memory cache (fastest)
  if (memoryCookie) return memoryCookie;

  // 2. Supabase (persists across serverless invocations)
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase
        .from('wodbuster_config')
        .select('value')
        .eq('key', 'session_cookie')
        .single();
      if (data?.value) {
        memoryCookie = data.value;
        return memoryCookie;
      }
    } catch (err) {
      console.error('Error reading cookie from Supabase:', err.message);
    }
  }

  // 3. Env var fallback
  const envCookie = process.env.WODBUSTER_SESSION_COOKIE;
  if (envCookie) {
    memoryCookie = envCookie;
    return envCookie;
  }

  throw new WodbusterAuthError('No hay cookie de WodBuster disponible');
}

async function saveCookie(cookie) {
  memoryCookie = cookie;

  const supabase = await getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('wodbuster_config')
        .upsert({ key: 'session_cookie', value: cookie, updated_at: new Date().toISOString() });
    } catch (err) {
      console.error('Error saving cookie to Supabase:', err.message);
    }
  }
}

// Extract and save .WBAuth cookie from Set-Cookie response header
async function captureRefreshedCookie(response) {
  const setCookies = response.headers.getSetCookie?.() || [];
  const wbAuthCookie = setCookies.find(c => c.startsWith('.WBAuth='));
  if (wbAuthCookie) {
    const cookieValue = wbAuthCookie.split(';')[0];
    // Only save if different from current
    if (cookieValue !== memoryCookie) {
      console.log('WodBuster session cookie refreshed');
      await saveCookie(cookieValue);
    }
  }
}

// --- Auto-login (curl-based, for Cloudflare-protected login) ---

const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

function extractHiddenField(html, id) {
  const regex = new RegExp(`id="${id}"\\s+value="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

async function loginToWodBuster() {
  const email = process.env.WODBUSTER_EMAIL;
  const password = process.env.WODBUSTER_PASSWORD;

  if (!email || !password) {
    throw new WodbusterAuthError('WODBUSTER_EMAIL y WODBUSTER_PASSWORD son necesarios para auto-login');
  }

  console.log('Auto-login to WodBuster (last resort)...');

  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
  const cookieJar = require('path').join(require('os').tmpdir(), `wodbuster-cookies-${Date.now()}.txt`);

  try {
    // Step 1: GET login page with cookie jar
    let html;
    try {
      const { stdout } = await execFileAsync('curl', [
        '-s', '-L', '-A', UA,
        '-c', cookieJar,
        LOGIN_URL,
      ], { timeout: 15000 });
      html = stdout;
    } catch {
      throw new Error('curl not available for GET');
    }

    if (!html || html.includes('Just a moment')) {
      throw new Error('Cloudflare challenge, cannot auto-login');
    }

    const csrfToken = extractHiddenField(html, 'CSRFToken');
    const viewstateC = extractHiddenField(html, '__VIEWSTATEC');
    const eventValidation = extractHiddenField(html, '__EVENTVALIDATION');

    if (!csrfToken || !viewstateC || !eventValidation) {
      throw new Error('No se pudieron extraer los campos del formulario');
    }

    // Step 2: POST login form with session cookie
    const formData = new URLSearchParams({
      'CSRFToken': csrfToken,
      '__EVENTTARGET': '',
      '__EVENTARGUMENT': '',
      '__VIEWSTATEC': viewstateC,
      '__VIEWSTATE': '',
      '__EVENTVALIDATION': eventValidation,
      'ctl00$ctl00$body$body$CtlLogin$IoEmail': email,
      'ctl00$ctl00$body$body$CtlLogin$IoPassword': password,
      'ctl00$ctl00$body$body$CtlLogin$IoTri': '',
      'ctl00$ctl00$body$body$CtlLogin$IoTrg': '',
      'ctl00$ctl00$body$body$CtlLogin$IoTra': '',
      'ctl00$ctl00$body$body$CtlLogin$CtlAceptar': 'Aceptar',
    });

    const { stdout: postResult } = await execFileAsync('curl', [
      '-s', '-L',
      '-A', UA,
      '-H', 'Content-Type: application/x-www-form-urlencoded',
      '-b', cookieJar,
      '-c', cookieJar,
      '-d', formData.toString(),
      LOGIN_URL,
    ], { timeout: 20000 });

    // Check cookie jar for .WBAuth
    const jarContent = require('fs').readFileSync(cookieJar, 'utf-8');
    const wbAuthMatch = jarContent.match(/^\.wodbuster\.com\s+TRUE\s+\/\s+TRUE\s+\d+\s+\.WBAuth\s+(.+)$/mi);

    if (!wbAuthMatch) {
      throw new WodbusterAuthError('Login failed - no .WBAuth cookie received');
    }

    const cookieValue = `.WBAuth=${wbAuthMatch[1]}`;
    console.log('WodBuster auto-login successful');
    await saveCookie(cookieValue);
    return cookieValue;
  } finally {
    try { require('fs').unlinkSync(cookieJar); } catch {}
  }
}

// --- WodBuster API requests ---

function formatDateTicks(date) {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return Math.floor(utc.getTime() / 1000).toString();
}

let loginInProgress = false;

async function wodbusterRequest(path, retryOnAuth = true) {
  const cookie = await getCookie();
  const url = `${BOX_URL}${path}`;

  const res = await fetch(url, {
    headers: { Cookie: cookie },
    redirect: 'manual',
  });

  // WodBuster refreshes the session cookie on every successful request
  await captureRefreshedCookie(res);

  if (res.status === 302 || res.status === 301) {
    const location = res.headers.get('location') || '';
    if (location.includes('login')) {
      if (retryOnAuth) {
        return await retryAfterLogin(path);
      }
      throw new WodbusterAuthError();
    }
  }

  if (!res.ok) {
    throw new Error(`WodBuster API error: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();

  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    if (retryOnAuth) {
      return await retryAfterLogin(path);
    }
    throw new WodbusterAuthError();
  }

  return text;
}

async function retryAfterLogin(path) {
  if (loginInProgress) {
    await new Promise(r => setTimeout(r, 2000));
    return wodbusterRequest(path, false);
  }

  loginInProgress = true;
  try {
    await loginToWodBuster();
    return wodbusterRequest(path, false);
  } finally {
    loginInProgress = false;
  }
}

// --- Schedule scraper ---

let scheduleCache = { data: null, fetchedAt: 0 };
const SCHEDULE_TTL = 30 * 60 * 1000; // 30 minutes

async function fetchScheduleFromWebsite() {
  if (scheduleCache.data && Date.now() - scheduleCache.fetchedAt < SCHEDULE_TTL) {
    return scheduleCache.data;
  }

  const res = await fetch(PUBLIC_URL);
  const html = await res.text();

  const tableRegex = /<table class="horarios">[\s\S]*?<\/table>/gi;
  const tables = html.match(tableRegex);

  if (!tables || tables.length === 0) {
    return scheduleCache.data;
  }

  const schedule = parseScheduleTable(tables[0]);
  scheduleCache = { data: schedule, fetchedAt: Date.now() };
  return schedule;
}

function parseScheduleTable(tableHtml) {
  const schedule = {};

  const rowRegex = /<tr>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowRegex.exec(tableHtml)) !== null) {
    const row = match[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
    if (!cells) continue;

    const timeMatch = cells[0].match(/>([^<]+)</);
    const time = timeMatch ? timeMatch[1].trim() : null;
    if (!time) continue;

    const formattedTime = time.includes(':') && time.split(':').length === 2
      ? time + ':00'
      : time;

    for (let dayIdx = 1; dayIdx < cells.length && dayIdx <= 7; dayIdx++) {
      const dayOfWeek = dayIdx;
      if (!schedule[dayOfWeek]) schedule[dayOfWeek] = {};

      const classMatches = cells[dayIdx].match(/<span>([^<]+)<\/span>/gi);
      if (classMatches) {
        const classNames = classMatches
          .map(m => m.replace(/<\/?span>/gi, '').trim())
          .filter(n => n && n !== 'Open box');
        schedule[dayOfWeek][formattedTime] = classNames.length > 0 ? classNames[0] : null;
      }
    }
  }

  return schedule;
}

function findScheduleClass(schedule, dayOfWeek, apiTime) {
  const daySchedule = schedule?.[dayOfWeek];
  if (!daySchedule) return null;

  if (daySchedule[apiTime] !== undefined) return daySchedule[apiTime];

  const [h, m, s] = apiTime.split(':').map(Number);
  const apiMinutes = h * 60 + m;
  let bestMatch = null;
  let bestDist = Infinity;

  for (const [schedTime, schedName] of Object.entries(daySchedule)) {
    const [sh, sm] = schedTime.split(':').map(Number);
    const schedMinutes = sh * 60 + sm;
    const dist = Math.abs(apiMinutes - schedMinutes);
    if (dist <= 15 && dist < bestDist) {
      bestDist = dist;
      bestMatch = schedName;
    }
  }

  return bestMatch;
}

function slotExistsInSchedule(schedule, dayOfWeek, apiTime) {
  const daySchedule = schedule?.[dayOfWeek];
  if (!daySchedule) return true;

  if (daySchedule[apiTime] !== undefined) return true;

  const [h, m, s] = apiTime.split(':').map(Number);
  const apiMinutes = h * 60 + m;

  for (const schedTime of Object.keys(daySchedule)) {
    const [sh, sm] = schedTime.split(':').map(Number);
    const schedMinutes = sh * 60 + sm;
    if (Math.abs(apiMinutes - schedMinutes) <= 15) return true;
  }

  return false;
}

async function getClassAvailability(date) {
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

  let realSchedule = null;
  try {
    realSchedule = await fetchScheduleFromWebsite();
  } catch (err) {
    console.error('Error fetching schedule from website:', err.message);
  }

  if (!realSchedule || !realSchedule[dayOfWeek]) {
    return getApiOnlyClasses(date);
  }

  let apiClasses = [];
  let isRealData = false;
  try {
    const result = await getApiClassData(date);
    apiClasses = result.classes;
    isRealData = result.isRealData;
  } catch (err) {
    if (err instanceof WodbusterAuthError) throw err;
    console.error('Error fetching WodBuster API:', err.message);
  }

  const daySchedule = realSchedule[dayOfWeek];
  const usedApiIndices = new Set();
  const classes = [];

  for (const [time, name] of Object.entries(daySchedule)) {
    if (!name) continue;

    const match = matchApiEntry(apiClasses, time, name, usedApiIndices);

    if (match) {
      classes.push({
        id: match.id,
        name,
        time,
        available: isRealData ? match.available : false,
        full: isRealData ? match.full : false,
        alreadyBooked: isRealData ? match.alreadyBooked : false,
        capacity: isRealData ? match.capacity : null,
        booked: isRealData ? match.booked : null,
      });
    } else {
      classes.push({
        id: null,
        name,
        time,
        available: false,
        full: false,
        alreadyBooked: false,
        capacity: null,
        booked: null,
      });
    }
  }

  for (let i = 0; i < apiClasses.length; i++) {
    if (usedApiIndices.has(i)) continue;
    const api = apiClasses[i];
    if (api.isOpenBox) continue;

    const scheduleTimes = Object.keys(daySchedule);
    const apiMinutes = api.time.split(':').map(Number);
    const mins = apiMinutes[0] * 60 + apiMinutes[1];
    const alreadyCovered = scheduleTimes.some(t => {
      const [h, m] = t.split(':').map(Number);
      return Math.abs(h * 60 + m - mins) <= 15;
    });

    if (!alreadyCovered) {
      classes.push({
        id: api.id,
        name: api.name,
        time: api.time,
        available: isRealData ? api.available : false,
        full: isRealData ? api.full : false,
        alreadyBooked: isRealData ? api.alreadyBooked : false,
        capacity: isRealData ? api.capacity : null,
        booked: isRealData ? api.booked : null,
      });
    }
  }

  return { classes, realData: isRealData };
}

// Devuelve la MISMA forma que getClassAvailability ({classes, realData}). Antes devolvia
// un array pelado y quien lo consume hace wbResult.classes.map(...), asi que cualquier dia
// sin horario scrapeado reventaba con un 500.
async function getApiOnlyClasses(date) {
  const result = await getApiClassData(date);
  const classes = result.classes
    .filter(c => !c.isOpenBox)
    .map(c => ({
      id: c.id,
      name: c.name,
      time: c.time,
      available: result.isRealData ? c.available : false,
      full: result.isRealData ? c.full : false,
      alreadyBooked: result.isRealData ? c.alreadyBooked : false,
      capacity: result.isRealData ? c.capacity : null,
      booked: result.isRealData ? c.booked : null,
    }));
  return { classes, realData: result.isRealData };
}

async function getApiClassData(date) {
  const idu = process.env.WODBUSTER_USER_ID || '';
  const ticksSeconds = formatDateTicks(date);
  const paramsWithL = new URLSearchParams({ ticks: ticksSeconds, l: '1' });
  if (idu) paramsWithL.set('idu', idu);

  try {
    const text = await wodbusterRequest(`/athlete/handlers/LoadClass.ashx?${paramsWithL.toString()}`);
    let data;
    try { data = JSON.parse(text); } catch { throw new Error('Respuesta invalida de WodBuster (no es JSON)'); }
    if (data.Data && Array.isArray(data.Data) && data.Data.length > 0) {
      return { classes: parseApiResponse(data), isRealData: true };
    }
  } catch (err) {
    if (err instanceof WodbusterAuthError) throw err;
    console.error('Seconds ticks request failed:', err.message);
  }

  const ticksMs = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()).toString();
  const text = await wodbusterRequest(`/athlete/handlers/LoadClass.ashx?ticks=${ticksMs}`);
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('Respuesta invalida de WodBuster (no es JSON)'); }
  if (!data.Data || !Array.isArray(data.Data)) return { classes: [], isRealData: false };
  return { classes: parseApiResponse(data), isRealData: false };
}

function parseApiResponse(data) {
  return data.Data.flatMap(slot => {
    if (!slot.Valores?.length) return [];
    return slot.Valores.map(valor => {
      const plazas = valor.Valor?.Plazas || 0;
      const atletas = valor.Valor?.AtletasEntrenando?.length || 0;
      const alreadyBooked = valor.TipoEstado === 'Borrable' || valor.TipoEstado === 'Cambiable';
      const isOpenBox = valor.Valor?.IdTipoEntrenamiento === 2;
      const full = plazas > 0 && atletas >= plazas;
      return {
        id: valor.Valor?.Id,
        name: valor.Valor?.Nombre,
        time: slot.Hora,
        available: plazas > atletas && !alreadyBooked && !isOpenBox,
        full,
        alreadyBooked,
        isOpenBox,
        capacity: plazas,
        booked: atletas,
      };
    });
  });
}

function matchApiEntry(apiClasses, scheduleTime, scheduleName, usedIndices) {
  const [sh, sm] = scheduleTime.split(':').map(Number);
  const scheduleMinutes = sh * 60 + sm;

  const wodNames = ['Wod', 'Hyrox', 'Endurance', 'Haltero', 'Total Strength'];

  for (const preferNameMatch of [true, false]) {
    let bestMatch = null;
    let bestDist = Infinity;
    let bestIdx = -1;

    for (let i = 0; i < apiClasses.length; i++) {
      if (usedIndices.has(i)) continue;
      const api = apiClasses[i];
      if (api.isOpenBox) continue;

      const [ah, am] = api.time.split(':').map(Number);
      const apiMinutes = ah * 60 + am;
      const dist = Math.abs(scheduleMinutes - apiMinutes);

      if (dist > 15) continue;

      const namesMatch = api.name === scheduleName ||
        (wodNames.includes(api.name) && wodNames.includes(scheduleName));

      if (preferNameMatch && !namesMatch) continue;

      if (dist < bestDist) {
        bestDist = dist;
        bestMatch = api;
        bestIdx = i;
      }
    }

    if (bestMatch) {
      usedIndices.add(bestIdx);
      return {
        id: bestMatch.id,
        available: bestMatch.available,
        full: bestMatch.full,
        alreadyBooked: bestMatch.alreadyBooked,
        capacity: bestMatch.capacity,
        booked: bestMatch.booked,
      };
    }
  }

  return null;
}

async function bookClass(classId, date) {
  const ticks = formatDateTicks(date);
  const idu = process.env.WODBUSTER_USER_ID || '';
  const params = new URLSearchParams({ id: classId.toString(), ticks });
  if (idu) params.set('idu', idu);
  const text = await wodbusterRequest(
    `/athlete/handlers/Calendario_Inscribir.ashx?${params.toString()}`
  );

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { success: true, raw: text };
  }

  return { success: !data.Error, data };
}

async function validateSession() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const ticks = formatDateTicks(tomorrow);
    await wodbusterRequest(`/athlete/handlers/LoadClass.ashx?ticks=${ticks}`, false);
    return true;
  } catch (err) {
    if (err instanceof WodbusterAuthError) {
      try {
        await loginToWodBuster();
        return true;
      } catch (loginErr) {
        console.error('Auto-login failed:', loginErr.message);
        return false;
      }
    }
    throw err;
  }
}

module.exports = {
  getClassAvailability,
  bookClass,
  validateSession,
  loginToWodBuster,
  WodbusterAuthError,
  fetchScheduleFromWebsite,
  matchApiEntry,
};