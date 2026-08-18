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
- `anbotofitness.com` esta CADUCADO (NXDOMAIN).

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
- WhatsApp: **Kapso** (`KAPSO_*`). Twilio ya no se usa, aunque siga en package.json.
- Vercel Hobby plan: only daily cron jobs allowed
- `.env` no esta en el repo. Desde el fix del 2026-08-15 el servidor SI arranca sin las env
  (supabase lazy via Proxy, cliente Anthropic diferido), pero chat/BD/email/WhatsApp no funcionan
  hasta rellenarlas. En `main` ese fix no existe todavia y el arranque falla.