const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const reservas = require('../lib/booking');
const { sendAlerta } = require('../lib/email');
const clases = require('../lib/clases');

// Reserva automatica en el proveedor. DESACTIVADA a proposito: la sesion es la
// CUENTA PERSONAL de Mikel, asi que cada clase de prueba quedaba reservada a su nombre.
// Mientras esta en off no se toca el proveedor: se guarda la peticion como pending y se
// avisa al box por email para que la reserve a mano. Poner WODBUSTER_AUTOBOOK=on cuando
// exista una cuenta del box (ver punto 4 de memory/people.md).
const AUTOBOOK = process.env.WODBUSTER_AUTOBOOK === 'on';

// Los nombres y descripciones de clase viven en shared/clases.json (fuente unica).


// GET /api/schedule -> parrilla semanal para la web.
// Cacheada en memoria: el horario de un box no cambia cada minuto, y asi una visita a la
// landing no dispara un scraping. Si el proveedor falla se devuelve 503 SIN cuerpo util:
// la web tiene su propio horario de respaldo y es preferible que lo use a enseñar un hueco
// vacio o un horario a medias.
// Se responde 200 con schedule:null en vez de 503: para la web no es un error, es 'no hay
// dato', y un 503 pintaria un error rojo en la consola del navegador en una pagina que
// funciona perfectamente.
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 h
let cacheHorario = { data: null, at: 0 };

router.get('/schedule', async (req, res) => {
  const fresco = cacheHorario.data && (Date.now() - cacheHorario.at) < CACHE_TTL;
  if (fresco) {
    return res.json({ schedule: cacheHorario.data, cached: true, proveedor: reservas.nombreProveedor });
  }
  try {
    const schedule = await reservas.getWeeklySchedule();
    if (!schedule || !Object.keys(schedule).length) {
      // Sin datos utiles: que la web se quede con el suyo.
      return res.json({ schedule: null, disponible: false });
    }
    cacheHorario = { data: schedule, at: Date.now() };
    res.json({ schedule, cached: false, proveedor: reservas.nombreProveedor });
  } catch (err) {
    console.error('Error obteniendo la parrilla semanal:', err.message);
    // Si hay una version cacheada aunque este vieja, mejor esa que nada.
    if (cacheHorario.data) {
      return res.json({ schedule: cacheHorario.data, cached: true, stale: true, proveedor: reservas.nombreProveedor });
    }
    res.json({ schedule: null, disponible: false });
  }
});

// GET /api/classes?date=YYYY-MM-DD
router.get('/classes', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Formato de fecha invalido (YYYY-MM-DD)' });
    }

    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (dateObj < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.json({ classes: [] });
    }

    // Domingo: el box abre, pero no hay clases guiadas en el sistema de reservas (el
    // proveedor devuelve ahi datos de plantilla, no reales). Se corta antes de preguntar
    // para no ofrecer clases que en realidad no existen.
    if (dateObj.getDay() === 0) {
      return res.json({ classes: [] });
    }

    // Horario y disponibilidad desde el proveedor activo
    let wbResult = { classes: [], realData: false };
    try {
      wbResult = await reservas.getClassAvailability(dateObj);
    } catch (err) {
      if (err instanceof reservas.BookingAuthError) {
        return res.json({ classes: [], error: 'auth', retry: true, message: 'Temporalmente no disponible' });
      }
      console.error('Error del proveedor de reservas:', err.message);
      return res.json({ classes: [], retry: true, message: 'Error obteniendo horarios' });
    }

    let classes = wbResult.classes.map(c => ({
      time: c.time,
      name: c.name,
      description: clases.descripcion(c.name),
      id: c.id || null,
      capacity: c.capacity,
      booked: c.booked,
      spots: (c.capacity != null && c.booked != null) ? c.capacity - c.booked : null,
      canBook: c.available && !!c.id,
      full: c.full || false,
    }));

    // Filter out past classes if today
    const now = new Date();
    const todayISO = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    if (date === todayISO) {
      classes = classes.filter(c => {
        const [h, m] = c.time.split(':').map(Number);
        const classStart = new Date(now);
        classStart.setHours(h, m, 0, 0);
        return classStart > now;
      });
    }

    res.json({ classes, realData: wbResult.realData });
  } catch (err) {
    console.error('Error obteniendo clases:', err.message);
    res.status(500).json({ error: 'Error obteniendo disponibilidad' });
  }
});

