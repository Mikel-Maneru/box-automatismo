# Box Automatismo

Widget de chat con IA para boxes de CrossFit. Los propietarios pegan un `<script>` en su web; el widget abre un chat flotante que llama al backend, carga el contexto del box desde Supabase, construye un system prompt y llama a Claude.

Instancia en produccion: **Anboto SC** — https://anbotofitness.com

## Request flow

Widget -> POST /api/chat -> load box from Supabase -> buildSystemPrompt -> Claude API -> detect SIGNUP_DATA -> return reply to widget

## Como esta montado

| Carpeta | Que es | Se usa |
|---|---|---|
| `web/` | Landing en React + Vite, prerenderizada con `vite-react-ssg` | Es donde se edita el frontend |
| `public/` | Salida compilada de `web/` + widget, fotos y `reservar.html` | Es lo que se sirve (va commiteado) |
| `src/` | Servidor Express: sirve `public/` y `/api/*` | Local **y** produccion |
| `api/` | Copias serverless antiguas de los endpoints | **No se usan** (ver mas abajo) |

**Lo importante:** el proyecto de Vercel esta configurado con *Framework Preset = `express`*, asi que
Vercel envuelve `src/index.js` en una sola funcion que lo sirve todo. Los `api/*.js` sueltos **no se
invocan** y Vercel **no ejecuta el build de Vite**. El codigo que corre de verdad es `src/routes/*`.

`public/index.html` es artefacto compilado: **no se edita a mano**, se regenera con `npm run web:build`.

## Variables de entorno

`.env` no esta en el repo (esta en `.gitignore`). Copia `.env.example` y rellenalo.

Desde el arreglo del 15-08-2026 el servidor **arranca aunque falten las variables** (Supabase se
inicializa de forma perezosa y el cliente de Anthropic se crea al primer uso), de modo que la web
estatica se sirve igual. Pero el chat, la base de datos, el email y WhatsApp no funcionan hasta que
las rellenes. Esto es lo que permite que los previews de Vercel, que no heredan las variables de
produccion, no se caigan al arrancar.

### Imprescindibles

| Variable | Descripcion |
|---|---|
| `ANTHROPIC_API_KEY` | API key de Anthropic (Claude) |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_KEY` | Service role key de Supabase |

### Email y notificaciones

| Variable | Descripcion |
|---|---|
| `RESEND_API_KEY` | API key de Resend. Sin dominio verificado, usar `onboarding@resend.dev` como remitente |
| `NOTIFY_EMAIL` | Email que recibe las notificaciones de inscripcion |
| `KAPSO_API_KEY` | API key de Kapso (WhatsApp Cloud API) |
| `KAPSO_PHONE_NUMBER_ID` | ID del numero emisor en Kapso |
| `KAPSO_WHATSAPP_TO` | Destino de las alertas (ej: `whatsapp:+34...`) |

### WodBuster (reserva de clase gratis)

| Variable | Descripcion |
|---|---|
| `WODBUSTER_BOX_URL` | URL del box (default `https://anboto.wodbuster.com`) |
| `WODBUSTER_BOX_SLUG` | Slug del box (default `anboto`) |
| `WODBUSTER_SESSION_COOKIE` | Cookie `.WBAuth=...`, obtenida a mano (un CAPTCHA impide el login automatico) |
| `WODBUSTER_USER_ID` | `idu` necesario para que la API devuelva datos reales |
| `WODBUSTER_EMAIL` | Credencial para el intento de re-login automatico |
| `WODBUSTER_PASSWORD` | Credencial para el intento de re-login automatico |

### Servidor y despliegue

| Variable | Descripcion |
|---|---|
| `PORT` | Puerto del servidor. El codigo usa 3000 por defecto; en local usamos **3003** |
| `BASE_URL` | URL base para los enlaces de los emails (default `http://localhost:3003`) |
| `ALLOWED_ORIGIN` | Origen permitido en CORS de produccion (default `https://anbotofitness.com`) |
| `NODE_ENV` | `production` activa el CORS restrictivo |
| `CRON_SECRET` | Secreto que valida las llamadas al cron de follow-up |

## Ejecutar en local

Requiere **Node >= 20**. Hay dos `package.json`: el de la raiz (backend) y el de `web/` (frontend).

```bash
npm install && npm run web:install
```

```bash
npm run dev
```

Eso levanta Express en **:3003** y Vite en **:5173** a la vez; Vite proxya `/api`, `/fotos` y
`/widget` al backend. Trabaja contra http://localhost:5173.

