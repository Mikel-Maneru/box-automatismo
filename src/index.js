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
    ? [process.env.ALLOWED_ORIGIN || 'https://anbotofitness.com']
    : '*'
}));
app.use(express.json());
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Box Automatismo escuchando en puerto ${PORT}`);
});