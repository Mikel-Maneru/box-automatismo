const { createSignup } = require('../src/lib/email');

const VALID_LEVELS = ['Sin experiencia', 'Algo de experiencia', 'Vengo de otro box'];
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

module.exports = async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);

  try {
    const { nombre, telefono, email, nivel, origen, website } = req.body;

    // Honeypot: if filled, silently accept without saving
    if (website) return res.json({ ok: true, honeypot: true });

    console.log('Signup request body:', JSON.stringify(req.body));

    // Validation
    if (!nombre || nombre.trim().length < 2 || nombre.trim().length > 50) {
      console.log('Validation failed: nombre=', JSON.stringify(nombre));
      return res.status(400).json({ error: 'El nombre debe tener entre 2 y 50 caracteres' });
    }

    if (telefono && (telefono.length < 9 || telefono.length > 15 || !/^[\d\s+]+$/.test(telefono))) {
      return res.status(400).json({ error: 'El teléfono debe tener entre 9 y 15 caracteres y solo contener números, espacios y +' });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'El email no tiene un formato válido' });
    }

    if (nivel && !VALID_LEVELS.includes(nivel)) {
      return res.status(400).json({ error: 'Nivel no válido' });
    }

    const signup = await createSignup({
      nombre: nombre.trim(),
      telefono: telefono || null,
      email: email || null,
      nivel: nivel || null,
      origen: origen || 'formulario'
    });

    res.json({ ok: true, id: signup.id });
  } catch (err) {
    console.error('Error en /api/signup:', err.message || err);
    res.status(500).json({ error: 'Error al procesar la inscripción' });
  }
};