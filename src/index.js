require('dotenv').config({ override: true }); // v1

const express = require('express');
const cors = require('cors');
const path = require('path');
const chatRouter = require('./routes/chat');
const signupRouter = require('./routes/signup');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.ALLOWED_ORIGIN || 'https://web-production-35183.up.railway.app']
    : '*'
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', chatRouter);
app.use('/api', signupRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/anboto', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'anboto.html'));
});

app.get('/', (_req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Box Automatismo - AI Chat Widget para CrossFit</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e5e5e5; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { max-width: 640px; padding: 48px 24px; }
    h1 { font-size: 2rem; margin-bottom: 8px; }
    p { color: #a3a3a3; line-height: 1.6; margin-bottom: 16px; }
    .snippet { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; color: #4ade80; word-break: break-all; margin: 24px 0; }
    .step { background: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 12px; }
    .step h3 { color: #fff; margin-bottom: 8px; }
    .step p { margin-bottom: 0; }
    a { color: #4ade80; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Box Automatismo</h1>
    <p>Widget de chat con IA para boxes de CrossFit. Responde 24h a tus clientes y potenciales miembros.</p>

    <div class="step">
      <h3>1. Instala el widget en tu web</h3>
      <p>Pega este snippet antes de &lt;/body&gt;:</p>
    </div>

    <div class="snippet">&lt;script src="${process.env.WIDGET_URL || `http://localhost:${PORT}`}/widget/widget.js" data-token="TU-TOKEN-AQUI"&gt;&lt;/script&gt;</div>

    <div class="step">
      <h3>2. Obtén tu token</h3>
      <p>Cada box tiene un widget_token único. Encuéntralo en tu panel de administración o en la tabla <code>boxes</code> de Supabase.</p>
    </div>

    <div class="step">
      <h3>3. Listo</h3>
      <p>El widget aparece en tu web y responde preguntas sobre horarios, precios, clases y más.</p>
    </div>

    <p style="margin-top: 32px"><a href="/health">Health check</a></p>
  </div>
</body>
</html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Box Automatismo escuchando en puerto ${PORT}`);
});