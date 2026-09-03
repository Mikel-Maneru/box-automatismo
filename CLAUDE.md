# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Memory System — READ AT SESSION START

At the beginning of every session, read all memory files to restore context:
1. `memory/user.md` — User profile, role, working style
2. `memory/decisions.md` — Architecture and design decisions log
3. `memory/people.md` — People, stakeholders, contacts
4. `memory/preferences.md` — Coding style, communication, workflow preferences

These files are the persistent memory of this project. Read them before doing anything else.

## Memory System — UPDATE AT SESSION END

Before ending a session (or when learning something worth remembering), update the relevant memory file:
- New decision made? → `memory/decisions.md`
- Learned about a person? → `memory/people.md`
- Discovered a preference? → `memory/preferences.md`
- Updated user context? → `memory/user.md`

Write concise, structured entries. Do NOT duplicate info already in CLAUDE.md.

## Commands

- `npm run dev` — Express (nodemon, :3003) + Vite (:5173) in parallel via concurrently.
  Vite proxies `/api`, `/fotos` and `/widget` to :3003.
- `npm run server:dev` — Express only
- `npm run web:dev` — Vite only
- `npm run web:build` — vite-react-ssg build of `web/` into `public/`
- `npm start` — Express serving the build in `public/`
- `npm run web:install` — install the deps of `web/` (separate package.json)

Requires Node >= 20. `.env` is gitignored and is NOT in the repo; copy `.env.example` and fill it in
(`README.md` documents what each variable is for). Since the 2026-08-15 fix the server **does boot**
without the env vars — Supabase is lazy and the Anthropic client is deferred — so the static site
works, but chat, DB, email and WhatsApp stay broken until the keys are set.

**Never add a `build` script to the root package.json.** Vercel auto-runs it and that breaks the
deploy; the Vite build is deliberately named `web:build`.

## Brand naming — read before touching any string

- Public-facing name is **Anboto SC** (Strength & Conditioning), since the 2026-06-02 rebrand.
- The previous name "Anboto Fitness" survives **on purpose** in the Supabase slug
  `anboto-fitness` and in the Instagram handle `@anbotofitness`.
- Do NOT "fix" that slug. `schema.sql` seeds it and `src/lib/email.js` looks the box up by it.
- **The canonical domain is `anbotosc.com`** (decidido el 2026-08-18). `anbotofitness.com`
  NUNCA llegó a existir: devuelve NXDOMAIN en cualquier resolver. Toda referencia a ese
  dominio en `archive/alt-*.html` e `index.legacy.html` es residuo de archivos archivados.

## Architecture

Embeddable AI chat widget for CrossFit boxes. Box owners paste a `<script>` tag into their website;
the widget opens a floating chat that calls the backend, which loads box context from Supabase,
builds a system prompt, and calls Claude.

**Request flow:** Widget → POST /api/chat → load box from Supabase → buildSystemPrompt → Claude API → detect SIGNUP_DATA → return reply to widget

**The frontend lives in `web/` (React + Vite), not in hand-written HTML.**
`web/` is prerendered with `vite-react-ssg` and built into `public/` with `emptyOutDir: false`,
so the build does not wipe `fotos/`, `widget/` or `reservar.html`. The compiled output in `public/`
**is committed**, because that is what gets served. Express (`src/index.js`) serves `public/` plus
`/api/*` unchanged.

**Todo lo que hay en `public/` SE SIRVE.** Express sirve la carpeta entera y Vercel también,
así que ahí no se guarda nada "archivado". El 2026-09-01 se descubrió que cinco páginas
antiguas (`alt-1/2/3.html`, `index.legacy.html`, `reservar.legacy.html`) llevaban meses
respondiendo 200 en producción con la marca vieja y el teléfono del socio anterior. Están en
**`archive/`**, fuera de lo servido, y sus rutas **redirigen 301 a `/`** (en `vercel.json` y
en `src/index.js`). Ver `archive/README.md`.

**`api/` fue BORRADO el 2026-08-19 — y la nota anterior aquí decía lo contrario de la verdad.**
Este fichero afirmaba que `api/*` no se usaba en producción. **Era falso:** Vercel enruta
`/api/*` a las funciones de la carpeta `api/` ANTES que al Express, así que esas copias viejas
eran las que respondían y las de `src/routes/*` no llegaban a ejecutarse. Costó tres bugs en
producción (campos del formulario que se perdían, la recomendación por objetivo que no llegaba a
`/reservar`, y reservas hechas con la cuenta personal de Mikel pese a estar desactivadas).
Ahora `src/routes/*` es lo único que hay y lo único que corre. **No recrear `api/`.**
Si alguna vez hace falta separar funciones, hacerlo con una sola fuente de verdad.

