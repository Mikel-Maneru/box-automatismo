# Decisions

## 2026-05-05: Rebrand from Anboto CrossFit to Anboto Fitness
- All user-facing text changed from "CrossFit" / "crossfiteros" to "Fitness" / "entrenamiento"
- CSS class names kept as-is since they're internal

## 2026-05-05: Design system applied (UI/UX Pro Max)
- Color palette: orange primary (#F97316), green CTA (#22C55E), dark bg (#1F2937)
- Typography: Barlow Condensed (headings) + Barlow (body)
- Style: Vibrant & Block-based, SVG icons (Heroicons-style)

## 2026-05-06: WodBuster integration for free class booking
- WodBuster URL: https://anboto.wodbuster.com (slug: anboto)
- Auth: Manual cookie (.WBAuth) — CAPTCHA prevents automated login
- WhatsApp: Kapso SDK instead of Twilio
- Flow: signup → scheduling email → /reservar → book in WodBuster → follow-up email → WhatsApp

## 2026-05-07: WodBuster is source of truth for schedule
- Real schedule scraped from public page (30 min cache)
- WodBuster API provides availability data only

## 2026-05-08: Schedule-first WodBuster integration (major refactor)
- Website schedule = primary source for class names/times
- WodBuster API = availability data (spots, capacity, IDs)
- `realData` flag: true for today/tomorrow, false for far dates
- Far dates show "reservas se abren 1-2 días antes", canBook=false
- API requires ticks in seconds + `l=1` + `idu` for real data
- Fallback: ms ticks for template data when real data unavailable
- Daily cron: WodBuster session keep-alive + WhatsApp alert on expiry
- Deployed to Vercel: https://box-automatismo.vercel.app

## 2026-05-12: Tarifas reales en la landing y en el chatbot
- Seccion de precios anadida a la landing, sin toggle de precio anual
- El prompt del chatbot incorpora las tarifas reales
- Plan ilimitado incluye plan de entrenamiento personalizado y seguimiento semanal por grupo de WhatsApp

## 2026-06-02: Redesign desplegado a producción (PR #1 merged → main, tag v3)
- PR #1 (rama feat/rediseno-premium-marca) MERGED a main → Vercel despliega producción. Tags: v1=original, v2=primer rediseño, v3=versión final desplegada.
- Hero final = inmersivo a sangre (estilo motionsites/LinkFlow) con fondo "boomerang" (crossfade ping-pong de fotos; listo para vídeo real si lo aportan).
- Identidad anti-genérica ("field-guide del monte"): secciones SIN tarjetas → listas editoriales (pico △ + número + filetes); hilo de altitud lateral 0→1.331 M (solo escritorio); arco/cúpula en secciones oscuras + cresta de montaña en footer; grano sutil, curvas de nivel, marca de agua Pico-A.
- Secciones añadidas: Disciplinas, Banda de cifras, Horario interactivo (orientativo — pendiente horario real exacto), Tu primera semana.
- Scrollbar oculta (scrollbar-width:none). hero-lab.html eliminado de producción (queda en historial).
- PENDIENTE/mejoras ofrecidas: fotos en alta o vídeo del box, horario real exacto, coaches con foto, testimonios en carrusel, euskera protagonista.

## 2026-06-02: Rebrand to Anboto SC + Pico-A logo + multilingual (manual V1.0 update)
- Brand manual V1.0 (updated) renames the brand: full "Anboto Strength & Conditioning", short "Anboto SC", or just "Anboto" when context is clear. NOT "Anboto Fitness" anymore. Lockup uses "STRENGTH & CONDITIONING" / compact "SC" (never "S.C." or "S&C").
- New logo = "Pico-A" symbol (triangle/mountain with the A crossbar in negative space). SVG path: `M50 10 L91 88 H9 Z M30 66 H70 V75 H30 Z` (fill-rule evenodd, currentColor). Used in nav, footer, hero watermark, favicon (SVG data URI, brasa pico on pizarra). Palette/fonts/voice unchanged from prior manual.
- User decision: apply Anboto SC name; keep domain anbotofitness.com, @anbotofitness, anbotocf@gmail.com as-is; SEO keeps location keywords + alternateName ["Anboto SC","Anboto Fitness"] for continuity.
- Web is now MULTILINGUAL EUS/ES: ES|EU toggle in nav, localStorage `anboto_lang`, sets <html lang>, ES is SEO base. i18n via data-i18n dictionary in index.html. Form option VALUES stay in Spanish ("Sin experiencia"...) so backend `nivel` logic (and reservar.html recommended-Oinarriak) keep working.
- Committed on branch feat/rediseno-premium-marca (PR #1 updated). Verified ES+EU at 1440/390, 0 console errors, 0 overflow.
- Earlier files attached were Bidener's manual by mistake (1st time); 2nd attach was the correct Anboto manual.

## 2026-06-02: Premium redesign on REAL brand manual (corrects MASTER.md)
- The real Anboto brand manual (V1.0, user-provided PDF/HTML) OVERRIDES the auto-generated `design-system/anboto-crossfit/MASTER.md`. The old MASTER (orange #F97316 + dark slate #1F2937, Barlow) was NOT the real brand.
- Real system "Piedra, Brasa y Larre": Pizarra `#1B1A18`, Granito `#6E6960`, Bruma `#DAD5CB`, Caliza `#F6F3EC` (fondo 60%, cálido — no blancos fríos/negros puros), Brasa `#E16C34` (acento/CTA), Larre `#3E8B5C` (secundario). Fonts: **Archivo** (Black 900 display) + **Space Mono** (datos/etiquetas).
- Motivos firma: foto recortada en **arco**, viñeta **△ pico**, flecha ↑ progreso, sello **↑ 1.331 M**. Voz bilingüe EUS/ES, sin gritos ni emojis. Promesa: "Ven como estás. Sube a tu ritmo. Llega más lejos."
- Redesign de `public/index.html` + `public/reservar.html` (solo visual reservar) en rama `feat/rediseno-premium-marca` → PR #1. Tags: `v1` = versión anterior, `v2` = rediseño. Producción (main) intacta hasta merge.
- Corregido número WhatsApp del CTA: era `34688816982`, correcto `34688661924`.
- NOTA: los archivos del manual (.pdf/.html) y artefactos de dev quedaron sin trackear en el repo; no commitear. La 1ª vez el usuario adjuntó por error el manual de **Bidener**.

## 2026-08-15: Migración de la landing a React + Vite (rama feat/react-vite-migration)
- Decisión del usuario: migrar `public/index.html` a app **React + Vite** para usar **react-bits** directamente (por encima de "portar efectos a vanilla"). Base = web actual; contenido y funcionalidad intactos; fotos actuales como placeholders del nuevo centro (obras en marcha).
- App en `web/` (Vite + React JSX + CSS, sin Tailwind). Prerender estático con **vite-react-ssg**: `<head>` SEO + 2 JSON-LD estáticos en `web/index.html`, cuerpo prerenderizado → SEO intacto. Build a `../public` con `emptyOutDir:false` (no borra fotos/widget/reservar). Express (`src/index.js`) sigue sirviendo `public/` + `/api/*` + `/widget` + `/fotos` + `/reservar` sin cambios.
- Paridad 1:1: piel CSS **verbatim** (`web/src/styles/global.css`), i18n EU/ES completo (`web/src/i18n/dict.js` + `LangContext` + `<T>`), datos en `web/src/data/site.js` (SCHED, disciplinas, coaches, reseñas, tarifas, **HERO_SLIDES/IG_PHOTOS = puntos de intercambio de foto**), un componente por sección, formulario con contrato `POST /api/signup` intacto (honeypot incl.), ChatWidget carga `/widget/widget.js`.
- Efectos react-bits (contención, brand-mapped): **ShinyText** (shimmer en 4 CTA brasa), **Magnet** (CTA hero, solo puntero fino), **fondo de curvas de nivel/altitud** en `#apuntarse`. Todos con `prefers-reduced-motion` y mobile-first.
- Scripts: `npm run dev` = concurrently Express+Vite (Vite proxya /api,/fotos,/widget a :3003); `npm run build` = vite-react-ssg → public; `npm start` = Express sirve el build. Original conservado como `public/index.legacy.html`.
- Verificado en navegador 375/768/1440: 0 errores consola, 0 overflow horizontal, toggle ES/EU, horario interactivo + día de hoy, FAQ acordeón, widget, prerender con 12 secciones + JSON-LD. Commits por fase en `feat/react-vite-migration` (aún NO mergeado a main).
- PENDIENTE: fotos reales del nuevo centro; validar visualmente efectos WebGL más pesados (Threads/Waves/Particles) cuando el panel del navegador esté visible.
- DEPLOY (2026-08-15): preview desplegado y verificado → https://box-automatismo-jzawrzxs9-mikel-manerus-projects.vercel.app (público; SSO protection del proyecto DESACTIVADA a petición del usuario). Producción (`anbotofitness.com`) intacta. Para salir a producción: `vercel --prod`.
  - **Gotcha Vercel**: el proyecto es **Framework Preset = `express`** → Vercel envuelve `src/index.js` como UNA función que sirve TODO (estático `public/` + `/api` vía Express). NO usa los `api/*.js` sueltos ni hace build de Vite. El landing compilado debe estar en `public/` (commiteado). NO poner un script `build` en package.json raíz (Vercel lo auto-ejecuta y rompe): se renombró a `web:build`.
  - **Fix de arranque**: `src/lib/supabase.js` ahora es lazy (Proxy) y `src/routes/chat.js` guarda el `new Anthropic` — así la función arranca sin todas las env (los previews no heredan las env de production; por eso crasheaba con "SUPABASE_URL obligatorias"). El formulario en PREVIEW no guarda (env solo en production); en producción funciona.
  - Deploy vía `vercel` CLI con token de cuenta (`--scope=team_Ui7yFZ02hiIaqHBTalIHAOQP`); la integración Git↔Vercel está inactiva desde el 12-may (no auto-despliega en push).

## 2026-08-16: Paleta y logo REALES del manual (medidos del PDF a alta resolución)
- El código antiguo (index.legacy) usaba un naranja BRILLANTE `#E16C34` y verde `#3E8B5C` que NO son del manual. El manual "Negro, Madera y Piedra" es TERROSO.
- **Paleta oficial (medida por píxel del `AnbotoManual.pdf`)**: Pizarra `#0E0C0A` (usamos `#14110E` en UI), Granito `#777069`, Niebla/Bruma `#D1C8C1`, Caliza `#F4EDE2`, **Madera cálida `#A7693B`** (ACENTO/CTA — terracota terrosa, NO naranja chillón), **Cuero `#703D26`** (marrón), **Salvia `#59704D`** (verde apagado, NO verde brillante).
- **Logo**: isotipo = **pico de montaña facetado** (hombros + ranura de base), NO un triángulo plano. Trazado aproximado en `web/src/components/icons.jsx` (Pico). PENDIENTE: pedir al usuario el SVG/PNG original del logo para pixel-perfect (el PDF está aplanado).
- El manual es de estética CÁLIDA (fondos crema), pero el sitio se hizo OSCURO-premium por elección del usuario. Tensión a vigilar: si pide "aplicar el manual" puede referirse a ir más cálido, no solo a los hex.

## 2026-08-18: Dominio anbotosc.com EN PRODUCCION (y por que fallo antes)
- **ERROR INICIAL**: se apuntaron los nameservers de IONOS a `ns1-4.vercel-dns-3.com`. Vercel tenia
  el dominio como "Third Party" y NUNCA creo la zona → esos NS respondian REFUSED → SERVFAIL global.
  **No era propagacion**: no habria funcionado nunca. Se perdieron ~5h esperando en balde.
- **REGLA**: los nameservers `vercel-dns*.com` SOLO valen si Vercel gestiona el DNS del dominio
  (`vercel dns ls` devuelve registros). Si `vercel domains inspect` muestra "Intended Nameservers"
  VACIO, la via de nameservers NO esta disponible → hay que usar registros A/CNAME.
- **CONFIGURACION BUENA (la actual)**: NS de IONOS + `A @ 76.76.21.21` + `CNAME www cname.vercel-dns.com`,
  `www.anbotosc.com` añadido al proyecto Vercel con redirect 308 al apex.
- El certificado TLS NO se emite solo: hubo que forzarlo con `vercel certs issue`.
- Verificado: https://anbotosc.com 200 OK, www redirige 308, Vercel `verified:true misconfigured:false`.
- Diagnostico rapido de este fallo: SERVFAIL (no NXDOMAIN) + "Query refused" al preguntar al NS.
- `anbotosc.com` es el dominio DEFINITIVO y esta registrado. `anbotofitness.com` no existe en el
  registro `.com` (NXDOMAIN) y no se recupera; el SEO ya lo da por zanjado. Tema cerrado.

## 2026-08-19: Limpieza de codigo muerto — DECIDIDO, PENDIENTE DE EJECUTAR
Inventario de lo que sobra en el repo y decision de Mikel sobre cada cosa:

**SE BORRA:**
- **`api/` (8 archivos)**: `book.js`, `booking-status.js`, `chat.js`, `classes.js`,
  `cron/followup.js`, `followup/no.js`, `followup/yes.js`, `signup.js`. Son copias serverless
  legacy que Vercel NO invoca (framework preset `express` → todo pasa por `src/index.js`).
  **Dato que lo confirma como problema real:** el commit `017f05c` (quitar WhatsApp) tambien
  toco `api/cron/followup.js` y `api/followup/yes.js` — o sea, se esta manteniendo codigo
  muerto sin darse cuenta. Esa es justo la razon de borrarlo.
- **Dominio `send.anboto.sc` en Resend**: creado por error (`anbotosc.com` partido mal),
  quedo en "Not Started". El bueno es `send.anbotosc.com` y ya esta Verified.

**NO se borra (decision explicita):**
- `public/index.legacy.html` y `public/reservar.legacy.html` (121 KB): CLAUDE.md dice que se
  conservan como referencia. Borrarlos contradiria una decision ya documentada.
- `deploy-anbotosc.sh`: ya no sirve (el dominio esta en produccion) pero se deja.
- Las 9 lineas de `KAPSO_*` / `TWILIO_*` / `GMAIL_*` del `.env`: el codigo ya no las lee,
  pero se quedan por ahora.

**Al borrar `api/`**: hacerlo en un commit APARTE, para poder revertir solo eso si algo falla.

## 2026-08-19: Dominio de envio propio send.anbotosc.com (Resend) — VERIFIED
- Se envia desde un SUBDOMINIO, no desde el apex: si un envio quema la reputacion, se quema la
  del subdominio y no la del correo normal del box. Es lo que recomienda Resend.
- Region **Ireland (eu-west-1)**: el box esta en España, mejor latencia y datos en la UE.
- 3 registros en IONOS bajo `anbotosc.com` (host corto, IONOS añade el dominio solo):
  `TXT resend._domainkey.send`, `MX send.send` (prio 10) y `TXT send.send` (SPF).
- NO se añade el MX de "Enable Receiving": es para RECIBIR correo, no hace falta.
- Los registros de correo del box (MX/SPF/DKIM/DMARC en `@`) quedan intactos: Resend cuelga
  de `send.*`, no del apex. Por eso no hay conflicto.
- **TRAMPA**: el dominio se creo primero como `send.anboto.sc` (`anbotosc.com` partido mal).
  Con ese nombre los registros no habrian verificado jamas. Leer el nombre caracter a caracter.
- Verificado en 9 minutos (00:15 alta → 00:21 DNS verified → 00:24 Domain verified).
- PENDIENTE: `MAIL_FROM=Anboto SC <hola@send.anbotosc.com>` en Vercel + envio de prueba.

## 2026-08-18: vercel.json — no inventar claves `services`
- Alguien (sesion anterior) metio en `vercel.json` un rewrite con `"destination": {"type":"service"}`
  y un bloque top-level `"services"`. **Ninguna de las dos es sintaxis valida de Vercel**
  (`destination` debe ser un string). Habria roto el deploy. Revertido a la version commiteada.
- El proyecto es Framework Preset = `express`: NO necesita bloque de servicios.

## 2026-08-18: Rediseño de chat widget + favicon theme-aware
- **Widget**: "burbuja pico" personalizada con paleta Anboto (madera #A7693B, cuero #703D26, caliza #F4EDE2)
  - Archivo: `public/widget/widget.js` líneas 47-61
  - Paleta: pizarra #14110E, granito #777069, bruma #D1C8C1, caliza #F4EDE2, madera #A7693B, cuero #703D26
- **Favicon**: Theme-aware (pico en negro light theme, caliza dark theme)
  - Archivos: `web/index.html` y `public/reservar.html`
  - Implementación: SVG data URI + CSS media query + JavaScript matchMedia
- **Seguridad**: Vercel token rotado tras exposición accidental

## 2026-08-18: Phase 2 iniciada — Reorganización de clases por objetivo (EN PLANNING)
- **Requisitos cliente**: 
  1. Clases por objetivos (salud, rendimiento, musculación, pérdida de grasa, principiante)
  2. Formulario mejorado: "¿Cómo te enteraste?" + "¿Objetivo?"
  3. App de clase gratuita con recomendaciones por objetivo
  4. API WodBuster para disponibilidad real
  5. Chat widget con token del cliente (no personal)
- **Exploración**: WodBuster API existe (`src/lib/wodbuster.js`), landing data en `web/src/data/site.js`, Signup.jsx, widget architecture en `public/widget/widget.js`
- **PENDIENTE**: Responder 4 preguntas de clarificación para finalizar plan (mapeo clases, token chat, ubicación app, campos formulario)

## Key technical constraints
- `dotenv` MUST use `{ override: true }`
- Anthropic client MUST set `baseURL: 'https://api.anthropic.com'`
- Model: `claude-sonnet-4-5-20250929`
- Email: **Resend** (`RESEND_API_KEY`). Gmail/Nodemailer ya no se usa.
- **WhatsApp: ELIMINADO** (2026-08-19, commit `017f05c`). Ya no hay notificaciones por WhatsApp:
  fuera Kapso, fuera `src/lib/whatsapp.js` y fuera las env `KAPSO_*`. Los avisos de alta van
  **solo por email (Resend)** a `anbotocf@gmail.com`. Twilio tampoco se usa.
- Vercel Hobby plan: only daily cron jobs allowed
- `.env` no esta en el repo. Desde el fix del 2026-08-15 el servidor SI arranca sin las env
  (supabase lazy via Proxy, cliente Anthropic diferido), pero chat/BD/email/WhatsApp no funcionan
  hasta rellenarlas. En `main` ese fix no existe todavia y el arranque falla.
## 2026-08-19: Fase 2 desplegada a produccion y email operativo

**Lo que salio a produccion** (`vercel --prod`, verificado con el bundle servido == el del repo):
clases por objetivo, formulario con objetivo + "como nos conociste", `/reservar` en React,
eliminacion de WhatsApp y el SEO apuntando a `anbotosc.com`.

**`OBJETIVOS` es la fuente unica de verdad** (`web/src/data/site.js`): la seccion de clases
filtra con ella y el formulario recomienda con ella, para que web y alta no puedan contradecirse.
El primer elemento de `clases` es la puerta de entrada. El objetivo viaja despues a `/reservar`
via `GET /api/booking-status`, que ahora devuelve `objetivo`.

**Decision de diseno: un solo hueco recomendado.** En `/reservar` se marca UNA sola clase, no
todas las del objetivo. Se probo lo contrario y salian 7 de 10 huecos insignados (la mayoria del
dia son WOD), con lo que el badge dejaba de significar nada.

**Correo del box en vez del personal.** `NOTIFY_EMAIL=anbotocf@gmail.com` y remitente propio
`MAIL_FROM=Anboto SC <hola@send.anbotosc.com>`. El remitente es ahora una variable de entorno,
no una constante en el codigo.

**Trampa que costo la sesion: API key de la cuenta equivocada.** Ver `project_status.md`. Resumen:
un dominio verificado en una cuenta de Resend es invisible para una clave de otra cuenta, y el
mensaje de error habla de "domain is not verified" aunque el DNS este perfecto.

**Bugs de terceros corregidos de paso** (estaban rotos desde antes):
- `getApiOnlyClasses` devolvia un array pelado mientras `getClassAvailability` devuelve
  `{classes, realData}` → cualquier dia sin horario scrapeado daba un 500.
- `POST /api/book` hacia `.find()` sobre ese objeto → la rama que resuelve la clase cuando no
  llega `classId` no funciono nunca.

**Regla de trabajo confirmada otra vez: verificar el resultado, no el paso.** Ni el "Verified"
del panel de Resend ni el "ready" de Vercel prueban nada. Lo que prueba es un envio real que
devuelve id, y el hash del bundle servido coincidiendo con el del repo.

## 2026-08-19: Chat a la cuenta de Xabi + dos bugs de datos del chatbot

**Cuenta migrada.** Xabi creo la organizacion en console.anthropic.com con SU metodo de pago,
metio creditos e invito a Mikel como admin. Se cambio `ANTHROPIC_API_KEY` en Vercel (production)
y se redesplego: **las variables de entorno NO se aplican hasta el siguiente deploy**. Verificado
con una peticion real a `/api/chat` en produccion. Paga Xabi, Mikel conserva el control.
Orden util: **validar la clave contra la API antes de tocar produccion** (una llamada minima a
`/v1/messages`), asi no se despliega una clave invalida o sin credito.

**Los dos bugs del chatbot eran DATOS en Supabase, no codigo.** `prompt.js` interpola tal cual
lo que haya en las columnas JSONB del box, asi que basura dentro = basura en el prompt:
1. `boxes.membership_plans` tenia 4 planes ANUALES retirados de la web el 2026-05-12. El bot
   ofrecia "12 clases por 780 EUR/ano". Se dejaron solo los 4 mensuales + 2 bonos.
2. `boxes.classes` guardaba un cuadrante semanal `{day, classes:[...]}` con IDs de WodBuster
   (y un "Kickbox" inexistente), pero `prompt.js` espera `{name,duration,level,description}`:
   generaba `- undefined (undefined, nivel undefined): undefined`. Se sustituyo por las 6
   disciplinas reales **con el objetivo escrito dentro de la descripcion**, para que el bot
   recomiende igual que la web sin tener que tocar `prompt.js`.

Resultado verificado en vivo: "cuanto cuesta" -> solo mensuales y bonos; "quiero ganar musculo"
-> Total Strength y Halterofilia, que es exactamente `musculacion` en `OBJETIVOS`. Con esto los
cuatro sitios (seccion de clases, formulario, /reservar y chatbot) recomiendan con el mismo mapa.

**Falsa alarma documentada:** `conversations.session_id` es UUID NOT NULL. Probar `/api/chat` a
mano con un `sessionId` cualquiera devuelve 500 "Error al crear conversacion" y parece que el
chat esta roto. No lo esta: el widget manda `null` la primera vez y el backend genera el UUID.
Al probar a mano, omitir `sessionId`.

## 2026-08-25: El cliente no quiere precios en la web — tarifas fuera de los 4 sitios

Peticion del cliente: que no aparezca **nada** de tarifas en la web. Los precios estaban en
cuatro sitios distintos, no solo en la seccion de precios, asi que se limpiaron todos:

1. **Seccion `#tarifas`**: borrada. Con ella se fueron `PLANS` de `web/src/data/site.js`, el
   componente `Tarifas()` de `Sections.jsx`, las 12 lineas de claves `t.*` de `dict.js`, la clave
   `nav.prices` y el enlace `#tarifas` de `Nav.jsx` (escritorio y movil), y ~35 reglas de
   `global.css` (`.price-grid`, `.plan*`, `.extras`, `.bonos`, `.bono*`, `.activities`, mas sus
   entradas en los bloques responsive y en el tema oscuro).
2. **Bonos** (60 EUR / 100 EUR): estaban **hardcodeados en el JSX**, no en `site.js`. Se fueron con
   la seccion. Si alguien vuelve a buscar precios en `site.js` y no los encuentra, era por esto.
3. **Datos estructurados**: `"priceRange": "60-95 EUR"` fuera del JSON-LD de `web/index.html`
   (que es la plantilla comun, asi que tambien desaparece de `public/reservar.html` al compilar).
4. **Chatbot**: era el sitio menos evidente y el que mas importaba. Dos cambios en `prompt.js`:
   - Se **elimino la interpolacion de `box.membership_plans`** y el bloque `Membresias:` del
     prompt. Ahora los importes de Supabase **no llegan al modelo**, asi que no puede citarlos
     aunque la columna siga llena. Esta es la parte que de verdad lo garantiza.
   - La regla de precios pasa de "comparte las tarifas disponibles" a no dar ninguna cifra, rango
     ni "desde", derivar al telefono/WhatsApp y ofrecer la clase gratuita.

**Se salva el CTA de la prueba gratuita.** El bloque "Primera clase 100% gratis" vivia DENTRO de
la seccion de tarifas. Borrar la seccion entera se habria llevado un punto de conversion a mitad
de pagina, asi que se extrajo a su propia banda (`PruebaGratis()`, `#prueba-gratis`, entre
Horarios y Coaches) con claves `pg.*`. Reutiliza el `.trial` de siempre mas un `.trial-band` que
lo pone en fila en escritorio y en columna por debajo de 760px. No se metio en la seccion
"Apuntate" porque ya dice lo mismo ("Tu clase gratis te espera", badge "1a clase gratis"): habria
sido duplicar el mensaje.

**Los indices de seccion son texto a mano en `dict.js`**, no un contador. Al quitar la 04 habia
que renumerar o quedaba un salto 03 -> 05: Equipo 04, Opiniones 05, FAQ 06, Apuntate 07,
Instagram 08. La banda nueva **no lleva indice** a proposito (es un CTA, no una seccion mas).
Ojo: `step.idx` y `p.idx` siguen con numeros viejos pero sus componentes (`Empezar`,
`SobreNosotros`) **no se renderizan** en `App.jsx`, asi que no se tocaron.

**Verificado en el DOM compilado** (servidor local sobre `public/`, no solo en el fuente):
0 coincidencias de `N EUR` y de tarifa/precio/mensual/bono en ES **y** en EU, `#tarifas`
inexistente, nav sin el enlace, indices 01-08 seguidos, banda en fila a 1280px y en columna a
375px sin overflow, 0 errores de consola, y los dos JSON-LD validos y sin `priceRange`.

**PENDIENTE (lo tiene que hacer Mikel, no hay claves en el repo):** vaciar
`boxes.membership_plans` en Supabase. Ya no es imprescindible — el prompt no lee esa columna —
pero deja de haber precios retirados guardados en la BD. Y **revisar `boxes.faqs` y
`boxes.extra_info`**: esos SI siguen entrando en el prompt y si alguien escribio importes ahi,
el bot los tendria delante (la regla del prompt se lo prohibe, pero el dato es la defensa buena).

### Desplegado y verificado en produccion (25-08-2026)

`vercel --prod` desde `main` (`3430732`). Deploy `dpl_8mpxqPAq3vXwsQVnT1MztCH5aAW6`.
Comprobado contra el dominio, no contra el "ready" del CLI:

| Comprobacion | Antes | Despues |
|---|---|---|
| Bundle servido en anbotosc.com | `app-DlvqwfBE.js` | `app-CNg4DcFO.js` (= el del repo) |
| `priceRange` en el JSON-LD | 1 | 0 |
| `id="tarifas"` | 1 | 0 |
| Importes en el HTML | 4 | 0 |
| Simbolo € | — | 0 |
| Palabras tarifa/precio/mensual/bono | — | 0 |

Tambien: `/reservar` 200 con 0 importes, `www` sigue redirigiendo 308, `/health` ok, y los dos
JSON-LD de ambas paginas validos y sin `priceRange`.

**El chatbot se probo en produccion con dos peticiones reales** (es la parte que de verdad podia
filtrar precios). Pregunta normal y luego presion insistiendo en "un rango" o "un desde X":
en las dos deriva al telefono del box y ofrece la clase gratuita, **0 cifras**. La regla aguanta.
(El telefono de aquella prueba era el 688 661 924; el 2026-08-31 paso a ser 622 768 134.)

**Detalle observado, por si molesta:** el bot nombra TIPOS de plan sin importes ("ilimitado, dias
sueltos, bonos..."). No sale de `membership_plans` (ya no se interpola): lo improvisa, o viene de
`faqs`/`extra_info`. Si el cliente considera que eso ya es "hablar de tarifas", hay que endurecer
la regla de `prompt.js` para que tampoco enumere tipos de plan.

**Nota de entorno:** `vercel link` creo un `.env.local` con un `VERCEL_OIDC_TOKEN` (ignorado por
git) y añadio un `.env*` redundante al `.gitignore` que se revirtio: `.env` y `.env.local` ya
estaban en las lineas 2 y 3, y ese patron ademas tapaba `.env.example`, que SI va trackeado.

## 2026-08-25: Migracion a AimHarder — capa de proveedor y mapa unico de clases

**El box se pasa a AimHarder** (aun no ha migrado). Dos peticiones del cliente: que el horario
de la web se actualice solo cuando cambien una clase, y que la prueba gratuita deje de
reservarse con la cuenta personal de Mikel.

**Decision de arquitectura: capa de proveedor** (`src/lib/booking/`). Las rutas dejan de
importar un proveedor concreto; `index.js` elige con `BOOKING_PROVIDER` y reexporta la interfaz
(`getClassAvailability`, `bookClass`, `validateSession`). Cambiar de sistema pasa a ser una
variable de entorno. `wodbuster.js` se movio dentro sin tocar su logica y `aimharder.js` queda
como esqueleto que falla con un mensaje explicito.

**Detalle que importa:** `BookingAuthError` vive en `errors.js` y es COMPARTIDO. Las rutas hacen
`instanceof` para distinguir "sesion caducada" de un fallo cualquiera; si cada proveedor
definiera su propia clase, esa comprobacion fallaria en silencio justo al cambiar de proveedor.

**Sobre la API de AimHarder:** lo que circula por internet es ingenieria inversa, sin
documentacion oficial. **No se construye la escritura sobre eso.** Pero AimHarder resuelve la
prueba gratuita SIN API: publica una pagina de bonos donde el interesado se registra el mismo y
reserva, con lo que la reserva queda a SU nombre. Esa es la via elegida. Detalle en `people.md`
punto 11.

**Mapa unico de nombres de clase** (`shared/clases.json`), que leen backend y frontend. Estaba
duplicado en tres sitios y se habia desincronizado sin dar ningun error. Ver trampa 4 en
`MEMORY.md`.

**Pendiente:** Fase 2 (horario automatico con red de seguridad, que se puede hacer ya contra
WodBuster) y Fase 3 (prueba gratuita, bloqueada por la URL que tiene que dar Xabi). Plan
completo en `~/.claude/plans/c-users-mikel-downloads-anbotomanual-pd-whimsical-raccoon.md`.

## 2026-08-31: El horario se lee solo, con red de seguridad

**Problema:** la parrilla estaba escrita a mano y se quedaba vieja cada vez que el box
cambiaba una clase. Paso de verdad: Xabi la cambio y la web siguio mintiendo.

**Decision: leer del proveedor PERO conservar el estatico.** `GET /api/schedule` sirve la
parrilla del proveedor cacheada 6 h; `Horarios.jsx` la pide al montar y solo sustituye si
trae dias con franjas. `SCHED` en `site.js` deja de ser "el horario" y pasa a ser "el
ultimo horario conocido bueno": es lo que se prerenderiza (bueno para SEO y para el primer
pintado) y lo que se muestra si el proveedor falla. **Media respuesta seria peor que el
respaldo**, por eso la comprobacion de que trae dias con contenido.

**Decision menor pero deliberada:** el endpoint responde 200 con `schedule:null` cuando no
hay dato, no 503. Un 503 pinta un error rojo en la consola del navegador en una pagina que
funciona perfectamente, porque la web tira del respaldo sin inmutarse.

**Decision de vocabulario:** los alias de `shared/clases.json` mapean los nombres del box
(INICIACION, HYCROSS, STRENGTH) a los de la web (Oinarriak, Hyrox, Total Strength). Se
eligio asi porque el titulo y el SEO de la pagina ya usan "Hyrox" y porque mantiene el
vocabulario unico en las cuatro pantallas (horario, seccion de clases, /reservar y chatbot),
con lo que la recomendacion por objetivo sigue casando.
**Suposicion asumida:** que HYCROSS es Hyrox renombrado (lo habitual, por ser marca
registrada). Si resultan ser cosas distintas, hay que separarlos.

**Pendiente de decidir por el cliente:** ~~si mostrar las clases de ALLUITZ~~ (decidido el
2026-08-31, ver abajo) y corregir las cifras de la landing, que dicen "46+ miembros activos"
cuando 46 es el numero de resenas de Google.

## 2026-08-31: Se muestran las clases de Alluitz, con el horario nuevo entero

Decision de Mikel tras ver los datos. **Contexto que la hace no obvia:** la web publica de
WodBuster servia TRES tablas de horario a la vez ("Anboto", "Abuztua" y "Anboto SC") y solo
la ultima tiene Alluitz. El scraper cogia `tables[0]` por posicion.

**Que se eligio:** pasar la parrilla de la web al horario titulado con la marca actual
("Anboto SC"), completo, incluyendo las clases de Alluitz.

**Coste asumido a sabiendas.** Se comprobo contra la disponibilidad real de mañana que **ese
horario todavia NO esta en el sistema de reservas**: la API devuelve 10:15 WOD y 12:45 WOD
donde la tabla nueva dice 10:30 Funcional y 12:30 WOD, y de Alluitz solo es reservable
`GYMNASIO + OPEN`. Es decir, la web enseña clases que hoy no se pueden reservar. Se avisó a
Mikel antes de desplegar y aun asi se eligio esta opcion, porque es el horario que el box
quiere enseñar. **La solucion de fondo es que Xabi pase el horario nuevo a WodBuster.**

**Como se implemento sin romper las reservas:** los dos usos de la tabla se separaron.
`fetchScheduleFromWebsite()` parsea DOS tablas — la que casa con lo reservable sigue
alimentando el emparejamiento con la API (`/api/classes`, flujo de prueba gratuita), y la de
la marca actual alimenta solo `gridSemana` (la parrilla de la web). La eleccion es **por
titulo, no por indice**, porque el orden cambia cada vez que el box publica.

**Franjas con varias clases:** se muestran todas separadas por " · " (`WOD · Funcional`).
Quedarse con la primera escondia justo las de Alluitz, que era el objetivo del cambio. El
entrenamiento libre (Open Box y el nuevo `Gimnasio + Open`) solo aparece en las horas sin
clase guiada, y se reconoce con `esLibre()` contra `shared/clases.json`, **no comparando con
un literal** — ese fue el fallo que ya se colo dos veces (ver trampa nº4).

## 2026-08-31: El box abre todos los dias, pero el domingo no se publican horas

Mikel confirmo que el box abre todos los dias del año. Se quito el "Domingo cerrado" de la
web en los dos idiomas y se corrigio el sabado (con el horario nuevo cierra a las **13:00**,
no a las 12:00).

**Lo que NO se hizo, y por que:** no se añadio el domingo al `openingHoursSpecification` del
JSON-LD. Hacen falta horas concretas y nadie las ha dado; inventarlas significaria que Google
enseñe un horario falso a quien busque el box. Se eligio la opcion honesta: texto visible que
dice "abierto todos los dias" y datos estructurados sin domingo.
**Consecuencia que hay que cerrar:** hasta que Xabi diga las horas, Google seguira mostrando
"cerrado" los domingos. Es un cabo suelto conocido, no un olvido.

En el sistema de reservas **no hay ni una clase guiada el domingo** (la API devuelve ahi
datos de plantilla, `realData: false`, con un "Kickbox" que ya no existe). Por eso
`/reservar` sigue saltandose los domingos: ofrecerlos llevaria a la persona a un dia sin nada
que reservar.

## 2026-09-01: El telefono oficial de Anboto es el 688 60 67 54

Tercer numero en dos dias: `688 661 924` (socio anterior) -> `622 768 134` (el de Xabi,
puesto el 31-08) -> **`688 60 67 54`**, que Mikel confirmo como el numero OFICIAL del box.
Formato de presentacion 3-2-2-2 tal y como lo dio el cliente, no el 3-3-3 que se usaba antes.

Cambiado en 13 ficheros (enlaces `tel:`, boton y CTA de WhatsApp, JSON-LD, mensajes de error
de `/api/book`, correos de scheduling y seguimiento, seed de `schema.sql`) **y en Supabase**
(`boxes.phone` y la faq "como puedo apuntarme"). Lo de Supabase no es opcional:
`src/lib/prompt.js` mete `${box.phone}` en el prompt del sistema, asi que el chatbot habria
seguido dictando el numero viejo aunque la web estuviera perfecta. Verificado con una llamada
real a `/api/chat` preguntando por precios, que es lo que dispara la mencion del telefono.

**Hallazgo del que salio una regla nueva (trampa nº8):** las paginas archivadas de `public/`
se sirven en produccion. `/alt-1.html`, `/alt-2.html`, `/alt-3.html`, `/index.legacy.html` y
`/reservar.legacy.html` devuelven 200 en anbotosc.com y llevaban meses publicando el telefono
del socio anterior — precisamente lo que el cliente habia pedido retirar. Se corrigio el
numero en todas.
**Pendiente de decidir con el cliente:** dejar de publicarlas. Ademas del telefono, llevan la
marca anterior y referencias a `anbotofitness.com`, un dominio que nunca existio. Mientras
sigan accesibles, cualquier dato caducado que contengan es dato publico.

Tambien se borro el bundle de la build anterior, que quedaba huerfano pero accesible por su
URL con el telefono viejo dentro. Ver en la trampa nº8 el criterio para limpiarlos sin
cargarse un fichero necesario.

## 2026-09-01: Las landings antiguas dejan de publicarse (archive/ + 301)

Decision de Mikel el mismo dia que se descubrio que `public/alt-1.html`, `alt-2.html`,
`alt-3.html`, `index.legacy.html` y `reservar.legacy.html` respondian **200 en produccion**.

**Por que importaba mas de lo que parecia:** ademas del telefono del socio anterior (ya
corregido ese dia), publicaban la marca previa al rebrand y enlaces a `anbotofitness.com`, un
dominio que nunca existio. Y `alt-*` e `index.legacy` **no llevaban `noindex`** mientras
`robots.txt` permitia rastrearlas: eran copias de la landing compitiendo en Google con la
buena. El sitemap solo declara `/`, pero eso no impide que se indexen.

**Como se retiraron, y por que asi:**
- **Movidas a `archive/`**, fuera de `public/`. Se eligio mover y no marcar con `noindex` ni
  filtrar con `.vercelignore` porque esas dos opciones dependen de acertar con un patron o de
  que el buscador obedezca, y en este repo ya hubo un incidente por eso: `fotos/` sin anclar
  en `.vercelignore` casaba a cualquier nivel y tumbo TODAS las imagenes del sitio. Sacar el
  fichero de la carpeta servida es lo unico que lo garantiza. Se añadio ademas `/archive/`
  (anclado) a `.vercelignore` para que ni se suban.
- **Redireccion 301/308 a `/`, no 404.** Como podian estar indexadas, se consolidan en la
  landing buena en vez de dejar paginas muertas.
- **La regla esta duplicada** en `vercel.json` (`redirects`) y en `src/index.js` (antes del
  `express.static`), a proposito: asi funciona la sirva la capa de Vercel o el Express, y en
  local se comporta igual que en produccion.

Verificado en produccion: las cinco rutas devuelven 308 hacia `https://anbotosc.com/` y
siguiendo la redireccion se llega a la portada con 200; `/`, `/reservar`, `/robots.txt`,
`/sitemap.xml` y `/widget/widget.js` siguen a 200.

**Regla que queda:** *si no debe ser publico, no puede estar en `public/`.* Esa carpeta la
sirve Express entera y Vercel tambien.

De paso se limpiaron 28 `static-loader-data-manifest-*.json` de builds anteriores que se
acumulaban en `public/` (estan gitignorados, pero se subian al despliegue igual). Se conserva
solo el que corresponde al hash del HTML actual.

## 2026-09-01: La reserva automatica de la clase de prueba se queda DESACTIVADA

Mikel lo confirma: que la persona interesada se apunte sola a la clase gratuita sigue
inhabilitado. **No es un pendiente, es la decision.** El motivo de fondo no ha cambiado: la
sesion de WodBuster es la cuenta PERSONAL de Mikel, asi que activarlo significa apuntar a
gente real a su nombre, y eso ya paso.

**Lo que aparecio al ir a comprobarlo (y por lo que no bastaba con mirar el codigo):**
`WODBUSTER_AUTOBOOK` **si existia en el entorno de produccion de Vercel**, creada 13 dias
antes, con el **valor oculto**. El proyecto fuerza las variables a tipo "Sensitive", de modo
que ni `vercel env ls` ni `vercel env pull` lo revelan (`pull` devuelve `"[SENSITIVE]"`).
Traducido: era imposible saber si la reserva automatica estaba encendida en produccion.

**Decision de implementacion: borrar la variable, no ponerla a `off`.** El codigo evalua
`process.env.WODBUSTER_AUTOBOOK === 'on'`, asi que una variable ausente ya significa
desactivado. La diferencia esta en la auditabilidad: una ausencia se comprueba de un vistazo
con `vercel env ls`; un valor oculto obliga a confiar. Para un flag cuyo estado seguro es
"apagado", **la ausencia es mejor estado que un `off` ilegible**.

Se volvio a desplegar, porque **cambiar variables de entorno no surte efecto hasta el
siguiente despliegue** aunque no cambie el codigo. Verificado despues: la variable no existe
en ningun entorno y la web y las APIs siguen a 200.

**La red de seguridad no se toca:** con esto apagado, `/api/book` guarda la peticion como
`pending` y manda un aviso por email al box. Ese aviso es lo UNICO que hace que la plaza
exista; si algun dia se cambia, hay que sustituirlo por algo antes.

Cuando llegue AimHarder esto deja de ser un dilema: el interesado se registra el mismo en la
pagina publica de prueba gratuita y la reserva queda a su nombre.

## 2026-09-01: La migracion a AimHarder es en OCTUBRE — no se toca nada mas de WodBuster

Mikel lo fija: *"el mes que viene se cambia a AimHarder y con la API sabremos todo"*. Eso
convierte en temporal el desajuste abierto el 31-08 (la web muestra el horario nuevo, el
sistema de reservas sigue con el viejo) y cambia dos prioridades:

**1. No se invierte mas en el lado de WodBuster.** Se descarta pedirle a Xabi que sincronice
alli el horario nuevo: en un mes ese sistema desaparece, asi que seria trabajo tirado. El
desajuste se resuelve solo al migrar.

**Riesgo asumido a sabiendas durante septiembre:** quien vea en la web una clase de Alluitz
(Funcional, Tonificacion, Movilidad + Core) o una hora que no coincide (10:30 en vez de
10:15) puede ir a reservar y no encontrarla. Se acepta porque la ventana es corta y porque el
horario publicado es el que el box quiere enseñar. La via de contacto sigue abierta: el
telefono y el WhatsApp estan en la web y el chatbot deriva a ellos.

**2. Las docs de la API de AimHarder pasan a ser la RUTA CRITICA.** Antes eran "pendiente de
Xabi"; ahora son lo que bloquea todo lo demas, porque `src/lib/booking/aimharder.js` es un
**esqueleto sin implementar**: la capa de proveedor esta lista y el interruptor es
`BOOKING_PROVIDER=aimharder`, pero detras no hay nada que hable con ellos. Hay que conseguir
docs oficiales y credenciales de SERVICIO antes de octubre; lo que circula por internet es
ingenieria inversa y no se construye sobre eso (ver punto 11 de people.md).

**Lo que la migracion arregla de golpe**, y por eso conviene no parchearlo antes:
- El desajuste horario web/reservas.
- La prueba gratuita a nombre del interesado (hoy la reserva automatica esta apagada
  precisamente porque la cuenta es personal).
- El correo de seguimiento, que hoy no llega a dispararse porque el cron filtra reservas
  `confirmed` y ya no se crean.

## 2026-09-02: AimHarder SI tiene API oficial — cambia el plan de la Fase 3

Xabi mando la documentacion: **https://aimharder.com/api_doc/aimharder/index.html**, "API
Publica de AimHarder". Es oficial y documentada, no ingenieria inversa. Detalle tecnico
completo en el punto 11 de `people.md`.

**Lo que deja obsoleto:** el plan de la Fase 3 preveia que `/reservar` fuese un simple
traspaso a la pagina publica de bonos de AimHarder, porque se dio por hecho que no habria API
oficial y no se queria construir la escritura sobre ingenieria inversa. **Ya no hace falta:**
`POST /classes/booking/guest` reserva una clase a nombre de un INVITADO pasando nombre,
email y telefono. La reserva queda a nombre de la persona, que era el problema de fondo, y
sin salir de nuestra web.

**Lo que tambien se simplifica:** `GET /calendar/:fecha` devuelve nombre de clase, hora,
aforo (`limit`), sala y `schedule_id` en una sola llamada. Hoy eso son dos mecanismos
distintos y fragiles: scraping de la web publica (tres tablas, elegida por titulo) para los
nombres, y la API para la disponibilidad. Con AimHarder se unifican.

**Decision:** cuando se implemente `src/lib/booking/aimharder.js`, hacerlo contra la API
oficial y **retirar el plan del traspaso a la pagina de bonos**. La reserva automatica
(`AUTOBOOK`) podra volver a activarse, porque el motivo para apagarla —que la sesion era una
cuenta personal— desaparece: los tokens son de servicio y el endpoint es explicitamente para
invitados.

**Ojo con dos cosas al implementar:**
- **Solo HTTP/1.1**: con HTTP/2 la API responde 403.
- **El refresh token ROTA**: `GET /auth/tokens/refresh` devuelve un access Y un refresh
  nuevos. Hay que persistir el nuevo refresh en cada renovacion o se pierde el acceso y hay
  que regenerarlo a mano desde el panel.

## 2026-09-02: Horario del domingo — 5:00 a 00:00, solo entreno libre

Xabi: *"Los domingos abierto de 5:00 a 00:00 pero entreno libre arriba"*. Es decir, el box
abre pero **no hay clases guiadas**, solo entrenamiento libre en la planta de arriba.

Se publica en la nota de horarios y se añade el domingo al `openingHoursSpecification`, que
era el cabo suelto del 31-08: hasta ahora Google mostraba "cerrado los domingos".
**Se pone `closes: "23:59"` y no `"00:00"`**: en schema.org un cierre menor que la apertura
se interpreta como el dia siguiente, pero `00:00` es ambiguo (puede leerse como duracion cero
o como 24 h) y no todos los consumidores lo tratan igual. La diferencia real es de un minuto.

**Queda una incoherencia por resolver con Xabi:** las horas de lunes a sabado del JSON-LD
(L-V 6:30-21:15, Sab 9:00-13:00) se dedujeron de la PRIMERA y la ULTIMA clase, no de la hora
real de apertura. Si el domingo abre de 5:00 a 00:00, lo normal es que entre semana tambien
abra mas de lo que dicen las clases. Hay que preguntarselo, porque ahora mismo la ficha de
Google dice que el domingo abris mas horas que un martes.

## 2026-09-02: Fuera la cifra de socios de la landing

Xabi pregunto si hay que publicar el numero de clientes "si o si". No: se retira.

La banda decia **"46+ miembros activos"**, y 46 es el numero de RESEÑAS de Google — el mismo
dato que ya aparecia dos cifras mas alla como "4,9★ valoracion en Google". Es decir, el
mismo numero publicado dos veces, una de ellas mintiendo, en un pueblo donde cualquiera nota
si un box tiene 46 socios o no.

**Decision: quitarla en vez de sustituirla.** Quedan tres cifras y las tres son ciertas: 8+
años, 6 disciplinas, 4,9★. Si algun dia dan el numero real, se vuelve a poner.

**Ojo con el CSS al tocar esta banda.** `.statband .wrap` era `repeat(4,1fr)`. Al pasarlo a
`repeat(3,1fr)` aparecio **scroll horizontal a 320px**: las etiquetas largas ("Urteko
esperientzia", "Google-ko balorazioa") ensanchan la columna por min-content y tres columnas
dejan de caber. Solucion: en `@media(max-width:900px)` se mantienen **2 columnas** y la
tercera ocupa la fila entera (`grid-column:1/-1`), que queda centrada sola porque `.stat` ya
es `text-align:center`. Verificado a 320/390/768/1280 sin desbordes.

## 2026-09-02: Lo que se hara al migrar a AimHarder (octubre)

Mikel: *"Cuando demos el paso a AimHarder hacemos esa automatizacion que teniamos hecha y mas
cosas como mostrar directamente en la web el horario real de AimHarder y todas las clases
disponibles"*. Alcance acordado para octubre, con la API oficial ya en la mano (punto 11 de
people.md):

1. **Reactivar la reserva automatica** de la clase de prueba, ahora si: con
   `POST /classes/booking/guest` la reserva queda a nombre del interesado, que era el unico
   motivo por el que se apago. Deja de tener sentido el traspaso a su pagina de bonos.
2. **Horario real directamente de AimHarder** via `GET /calendar/:fecha`: se acaban el
   scraping de las tres tablas y el desajuste entre lo que enseña la web y lo reservable.
3. **Mostrar las clases DISPONIBLES**, no solo la parrilla: el endpoint trae `limit` (aforo)
   ademas del nombre y la hora, asi que se pueden enseñar plazas libres en la propia web.

Al hacerlo, comprobar si `room_name` separa ANBOTO de ALLUITZ: resolveria de forma limpia lo
de mostrar los dos espacios, que hoy se apaña por nombre de clase.

**4. Los TIPOS DE CLASE tambien automaticos** (pedido por Mikel el 02-09: *"los tipos de clase
que hay, el horario, me gustaria que eso viniese de AimHarder, por si Xabi cambia el horario
que se refleje en la web sin tocar nada"*).

Hoy solo la PARRILLA es automatica. La seccion "Una clase para cada objetivo" es una lista
escrita a mano de 6 disciplinas en `web/src/data/site.js` (`DISCIPLINAS`), y **ya se ha
quedado corta**: el horario real muestra 12 tipos de clase, asi que faltan 6 —Funcional,
Tonificacion, Movilidad + Core, Team WOD, Gymnastics y Gimnasio + Open—. Medido el 02-09.

**El matiz que hay que decidir ANTES de implementarlo:** esa seccion no es solo una lista de
nombres. Cada clase lleva dos cosas que la API NO puede dar:
- Una **descripcion bilingue** ES/EU escrita a mano (`disc.d1`..`disc.d6` en `dict.js`).
  AimHarder devuelve `description`, pero en un solo idioma y con el texto que haya escrito el
  box. Automatizarla a secas **perderia el euskera**.
- El **objetivo** al que pertenece (salud / rendimiento / musculacion / grasa / empezar).
  Eso es criterio nuestro: la API no sabe que Hyrox sirve para "rendimiento". Y no es
  decorativo — `OBJETIVOS` alimenta el filtro de la seccion, la recomendacion del formulario
  y la de `/reservar`. Si una clase nueva entra sin objetivo, entra sin recomendacion.

**Diseño propuesto:** que la API decida QUE CLASES EXISTEN y que `shared/clases.json` siga
siendo nuestra capa encima (nombre canonico, descripcion bilingue, objetivo). Una clase que
aparezca en AimHarder y no conozcamos **se muestra igualmente**, con el nombre y la
descripcion que de el proveedor y sin objetivo asignado, en vez de desaparecer. Asi se cumple
lo pedido —Xabi añade una clase y sale sola— sin inventar a que objetivo pertenece ni perder
el euskera de las que ya estan.

**Efecto secundario a revisar:** la cifra "6 disciplinas" de la banda quedaria desfasada si la
lista pasa a ser automatica; habria que calcularla o quitarla.
