# Project Status — Anboto SC (2026-08-18)

## Current Active Branch
- **Branch**: `feat/react-vite-migration`
- **Status**: Deployed to Vercel preview + ready for production (`vercel --prod`)
- **Last commit**: "chore: Prepara deploy automatizado de anbotosc.com cuando DNS se propague"

## Phase 1 — Completed ✅ (2026-08-18)

### 1.1 Domain Setup: anbotosc.com — ✅ LIVE (resuelto 2026-08-18 23:5x)

**EL FALLO Y SU CAUSA (importante, no repetir):**
Se pusieron en IONOS los nameservers `ns1-4.vercel-dns-3.com`. Eso estuvo MAL:
Vercel tenía el dominio como *Registrar: Third Party / Nameservers: Third Party* y **nunca creó
la zona DNS**. Esos nameservers solo sirven dominios cuyo DNS gestiona Vercel. Al no existir la
zona respondían **REFUSED** → los resolvers devolvían **SERVFAIL** → el dominio no resolvía para
nadie. **NO era propagación DNS: nunca habría funcionado por sí solo.**

Señales para diagnosticar esto rápido la próxima vez:
- `nslookup dominio 8.8.8.8` → "Server failed" (SERVFAIL), **no** NXDOMAIN
- `nslookup dominio ns1.vercel-dns-3.com` → "Query refused"
- `vercel dns ls dominio` → "No records found"
- `vercel domains inspect dominio` → "Intended Nameservers" **vacío** + nameservers marcados ☓

**LA SOLUCIÓN APLICADA (configuración actual, la buena):**
1. IONOS → dominio → pestaña **Servidores DNS** → **"Restaurar el servidor de nombres"**
   (vuelve a los NS de IONOS: `ns1020.ui-dns.com`, `ns1119.ui-dns.biz`, `ns1029.ui-dns.de`,
   `ns1025.ui-dns.org`). La delegación en el registro `.com` se actualizó en minutos, no en 48h.
2. IONOS → pestaña **DNS** → editar registro `A @` → **`76.76.21.21`**
   (IONOS desactiva solo su `A` de parking, su `AAAA` y el TXT `_dep_ws_mutex` — correcto:
   ese `AAAA` habría roto a los visitantes por IPv6)
3. IONOS → **Añadir registro** → `CNAME` · `www` · **`cname.vercel-dns.com`**
4. Añadido `www.anbotosc.com` al proyecto de Vercel con redirect 308 al apex
   (sin añadirlo al proyecto, Vercel no lo sirve aunque el CNAME exista)
5. El certificado TLS **no se emitió solo** → forzado con:
   `vercel certs issue anbotosc.com www.anbotosc.com`

**Estado verificado:**
- `https://anbotosc.com` → 200 OK, la landing carga entera
- `https://www.anbotosc.com` → 308 → `https://anbotosc.com`
- Vercel API: `"verified": true`, `"misconfigured": false`, `"configuredBy": "A"`
- **BASE_URL** en `.env` = `https://anbotosc.com`
- Los registros de Mail de IONOS (MX, SPF, DKIM, DMARC, autodiscover) se dejaron intactos

**Cavea temporal:** Cloudflare (`1.1.1.1`) siguió devolviendo SERVFAIL un rato porque tenía
cacheada la delegación vieja (EDE: *"205.251.199.60 returned REFUSED"* = ns4.vercel-dns-3.com).
Es solo caché de NS (TTL hasta 48h) y se cura solo. Afecta a Chrome si tiene DNS seguro con
Cloudflare. Google (8.8.8.8), Quad9 y el resolver del ISP resolvían bien desde el primer momento.

**Nota:** `deploy-anbotosc.sh` ya no hace falta para esto. `anbotofitness.com` no existe en el
registro `.com` (NXDOMAIN) y no se va a recuperar — `anbotosc.com` es el dominio definitivo y ya
está registrado. Ver CLAUDE.md para el detalle de dónde sí sobrevive el nombre "Anboto Fitness".

### 1.2 Chat Widget Redesign
- **File**: `public/widget/widget.js`
- **Change**: Icon from generic chat bubble to custom "pico bubble" (Anboto brand icon)
- **Design**: 
  - SVG inline with mountain pico + chat bubble silhouette
  - Button: madera #A7693B background
  - Hover: cuero #703D26
  - Panel: caliza #F4EDE2 background
  - Full palette applied: pizarra, granito, bruma, caliza, madera, cuero
- **Status**: ✅ Deployed to preview, working correctly

