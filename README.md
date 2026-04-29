# Box Automatismo

Widget de chat con IA para boxes de CrossFit. Los propietarios pegan un `<script>` en su web; el widget abre un chat flotante que llama al backend, carga el contexto del box desde Supabase, construye un system prompt y llama a Claude.

## Request flow

Widget -> POST /api/chat -> load box from Supabase -> buildSystemPrompt -> Claude API -> detect SIGNUP_DATA -> return reply to widget

## Variables de entorno

| Variable | Descripcion | Requerida |
|---|---|---|
| `ANTHROPIC_API_KEY` | API key de Anthropic (Claude) | Si |
| `SUPABASE_URL` | URL del proyecto Supabase | Si |
| `SUPABASE_SERVICE_KEY` | Service role key de Supabase | Si |
| `PORT` | Puerto del servidor (Railway lo asigna automaticamente) | No (default 3000) |
| `GMAIL_USER` | Email de Gmail para notificaciones | Si |
| `GMAIL_APP_PASSWORD` | App Password de Gmail | Si |
| `NOTIFY_EMAIL` | Email que recibe las notificaciones de inscripcion | Si |
| `TWILIO_ACCOUNT_SID` | Account SID de Twilio | Si (WhatsApp) |
| `TWILIO_AUTH_TOKEN` | Auth token de Twilio | Si (WhatsApp) |
| `TWILIO_WHATSAPP_FROM` | Remitente WhatsApp (ej: `whatsapp:+14155238886`) | Si (WhatsApp) |
| `TWILIO_WHATSAPP_TO` | Destino WhatsApp (ej: `whatsapp:+34612345678`) | Si (WhatsApp) |
| `ALLOWED_ORIGIN` | Dominio permitido en CORS produccion (ej: `https://tuapp.railway.app`) | Si (prod) |
| `NODE_ENV` | `production` para activar CORS restrictivo | Si (prod) |
| `WIDGET_URL` | URL base del widget para el snippet en la landing | No |

## Ejecutar en local

```bash
npm install
npm run dev
```

El servidor arranca en el puerto definido en `.env` (default 3003).

## Deploy en Railway

1. Sube el repositorio a GitHub
2. Ve a [railway.app](https://railway.app) y crea un nuevo proyecto
3. Selecciona "Deploy from GitHub repo" y elige tu repositorio
4. En la pestana **Variables**, anade todas las variables de entorno de la tabla anterior
5. Railway detecta automaticamente el `Procfile` y despliega con `node src/index.js`
6. El puerto se asigna automaticamente via `PORT`
7. Una vez desplegado, Railway te da una URL publica (ej: `https://box-automatismo.up.railway.app`)
8. Anade `ALLOWED_ORIGIN` con esa URL y `NODE_ENV=production`

## Widget snippet para clientes

Pega este codigo antes de `</body>` en la web del box:

```html
<script src="https://TU-APP.railway.app/widget/widget.js" data-token="TOKEN-DEL-BOX" data-api-url="https://TU-APP.railway.app"></script>
```

- `data-token`: token unico del box (en la tabla `boxes` de Supabase, campo `widget_token`)
- `data-api-url`: URL base del backend (para que el widget sepa donde llamar)

## Estructura

- `src/index.js` — Express server, dotenv, static serving, routes
- `src/routes/chat.js` — POST /api/chat, SIGNUP_DATA detection
- `src/routes/signup.js` — POST /api/signup
- `src/lib/prompt.js` — buildSystemPrompt
- `src/lib/email.js` — createSignup + Nodemailer + Twilio WhatsApp
- `src/lib/supabase.js` — Supabase client
- `public/widget/widget.js` — Embeddable vanilla JS chat widget
- `public/anboto.html` — Landing page Anboto Crossfit
- `schema.sql` — Supabase DDL + seed data