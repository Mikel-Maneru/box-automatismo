const supabase = require('../src/lib/supabase');

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    const { data: tokenData } = await supabase
      .from('signup_tokens')
      .select('id, signup_id, used, expires_at')
      .eq('token', token)
      .single();

    if (!tokenData) {
      return res.json({ valid: false, reason: 'not_found' });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return res.json({ valid: false, reason: 'expired' });
    }

    const { data: signup } = await supabase
      .from('signups')
      .select('id, nombre, nivel')
      .eq('id', tokenData.signup_id)
      .single();

    const { data: booking } = await supabase
      .from('class_bookings')
      .select('class_date, class_time, booking_status')
      .eq('signup_id', tokenData.signup_id)
      .single();

    res.json({
      valid: true,
      used: tokenData.used,
      nombre: signup?.nombre,
      nivel: signup?.nivel,
      booking: booking || null,
    });
  } catch (err) {
    console.error('Error obteniendo estado de reserva:', err.message);
    res.status(500).json({ error: 'Error obteniendo estado' });
  }
};