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
- PENDIENTE: preview/deploy en Vercel (requiere Vercel CLI + adaptar `/api` Express a funciones serverless); fotos reales del nuevo centro; validar visualmente efectos WebGL más pesados (Threads/Waves/Particles) cuando el panel del navegador esté visible.

## Key technical constraints
- `dotenv` MUST use `{ override: true }`
- Anthropic client MUST set `baseURL: 'https://api.anthropic.com'`
- Model: `claude-sonnet-4-5-20250929`
- Gmail uses App Password
- Vercel Hobby plan: only daily cron jobs allowed