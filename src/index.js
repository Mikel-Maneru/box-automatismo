require('dotenv').config({ override: true }); // v1

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const chatRouter = require('./routes/chat');
const signupRouter = require('./routes/signup');
const schedulingRouter = require('./routes/scheduling');
const cronRouter = require('./routes/cron');
const webhookRouter = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.ALLOWED_ORIGIN || 'https://anbotosc.com']
    : '*'
}));
app.use(express.json());

// Paginas archivadas que estuvieron publicas SIN querer. Vivian en public/, y como esta
// carpeta se sirve entera, respondian 200 en produccion con la marca vieja, el telefono del
// socio anterior y enlaces a un dominio que nunca existio. Se movieron a archive/ (fuera de
// lo servido) el 2026-09-01.
// Redirigen a la portada en vez de dar 404 porque `alt-*` e `index.legacy` no llevaban
// noindex y robots.txt las permitia, asi que pueden estar indexadas: mejor consolidar en la
// landing buena. Va ANTES del static y esta duplicado en vercel.json a proposito, para que
// funcione lo sirva quien lo sirva.
const PAGINAS_ARCHIVADAS = [
  '/alt-1.html', '/alt-2.html', '/alt-3.html',
  '/index.legacy.html', '/reservar.legacy.html',
];
app.get(PAGINAS_ARCHIVADAS, (_req, res) => res.redirect(301, '/'));

app.use(express.static(path.join(__dirname, '..', 'public')));

// Rate limiting
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Inténtalo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: 'Demasiados mensajes. Inténtalo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/signup', signupLimiter);
app.use('/api/chat', chatLimiter);

app.use('/api', chatRouter);
app.use('/api', signupRouter);
app.use('/api', schedulingRouter);
app.use('/api/cron', cronRouter);
app.use('/api/followup', webhookRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/reservar', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'reservar.html'));
});

// Paginas legales. El build las deja como privacidad.html, cookies.html y
// aviso-legal.html, pero `express.static` no prueba a añadir la extension, asi que sin esto
// /privacidad daria 404 en local (en Vercel lo resuelve la regla de vercel.json).
for (const pagina of ['privacidad', 'cookies', 'aviso-legal']) {
  app.get('/' + pagina, (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', pagina + '.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Box Automatismo escuchando en puerto ${PORT}`);
});