// POST /api/book
router.post('/book', async (req, res) => {
  try {
    const { token, classId, date, className, classTime } = req.body;
    if (!token || !date) {
      return res.status(400).json({ error: 'Faltan parametros' });
    }

    // Sin classId, intenta resolverlo consultando al proveedor
    let bookingClassId = classId;
    if (!bookingClassId && className && classTime) {
      try {
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const wb = await reservas.getClassAvailability(dateObj);
        // getClassAvailability devuelve {classes, realData}: iterar el objeto lanzaba
        // "wbClasses.find is not a function" y esta rama nunca resolvia la clase.
        const match = (wb.classes || []).find(c => c.time === classTime + ':00' && c.name === className);
        bookingClassId = match?.id;
      } catch (err) {
        if (err instanceof reservas.BookingAuthError) {
          return res.status(503).json({
            error: 'Temporalmente no disponible',
            retry: true,
            message: 'No podemos conectar con el sistema de reservas. Escribenos por WhatsApp al 622 768 134.',
          });
        }
      }
    }

    if (!bookingClassId) {
      return res.status(400).json({ error: 'No hemos encontrado esa clase. Escribenos por WhatsApp al 622 768 134 y te la reservamos.' });
    }

    // Validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from('signup_tokens')
      .select('id, signup_id, used, expires_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return res.status(404).json({ error: 'Token no encontrado' });
    }

    if (tokenData.used) {
      return res.status(400).json({ error: 'Este enlace ya ha sido utilizado' });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Este enlace ha caducado' });
    }

    // Get signup details
    const { data: signup } = await supabase
      .from('signups')
      .select('id, box_id, nombre')
      .eq('id', tokenData.signup_id)
      .single();

    if (!signup) {
      return res.status(404).json({ error: 'Signup no encontrado' });
    }

    // Reservar en el proveedor solo si el autobook esta activo (ver AUTOBOOK arriba).
    let bookingResult = { success: true };
    if (AUTOBOOK) {
      const [year, month, day] = date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      bookingResult = await reservas.bookClass(bookingClassId, dateObj);
    }

    // Save booking to Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('class_bookings')
      .insert({
        signup_id: signup.id,
        box_id: signup.box_id,
        wodbuster_class_id: bookingClassId,
        class_date: date,
        class_time: classTime || null,
        class_capacity: null,
        booking_status: !AUTOBOOK ? 'pending' : (bookingResult.success ? 'confirmed' : 'failed'),
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error guardando reserva:', bookingError);
      if (bookingError.code === '23514') {
        console.error('>>> Falta el ALTER que permite booking_status = pending. El aviso por email SI se ha enviado, asi que el lead no se pierde, pero la peticion no queda registrada. SQL en schema.sql.');
      }
    }

    // Mark token as used
    await supabase
      .from('signup_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    if (!bookingResult.success) {
      return res.status(500).json({ error: 'No se ha podido completar la reserva' });
    }

    if (!AUTOBOOK) {
      // Sin reserva automatica, el aviso al box es lo unico que hace que la plaza exista.
      await sendAlerta(
        'Clase de prueba solicitada: ' + signup.nombre,
        '<h2>' + signup.nombre + ' quiere una clase de prueba</h2>' +
        '<p><strong>Dia:</strong> ' + date + '</p>' +
        '<p><strong>Hora:</strong> ' + (classTime || 'sin especificar') + '</p>' +
        '<p><strong>Clase:</strong> ' + (className || 'sin especificar') + '</p>' +
        '<hr><p><strong>Hay que reservarla a mano en ' + reservas.nombreProveedor + '.</strong> La reserva ' +
        'automatica esta desactivada para no apuntar a la gente con una cuenta personal.</p>'
      );
    }

    res.json({
      ok: true,
      pending: !AUTOBOOK,
      booking: {
        date,
        time: classTime,
        name: signup.nombre,
        className: className || null,
      },
    });
  } catch (err) {
    if (err instanceof reservas.BookingAuthError) {
      return res.status(503).json({
        error: 'Temporalmente no disponible',
        retry: true,
        message: 'No podemos conectar con el sistema de reservas. Escribenos por WhatsApp al 622 768 134.',
      });
    }
    console.error('Error reservando clase:', err.message);
    res.status(500).json({ error: 'Error reservando la clase' });
  }
});

// GET /api/booking-status?token=XXX
router.get('/booking-status', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    const { data: tokenData } = await supabase
      .from('signup_tokens')
      .select('id, signup_id, used, expires_at')
      .eq('token', token)
      .single();

    if (!tokenData) {
      return res.json({ valid: false, reason: 'not_found' });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return res.json({ valid: false, reason: 'expired' });
    }

    // `objetivo` viaja a /reservar para recomendar clases con el mismo criterio que la web.
    const { data: signup } = await supabase
      .from('signups')
      .select('id, nombre, nivel, objetivo')
      .eq('id', tokenData.signup_id)
      .single();

    // Check if there's an existing booking
    const { data: booking } = await supabase
      .from('class_bookings')
      .select('class_date, class_time, booking_status')
      .eq('signup_id', tokenData.signup_id)
      .single();

    res.json({
      valid: true,
      used: tokenData.used,
      nombre: signup?.nombre,
      nivel: signup?.nivel,
      objetivo: signup?.objetivo || null,
      booking: booking || null,
    });
  } catch (err) {
    console.error('Error obteniendo estado de reserva:', err.message);
    res.status(500).json({ error: 'Error obteniendo estado' });
  }
});

module.exports = router;