const wodbuster = require('../src/lib/wodbuster');

const CLASS_DESCRIPTIONS = {
  'Oinarriak': 'Clase para principiantes',
  'Wod': 'CrossTraining',
  'Hyrox': 'Hyrox - preparacion carrera',
  'Haltero': 'Halterofilia - fuerza tecnica',
  'Endurance': 'Endurance - resistencia',
  'Total Strength': 'Total Strength - fuerza',
};

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
};