**Signup flow (dual entry):**
1. **Chat:** Agent collects nombre/telefono/email/nivel conversationally, appends `SIGNUP_DATA:{json}` → chat.js strips it, calls createSignup
2. **Form:** Landing page form → POST /api/signup → createSignup → Supabase insert + notification

**Booking flow (WodBuster):** signup → scheduling email → `/reservar` → book in WodBuster →
follow-up email → WhatsApp. The website schedule is the source of truth for class names/times;
the WodBuster API only supplies availability (spots, capacity, IDs).

**Ojo con `realData`, y esta nota antes decía lo contrario de la verdad.** Afirmaba que solo
hoy y mañana devuelven datos reales. **Es falso:** comprobado el 2026-08-31, los seis días de
lunes a sábado devuelven `realData: true` incluso a 5 días vista. El único que cae a datos de
plantilla es el **domingo**, porque no hay clases guiadas — y esa plantilla trae un "Kickbox"
que ya no existe, así que es fácil confundirla con un horario real. **Antes de dar por buenos
unos horarios, mira `realData`.**

**La web pública de WodBuster sirve VARIAS tablas de horario a la vez** (el 2026-08-31 había
tres: "Anboto", "Abuztua" y "Anboto SC"). No son equivalentes y cada una vale para algo
distinto — ver la trampa nº7 en `memory/MEMORY.md` antes de tocar el scraper.

## NO borres los bundles anteriores de `public/assets/` al desplegar

Aprendido a base de romperlo el 2026-09-03. Los ficheros de `public/assets/` llevan un hash
en el nombre **precisamente para poder convivir**: mientras alguien tenga en el navegador (o
en un nodo de la CDN) el HTML del despliegue anterior, ese HTML pide los assets de ESE
despliegue. Si se han borrado, esa persona recibe **404 en el CSS y en el JS**, y la web se le
queda sin estilos y sin JavaScript — y como todo lo que aparece al hacer scroll depende del
JS, media pagina se le queda invisible.

Paso de verdad: durante una sesion con varios despliegues seguidos se fueron borrando los
bundles "huerfanos" en cada uno, y Chrome servia 404 a quien tuviera el HTML anterior.

**Regla: conservar al menos las DOS generaciones anteriores.** Pesan poco (~300 KB) y son la
red que evita romper a quien esta navegando justo en ese momento.

**Excepcion, y solo esa:** si un bundle viejo contiene algo que NO debe seguir sirviendose
—datos personales, un telefono retirado, una cifra falsa— entonces si se borra de inmediato,
asumiendo el riesgo. Comprobarlo con un `grep` antes, no de memoria.

Para recuperar uno borrado: `git show <commit>:public/assets/<fichero> > public/assets/<fichero>`.

## Cumplimiento legal — checklist para CUALQUIER web que recoja datos

Aplicable a este proyecto y a los siguientes. Se añadió el 2026-09-02 después de descubrir
que esta web llevaba meses recogiendo nombre, teléfono y email de personas reales sin nada de
esto. **Se monta desde el primer día, no al final: rehacerlo después cuesta el triple.**

1. **Aviso legal** (art. 10 LSSI). Obligatorio para una web de empresa en España. Datos del
   titular: nombre o razón social, NIF, domicilio y contacto.
2. **Política de privacidad** (RGPD art. 13): quién es el responsable, qué se recoge, para
   qué, base jurídica, **quién más lo ve** (todos los proveedores, uno a uno), plazo de
   conservación, derechos y reclamación ante la AEPD.
3. **Consentimiento en TODOS los puntos de recogida.** Aquí eran dos y el chat se pasó por
   alto en la primera revisión. Casilla **sin marcar de fábrica**, y validada **en el
   servidor**: la comprobación de cliente se salta con un `curl`.
4. **Guardar la prueba del consentimiento** (art. 7.1): momento (marca de tiempo del
   **servidor**) y **versión del texto** aceptado. Sin eso no se puede demostrar.
5. **Cero terceros que pongan cookies.** Autoalojar tipografías y no incrustar mapas ni
   vídeos. Sale más barato que mantener un banner, carga más rápido y evita el banner
   entero. Comprobarlo mirando las peticiones de red, no de memoria.
