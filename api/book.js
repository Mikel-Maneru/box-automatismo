const supabase = require('../src/lib/supabase');
const wodbuster = require('../src/lib/wodbuster');

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, classId, date, className, classTime } = req.body;
    if (!token || !date) {
      return res.status(400).json({ error: 'Faltan parametros' });
    }

    // If no classId, try to find it from WodBuster by matching time+name
    let bookingClassId = classId;
    if (!bookingClassId && className && classTime) {
      try {
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const wbClasses = await wodbuster.getClassAvailability(dateObj);
        const match = wbClasses.find(c => c.time === classTime + ':00' && c.name === className);
        bookingClassId = match?.id;
      } catch (err) {
        if (err instanceof wodbuster.WodbusterAuthError) {
          return res.status(503).json({
            error: 'Temporalmente no disponible',
            retry: true,
            message: 'No podemos conectar con el sistema de reservas. Escribenos por WhatsApp al 688 661 924.',
          });
        }
      }
    }

    if (!bookingClassId) {
      return res.status(400).json({ error: 'No se ha encontrado la clase en WodBuster. Escribenos por WhatsApp al 688 661 924.' });
    }

    const { data: tokenData, error: tokenError } = await supabase
      .from('signup_tokens')
      .select('id, signup_id, used, expires_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return res.status(404).json({ error: 'Token no encontrado' });
    }

    if (tokenData.used) {
      return res.status(400).json({ error: 'Este enlace ya ha sido utilizado' });
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Este enlace ha caducado' });
    }

    const { data: signup } = await supabase
      .from('signups')
      .select('id, box_id, nombre')
      .eq('id', tokenData.signup_id)
      .single();

    if (!signup) {
      return res.status(404).json({ error: 'Signup no encontrado' });
    }

    // Book in WodBuster
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const bookingResult = await wodbuster.bookClass(bookingClassId, dateObj);

    // Save booking to Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('class_bookings')
      .insert({
        signup_id: signup.id,
        box_id: signup.box_id,
        wodbuster_class_id: bookingClassId,
        class_date: date,
        class_time: classTime || null,
        class_capacity: null,
        booking_status: bookingResult.success ? 'confirmed' : 'failed',
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error guardando reserva:', bookingError);
    }

    // Mark token as used
    await supabase
      .from('signup_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    if (!bookingResult.success) {
      return res.status(500).json({ error: 'Error reservando la clase en WodBuster' });
    }

    res.json({
      ok: true,
      booking: {
        date,
        time: classTime,
        name: signup.nombre,
        className: className || null,
      },
    });
  } catch (err) {
    if (err instanceof wodbuster.WodbusterAuthError) {
      return res.status(503).json({
        error: 'Temporalmente no disponible',
        retry: true,
        message: 'No podemos conectar con el sistema de reservas. Escribenos por WhatsApp al 688 661 924.',
      });
    }
    console.error('Error reservando clase:', err.message);
    res.status(500).json({ error: 'Error reservando la clase' });
  }
};