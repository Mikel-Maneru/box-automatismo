const { Router } = require('express');
const { createSignup } = require('../lib/email');

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { nombre, telefono, email, nivel, origen } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const signup = await createSignup({
      nombre,
      telefono,
      email,
      nivel,
      origen: origen || 'formulario'
    });

    res.json({ ok: true, id: signup.id });
  } catch (err) {
    console.error('Error en /api/signup:', err.message || err);
    res.status(500).json({ error: 'Error al procesar la inscripci\u00f3n' });
  }
});

module.exports = router;