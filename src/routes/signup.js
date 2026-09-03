const { Router } = require('express');
const { createSignup } = require('../lib/email');
// Misma fuente que lee el formulario, para que la version guardada no pueda desincronizarse.
const LEGAL_VERSION = require('../../shared/legal.json').version;

const router = Router();

const VALID_LEVELS = ['Sin experiencia', 'Algo de experiencia', 'Vengo de otro box'];
// Deben coincidir con OBJETIVO_VALUES y CANALES de web/src/data/site.js
const VALID_OBJETIVOS = ['Salud y bienestar', 'Rendimiento', 'Musculación', 'Perder grasa', 'Empezar de cero'];
const VALID_CANALES = ['Instagram', 'Google', 'Un amigo', 'Pasaba por delante', 'Otro'];

router.post('/signup', async (req, res) => {
  try {
    const {
      nombre, telefono, email, nivel, objetivo, comoConocio, origen, website,
      consentimiento, politicaVersion,
    } = req.body;

    // Honeypot: if filled, silently accept without saving
    if (website) return res.json({ ok: true, honeypot: true });

    // NO se registra el cuerpo de la peticion. Antes se hacia
    // (`console.log('Signup request body:', JSON.stringify(req.body))`) y eso metia el
    // nombre, el telefono y el email de cada persona en los logs de Vercel, sin plazo de
    // conservacion ni aviso: datos personales guardados donde nadie los habia declarado.
    // Si hace falta depurar, se registra QUE campo fallo, nunca su contenido.

    // Validation
    if (!nombre || nombre.trim().length < 2 || nombre.trim().length > 50) {
      console.log('Alta rechazada: nombre fuera de rango (2-50)');
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

    if (objetivo && !VALID_OBJETIVOS.includes(objetivo)) {
      return res.status(400).json({ error: 'Objetivo no válido' });
    }

    if (comoConocio && !VALID_CANALES.includes(comoConocio)) {
      return res.status(400).json({ error: 'Canal no válido' });
    }

    // Consentimiento OBLIGATORIO. Se comprueba aqui y no solo en el formulario porque la
    // validacion de cliente se salta con un curl, y sin consentimiento no hay base juridica
    // para guardar el dato: guardarlo igualmente seria la propia infraccion.
    if (consentimiento !== true) {
      console.log('Alta rechazada: sin consentimiento');
      return res.status(400).json({ error: 'Falta aceptar la política de privacidad' });
    }

    const signup = await createSignup({
      nombre: nombre.trim(),
      telefono: telefono || null,
      email: email || null,
      nivel: nivel || null,
      objetivo: objetivo || null,
      comoConocio: comoConocio || null,
      origen: origen || 'formulario',
      // Prueba del consentimiento (RGPD art. 7.1): cuando lo dio y que texto acepto. La
      // marca de tiempo la pone el SERVIDOR, no el cliente, que podria mentir.
      consentimientoAt: new Date().toISOString(),
      politicaVersion: politicaVersion || LEGAL_VERSION,
    });

    res.json({ ok: true, id: signup.id });
  } catch (err) {
    console.error('Error en /api/signup:', err.message || err);
    res.status(500).json({ error: 'Error al procesar la inscripción' });
  }
});

module.exports = router;