6. **Nunca registrar datos personales en los logs.** Ni `console.log(req.body)`. Los logs se
   guardan, se comparten y nadie declara su plazo de conservación.
7. **Escapar todo lo que escriba el usuario** antes de meterlo en HTML o en un correo.
   Validar la longitud no es validar el contenido.
8. **RLS activo desde el principio** en todas las tablas, aunque solo entre el backend con
   la service key. Cuesta una línea por tabla y es la segunda barrera si la clave se filtra.
9. **Procedimiento de borrado listo** antes de que alguien lo pida (`scripts/datos-personales.js`).
10. **Enlaces legales en el pie**, presentes en todas las páginas, y en el `sitemap.xml`.

**No soy abogado:** estos textos son redacciones estándar y deberían revisarse antes de
darlos por definitivos.

## Key technical constraints

- `dotenv` MUST use `{ override: true }` — system has ANTHROPIC_BASE_URL/AUTH_TOKEN from Ollama proxy that would shadow .env values
- Anthropic client MUST set `baseURL: 'https://api.anthropic.com'` explicitly
- Model: `claude-sonnet-4-5-20250929` (other sonnet model IDs don't exist on this account)
- Email is **Resend** (`RESEND_API_KEY`), not Gmail/Nodemailer
- WhatsApp is **Kapso** (`KAPSO_*`), not Twilio — `twilio` is still in package.json but unused
- WodBuster auth is a manual `.WBAuth` cookie; a CAPTCHA blocks fully automated login
- Vercel Hobby plan allows daily cron jobs only
- Signups table must exist in Supabase (created via schema.sql, not REST API)

## Key files

- `src/index.js` — Express server, dotenv override, helmet, rate limiting, static serving, routes
- `src/routes/chat.js` — POST /api/chat, SIGNUP_DATA detection, 20 msg limit, 10 msg history
- `src/routes/signup.js` — POST /api/signup
- `src/routes/scheduling.js` — GET /api/classes, booking endpoints, class descriptions map
- `src/routes/cron.js` — GET /api/cron/followup: WodBuster session keep-alive + follow-up emails
- `src/routes/webhook.js` — GET /api/followup/yes|no, renders inline thank-you pages
- `src/lib/prompt.js` — buildSystemPrompt with CrossFit persona + signup collection logic
- `src/lib/email.js` — createSignup() + Resend transport + WhatsApp notification
- `src/lib/whatsapp.js` — Kapso WhatsApp Cloud API client
- `src/lib/wodbuster.js` — WodBuster scraping/API client, session handling (largest file)
- `src/lib/supabase.js` — Supabase client, lazily built behind a Proxy
- ~~`api/`~~ — borrado el 2026-08-19: ensombrecia a `src/routes/*` en produccion

Frontend (edit here, never the compiled output):

- `web/src/data/site.js` — schedule, disciplines, coaches, reviews.
  `HERO_SLIDES` / `IG_PHOTOS` are the photo swap points.
- `web/src/i18n/dict.js` + `LangContext.jsx` — EU/ES dictionary and `<T>` helper
- `web/src/styles/global.css` — the brand skin, carried over verbatim; holds the design tokens
  (`--caliza`, `--pizarra`, `--brasa`, `--larre`; Archivo + Space Mono)
- `web/src/components/` — one component per section (Hero, Sections, Horarios, Faq, Signup, Nav…)
- `web/index.html` — SEO `<head>` and the two static JSON-LD blocks
- `public/index.html` — **compiled output of `web/`. Do not edit by hand.**
- `archive/` — landings anteriores, **fuera de `public/` para que no se publiquen**. Sus
  rutas redirigen 301 a `/`. No devolverlas a `public/`
- `public/widget/widget.js` — Embeddable vanilla JS chat widget (sessionStorage, floating button)
- `public/reservar.html` — Free-class booking page (still hand-written)
- `schema.sql` — Supabase DDL + Anboto seed data

## Stale docs — do not trust

- `design-system/anboto-crossfit/MASTER.md` — auto-generated and never the real brand
  (#F97316, #1F2937, Barlow). The real brand manual supersedes it; the live tokens are in
  `web/src/styles/global.css`.

`README.md` was rewritten on 2026-08-18 and matches this branch.

## Pending infrastructure

- signups table SQL needs to be executed in Supabase SQL Editor (can't create tables via REST)
- Membership plans and classes data for Anboto are empty in `schema.sql`. Since the 2026-08-25
  decision **no price is published anywhere**: there is no pricing section on the landing and the
  chatbot must not quote figures. See `memory/decisions.md`.
