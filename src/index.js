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

app.get('/health', async (_req, res) => {
  const supabase = require('./lib/supabase');
  const { data, error } = await supabase.from('boxes').select('widget_token, name').limit(1);
  const key = process.env.SUPABASE_SERVICE_KEY || '';
  res.json({
    status: 'ok',
    supabaseUrl: process.env.SUPABASE_URL ? 'set' : 'missing',
    keyLength: key.length,
    keyStart: key.substring(0, 20),
    keyEnd: key.substring(key.length - 10),
    boxQuery: error ? `error: ${error.message}` : (data && data.length ? `found: ${data[0].name}` : 'no boxes found')
  });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Box Automatismo escuchando en puerto ${PORT}`);
});