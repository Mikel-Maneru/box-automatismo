const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const wodbuster = require('../lib/wodbuster');

const CLASS_DESCRIPTIONS = {
  'Oinarriak': 'Clase para principiantes',
  'Wod': 'CrossTraining',
  'Hyrox': 'Hyrox - preparacion carrera',
  'Haltero': 'Halterofilia - fuerza tecnica',
  'Endurance': 'Endurance - resistencia',
  'Total Strength': 'Total Strength - fuerza',
};

// GET /api/classes?date=YYYY-MM-DD
router.get('/classes', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Formato de fecha invalido (YYYY-MM-DD)' });
    }

    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (dateObj < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.json({ classes: [] });
    }

    if (dateObj.getDay() === 0) {
      return res.json({ classes: [] });
    }

    // Get schedule directly from WodBuster
    let wbResult = { classes: [], realData: false };
    try {
      wbResult = await wodbuster.getClassAvailability(dateObj);
    } catch (err) {
      if (err instanceof wodbuster.WodbusterAuthError) {
        return res.json({ classes: [], error: 'auth', retry: true, message: 'Temporalmente no disponible' });
      }
      console.error('WodBuster error:', err.message);
      return res.json({ classes: [], retry: true, message: 'Error obteniendo horarios' });
    }

    let classes = wbResult.classes.map(c => ({
      time: c.time,
      name: c.name,
      description: CLASS_DESCRIPTIONS[c.name] || c.name,
      id: c.id || null,
      capacity: c.capacity,
      booked: c.booked,
      spots: (c.capacity != null && c.booked != null) ? c.capacity - c.booked : null,
      canBook: c.available && !!c.id,
      full: c.full || false,
    }));

    // Filter out past classes if today
    const now = new Date();
    const todayISO = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    if (date === todayISO) {
      classes = classes.filter(c => {
        const [h, m] = c.time.split(':').map(Number);
        const classStart = new Date(now);
        classStart.setHours(h, m, 0, 0);
        return classStart > now;
      });
    }

    res.json({ classes, realData: wbResult.realData });
  } catch (err) {
    console.error('Error obteniendo clases:', err.message);
    res.status(500).json({ error: 'Error obteniendo disponibilidad' });
  }
});

// POST /api/book
router.post('/book', async (req, res) => {
  try {
    const { token, classId, date, className, classTime } = req.body;
    if (!token || !date) {
      return res.status(400).json({ error: 'Faltan parametros' });
    }

    // If no classId, try to find it from WodBuster
    let bookingClassId = classId;
    if (!bookingClassId && className && classTime) {
      try {
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const wb = await wodbuster.getClassAvailability(dateObj);
        // getClassAvailability devuelve {classes, realData}: iterar el objeto lanzaba
        // "wbClasses.find is not a function" y esta rama nunca resolvia la clase.
        const match = (wb.classes || []).find(c => c.time === classTime + ':00' && c.name === className);
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

    // Validate token
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

    // Get signup details
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
});

// GET /api/booking-status?token=XXX
router.get('/booking-status', async (req, res) => {
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

    // `objetivo` viaja a /reservar para recomendar clases con el mismo criterio que la web.
    const { data: signup } = await supabase
      .from('signups')
      .select('id, nombre, nivel, objetivo')
      .eq('id', tokenData.signup_id)
      .single();

    // Check if there's an existing booking
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
      objetivo: signup?.objetivo || null,
      booking: booking || null,
    });
  } catch (err) {
    console.error('Error obteniendo estado de reserva:', err.message);
    res.status(500).json({ error: 'Error obteniendo estado' });
  }
});

module.exports = router;