### 1.3 Favicon Theme-Aware
- **Files**: `web/index.html` and `public/reservar.html`
- **Implementation**:
  - SVG data URI with CSS `prefers-color-scheme` media query
  - Light theme: pico in black (#141311)
  - Dark theme: pico in caliza (#F4EDE2)
  - JavaScript matchMedia fallback for Chrome/Safari (media queries in SVG don't re-evaluate)
- **Status**: ✅ Working in Firefox, Chrome, Safari

### 1.4 Security: Rotated Exposed Credentials
- **Vercel Token**: Old token rotated (was exposed in chat, rotated immediately)
- **Still in .env (local only)**: SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY, RESEND_API_KEY, KAPSO_*, WODBUSTER_PASSWORD
  - ⚠️ These are secrets and should never be in memory files. Keep in `.env` only (gitignored)
  - Rotate if any are exposed

## Email propio: send.anbotosc.com en Resend (2026-08-19) — ✅ VERIFIED

**Por qué un subdominio y no `anbotosc.com` a secas:** si algún envío quema la reputación,
se quema la del subdominio y no la del correo normal del box. Es lo que recomienda Resend.

**⚠️ TRAMPA QUE YA PASÓ UNA VEZ:** el dominio se creó primero como **`send.anboto.sc`**
(alguien partió mal `anbotosc.com` → `anboto.sc`, que es un TLD de Seychelles ajeno). Con ese
nombre los registros en IONOS NUNCA habrían verificado. **Al crear el dominio en Resend, leer
el nombre carácter a carácter.** El dominio erróneo sigue en la cuenta como "Not Started" y
conviene borrarlo para que nadie lo confunda.

**Configuración buena (la que está activa):**
- Resend domain: `send.anbotosc.com`, región **Ireland (eu-west-1)**,
  id `cb294e62-50b7-48a1-b816-04328daac942`
- Registros añadidos en IONOS (IONOS añade `.anbotosc.com` solo, por eso el host va corto):

  | Tipo | Host en IONOS | Valor | Prio |
  |---|---|---|---|
  | TXT | `resend._domainkey.send` | `p=MIGfMA0GCSqG…IDAQAB` (218 car.) | — |
  | MX  | `send.send` | `feedback-smtp.eu-west-1.amazonses.com` | 10 |
  | TXT | `send.send` | `v=spf1 include:amazonses.com ~all` | — |

- **NO se añadió** el MX de "Enable Receiving" (`send` → `inbound-smtp.eu-west-1.amazonaws.com`):
  eso es para *recibir* correo en el subdominio y no hace falta.
- Los registros de correo del box en IONOS (MX `@` a mx00/mx01.ionos.es, SPF `@`, DKIM, DMARC)
  quedaron **intactos**: los de Resend cuelgan de `send.*`, no del apex.
- Verificado por DNS contra `ns1020.ui-dns.com`: los tres resuelven correctamente.
- **Estado en Resend: `Verified` ✅** (Domain added 00:15 → DNS verified 00:21 → Domain verified
  00:24, el 2026-08-19). Tardó 9 minutos en total, no las "horas" que avisaba el aviso.

**Limpieza decidida el 2026-08-19 (PENDIENTE de ejecutar):** borrar `api/` (8 archivos, código
muerto que Vercel no invoca) y el dominio erróneo `send.anboto.sc` en Resend. NO se borran los
`*.legacy.html` (CLAUDE.md los conserva a propósito), ni `deploy-anbotosc.sh`, ni los restos de
`.env`. Detalle completo en `decisions.md`.

### ✅ CERRADO el 2026-08-19: el email funciona de verdad

**El fallo final NO era el DNS: era la API key de otra cuenta.** Con el dominio ya `Verified`
en el panel, enviar seguía devolviendo `403 "The send.anbotosc.com domain is not verified"`.
Causa: la `RESEND_API_KEY` del `.env` pertenecía a la cuenta Resend **personal de Mikel**,
mientras que el dominio se verificó en la cuenta del box (**anbotocf**). Un dominio verificado
en una cuenta es invisible para la clave de otra.

Cómo se diagnosticó (útil para la próxima):
- Los tres registros se consultaron contra el NS autoritativo (`ns1020.ui-dns.com`) y estaban
  **correctos**, incluido el DKIM completo → el DNS quedaba descartado.
- El `send.send.anbotosc.com` de MX y SPF **no es un error**: Resend usa un subdominio `send.`
  propio para los rebotes. Parece un typo y no lo es.
- Un intento de envío devolvió *"You can only send testing emails to your own email address
  (manerugilmikel@gmail.com)"* → esa frase delata el titular de la clave.

**Configuración final, verificada con envíos reales:**
- `RESEND_API_KEY` = clave de la cuenta **anbotocf** (en `.env` y en Vercel production)
- `MAIL_FROM=Anboto SC <hola@send.anbotosc.com>` (en `.env` y en Vercel production)
- Comprobado a tres niveles: envío directo por API, y **un alta real por `POST /api/signup`**
  cuyo log confirma `Email enviado via Resend`.

**PENDIENTE:**
1. ⚠️ **Rotar la `RESEND_API_KEY`**: se pegó en texto plano en un chat. Es de solo envío (no da
   acceso a datos), pero permitiría mandar correo *en nombre de Anboto SC* → riesgo de phishing.
2. Borrar el dominio sobrante `send.anboto.sc` en Resend (lo decide Mikel, no se borra solo).

---

## Phase 2 — ✅ IMPLEMENTADA Y DESPLEGADA EN PRODUCCIÓN (2026-08-19)

**Las 4 preguntas de clarificación de abajo ya NO aplican: se resolvieron implementando.**
5 commits en `feat/react-vite-migration` (2026-08-18):
- `5b36c93` feat(web,api): clases por objetivo y formulario guiado
- `af54fa4` feat(web): /reservar en React + arregla dos bugs del flujo de reserva
- `361cb83` feat(reservar): recomienda la clase de la prueba gratuita según el objetivo
- `fdc8325` fix(seo): anbotosc.com pasa a ser el dominio canónico
- `47d060b` feat(email): avisos a anbotocf@gmail.com y remitente configurable

**Decisiones que quedaron tomadas (leer antes de tocar nada):**
- **5 objetivos** en `web/src/data/site.js` → `OBJETIVOS` (fuente única de verdad; la sección de
  clases filtra con esto y el formulario recomienda con esto, para que web y alta no se contradigan):
  - `salud` → WOD, Oinarriak, Endurance
  - `rendimiento` → Hyrox, WOD, Endurance
  - `musculacion` → Total Strength, Halterofilia
  - `grasa` → WOD, Endurance, Hyrox
  - `empezar` → Oinarriak, WOD
  - El **primer** elemento de `clases` es la puerta de entrada recomendada.
- `OBJETIVO_VALUES`: los valores viajan al backend en castellano fijo (igual que `nivel`);
  el backend valida contra `VALID_OBJETIVOS` en `src/routes/signup.js`.
- `claveClase()` normaliza los nombres de WodBuster ("Wod"→WOD, "Haltero"→Halterofilia).
- `CANALES`: lista para "¿Cómo nos conociste?".
- `/reservar` migrado a React → `web/src/pages/Reservar.jsx` (el antiguo queda como
  `public/reservar.legacy.html`).
- Avisos de alta ahora a **anbotocf@gmail.com** (resuelve el punto 3 de la lista de Xabi).

✅ **DESPLEGADO el 2026-08-19** con `vercel --prod`, y verificado en vivo (no fiándose del
"ready" del CLI):

| Comprobación | Resultado |
|---|---|
| `https://anbotosc.com` | 200 OK |
| Bundle servido vs repo | `app-VFg2lThZ.js` **=** `app-VFg2lThZ.js` |
| Clases por objetivo | presentes en el HTML servido |
| `/reservar` | 200 OK |
| `robots.txt` | con `Disallow: /reservar` y el sitemap nuevo |

**Truco para verificar producción desde un equipo con la caché DNS sucia:** el resolver del ISP
puede seguir dando la IP vieja de parking de IONOS y `curl` falla con 000. Se salta con:
```bash
curl -s --resolve anbotosc.com:443:76.76.21.21 https://anbotosc.com
```

Commits posteriores a los 5 de la fase 2:
- `017f05c` refactor: elimina las notificaciones por WhatsApp (Kapso)
- `361cb83`/`fdc8325`/`47d060b` ya listados arriba

---

## (Histórico) Phase 2 — Planning Stage 🔵

### 2.1 Requirements Summary
1. **Reorganize classes by user objectives** (health, performance, muscle gain, fat loss, beginner)
2. **Improve signup form**: Add "How did you hear about us?" + "What's your objective?" fields
3. **Dynamic class recommendations**: Show suggested classes based on user's objective
4. **Free trial class booking**: New UI component/page for selecting and reserving free class
5. **Use WodBuster API for real availability**: Replace hardcoded schedule with dynamic API calls
6. **Change chat widget token**: Move from personal account (Mikel) to client account token

### 2.2 Code Exploration Completed ✅
- **WodBuster integration**: Already exists in `src/lib/wodbuster.js` (598 lines)
  - Functions: `getClassAvailability(date)`, `bookClass(classId, date)`, `validateSession()`, `loginToWodBuster()`
  - Returns: id, name, time, available, capacity, booked, spots
  - Endpoint: `GET /api/classes?date=YYYY-MM-DD`
  
- **Landing page structure**: `web/src/data/site.js`
  - Current 6 classes/disciplines: WOD, Oinarriak, Halterofilia, Hyrox, Endurance, Total Strength
  - Data: SCHED (schedule by day), DISCIPLINES, PLANS (4 membership tiers)
  - Components: `Horarios.jsx` (schedule picker), `Signup.jsx` (form), `Sections.jsx` (render)
  
- **Chat widget architecture**: `public/widget/widget.js` + backend in `src/routes/chat.js`
  - Token-based: `data-token` attribute on script tag
  - Validation: Backend checks token against Supabase `boxes` table
  - System prompt: Built dynamically from box data
  - Current token: `'anboto-token-2024'` (hardcoded in schema.sql seed)

### 2.3 4 Clarification Questions (PENDING USER ANSWERS)
1. **Class-to-Objective Mapping**: How to map 6 current classes to 4-5 objectives?
   - Example: WOD + Hyrox → Performance? Health → Oinarriak + Endurance?
   
2. **Chat Token Strategy**: 
   - Option A: Create new box in Supabase with unique widget_token for client
   - Option B: Change existing token (affects current setup)
   
3. **Free Class App Location**:
   - Option A: New React component section in landing
   - Option B: Separate `/reservar` page (like current hand-written version)
   - Option C: Modal overlay from signup form
   
4. **Form Fields to Add**:
   - Definitely: "¿Cómo te enteraste?" (dropdown: redes, amigo, búsqueda, etc.)
   - Definitely: "¿Cuál es tu objetivo?" (radio buttons)
   - Maybe: "¿Quieres reservar clase gratuita?" (checkbox)

### 2.4 Plan Document
- **Location**: `C:\Users\Mikel\.claude\plans\reactive-wishing-wozniak.md`
- **Contains**: Exploration findings + proposed architecture + 4 clarification questions
- **Status**: Awaiting user answers to proceed with detailed implementation

## Key Files Reference
- **Frontend Landing**: `web/src/` (React+Vite)
  - `index.html` — SEO head + JSON-LD
  - `src/components/` — One component per section
  - `src/data/site.js` — Schedule, disciplines, coaches, plans
  - `src/i18n/dict.js` — ES/EU translations
  - `src/styles/global.css` — Brand palette (Anboto colors)
  
- **Backend**: `src/` (Express)
  - `index.js` — Server entry point
  - `routes/chat.js` — POST /api/chat (Claude API)
  - `routes/signup.js` — POST /api/signup (Supabase insert)
  - `routes/scheduling.js` — GET /api/classes (WodBuster)
  - `routes/cron.js` — GET /api/cron/followup
  - `lib/wodbuster.js` — WodBuster client (598 lines)
  - `lib/supabase.js` — Lazy Supabase client (Proxy)
  - `lib/email.js` — Resend + signup logic
  - ~~`lib/whatsapp.js`~~ — **borrado el 2026-08-19**: se eliminaron las notificaciones WhatsApp
  
- **Widget**: `public/widget/widget.js` (vanilla JS, no deps)
  
- **Database**: `schema.sql` (Supabase DDL + seed data)
  - Tables: `boxes` (widget_token, box_data), `conversations`, `messages`, `signups`

## Environment Setup
- **Node**: >= 20 required
- **`.env` file**: NOT in repo (gitignored)
- **`.env.example`**: Template with all required variables
- **Dev server**: `npm run dev` (Express :3003 + Vite :5173, Vite proxies /api to :3003)
- **Build**: `npm run web:build` (Vite → public/, **NOT** `npm run build`)
- **Production serve**: `npm start` (Express from public/)

## Pending Tasks
1. ⏳ **Wait for DNS**: anbotosc.com propagation (24-48h from 2026-08-18)
   - Check periodically with `nslookup anbotosc.com`
   - Once resolved: run `deploy-anbotosc.sh` for production deploy
   
2. 🔵 **Answer Phase 2 Questions**: Respond to 4 clarification questions to unblock implementation
   - Answers should go in plan file or communicated to Claude
   
3. 📝 **Phase 2 Implementation** (once questions answered):
   - Modify `web/src/data/site.js`: Add OBJECTIVES mapping
   - Modify `web/src/components/Signup.jsx`: Add fields (howKnew, objective)
   - Create `web/src/components/ClassSelector.jsx`: Filter + recommend
   - Possibly modify Supabase schema for new fields
   - Change chat widget token in Supabase `boxes` table

## Important Notes
- **Production Deploy**: Manual via `vercel --prod` (auto Git↔Vercel disabled since 2026-05-12)
- **Brand Changes**: Always use "Anboto SC" in UI; keep domains/internal slug as "anboto-fitness" for backwards compat
- **Credentials in .env**: Real secrets are in local .env (not in repo). Exposed secrets must be rotated IMMEDIATELY.
- **WodBuster**: Manual cookie-based auth with CAPTCHA blocker (fully automated login not possible)