Otros scripts: `npm run server:dev` (solo Express), `npm run web:dev` (solo Vite),
`npm run web:build` (compila `web/` dentro de `public/`), `npm start` (Express sirviendo el build).
Comprobacion rapida del backend: `GET /health` devuelve `{"status":"ok"}`.

> **No anadas un script `build` en el `package.json` de la raiz.** Vercel lo ejecuta
> automaticamente y rompe el despliegue; por eso el build de Vite se llama `web:build`.

## Deploy en Vercel

**La integracion Git-Vercel esta inactiva desde el 12-05-2026: hacer push NO despliega.**
Los despliegues se lanzan a mano con la CLI de Vercel:

```bash
vercel --prod
```

Sin `--prod` genera un preview. Como los previews no heredan las variables de entorno de produccion,
la web se sirve pero el formulario y el chat no guardan nada.

La configuracion vive en `vercel.json`:

- rewrite de `/reservar` a `/reservar.html`
- cron diario a las 10:00 sobre `/api/cron/followup` (el plan Hobby solo permite crons diarios)
- cabeceras `X-Content-Type-Options` y `X-Frame-Options`

Las variables de entorno se configuran en el panel de Vercel, no en el repo.
Recuerda `NODE_ENV=production` y `ALLOWED_ORIGIN`.

Como Vercel no compila el frontend, **el build de `web/` tiene que estar commiteado en `public/`**
antes de desplegar. El orden es: `npm run web:build`, commit, y luego `vercel --prod`.

> El `Procfile` es un resto del despliegue anterior en Railway y no se usa.

## Widget snippet para clientes

Pega este codigo antes de `</body>` en la web del box:

```html
<script src="https://TU-APP.vercel.app/widget/widget.js" data-token="TOKEN-DEL-BOX" data-api-url="https://TU-APP.vercel.app"></script>
```

- `data-token`: token unico del box (tabla `boxes` de Supabase, campo `widget_token`)
- `data-api-url`: URL base del backend (para que el widget sepa donde llamar)

## Estructura

- `src/index.js` — Express server, dotenv override, helmet, rate limiting, static serving, routes
- `src/routes/chat.js` — POST /api/chat, deteccion de SIGNUP_DATA
- `src/routes/signup.js` — POST /api/signup
- `src/routes/scheduling.js` — GET /api/classes y endpoints de reserva
- `src/routes/cron.js` — GET /api/cron/followup: keep-alive de WodBuster + emails de seguimiento
- `src/routes/webhook.js` — GET /api/followup/yes|no
- `src/lib/prompt.js` — buildSystemPrompt
- `src/lib/email.js` — createSignup + Resend
- `src/lib/whatsapp.js` — cliente de Kapso
- `src/lib/wodbuster.js` — cliente de WodBuster (scraping + API, gestion de sesion)
- `src/lib/supabase.js` — cliente de Supabase (perezoso, detras de un Proxy)
- `api/` — copias serverless antiguas, no usadas por el despliegue actual

Frontend (aqui es donde se edita):

- `web/src/data/site.js` — horario, disciplinas, coaches, resenas y tarifas.
  `HERO_SLIDES` / `IG_PHOTOS` son los puntos de intercambio de fotos
- `web/src/i18n/dict.js` + `LangContext.jsx` — diccionario EU/ES y helper `<T>`
- `web/src/styles/global.css` — la piel de marca y los tokens de diseno
- `web/src/components/` — un componente por seccion
- `web/index.html` — `<head>` de SEO y los dos bloques JSON-LD estaticos
- `public/index.html` — **salida compilada de `web/`, no editar a mano**
- `public/index.legacy.html` — la landing anterior a React, conservada como referencia
- `public/widget/widget.js` — widget de chat embebible en JS vanilla
- `public/reservar.html` — pagina de reserva de la clase gratuita (sigue siendo HTML a mano)
- `schema.sql` — DDL de Supabase + datos semilla

## Nota sobre la marca

El nombre publico es **Anboto SC**. El slug de base de datos `anboto-fitness` y el dominio
`anbotofitness.com` se mantienen a proposito del nombre anterior: `schema.sql` y `src/lib/email.js`
localizan el box por ese slug. No renombrarlo.

`design-system/anboto-crossfit/MASTER.md` se genero automaticamente y nunca reflejo la marca real;
esta obsoleto. Los tokens de diseno vigentes estan en `web/src/styles/global.css`.
