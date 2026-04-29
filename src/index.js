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
    ? [process.env.ALLOWED_ORIGIN || 'https://web-anboto.up.railway.app']
    : '*'
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', chatRouter);
app.use('/api', signupRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Box Automatismo escuchando en puerto ${PORT}`);
});