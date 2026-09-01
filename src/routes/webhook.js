const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { sendAlerta } = require('../lib/email');

function thankYouPage(nombre, wantsToJoin) {
  const title = wantsToJoin
    ? 'Bienvenido a la familia Anboto!'
    : 'Gracias por visitarnos';
  const message = wantsToJoin
    ? `En breve nos pondremos en contacto contigo, ${nombre}. Mientras tanto, si tienes cualquier duda escribenos por WhatsApp al 688 60 67 54.`
    : `Esperamos verte de nuevo por Anboto, ${nombre}. La puerta siempre esta abierta!`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Barlow', Arial, sans-serif; background: #0d0d0d; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .container { max-width: 500px; text-align: center; }
    h1 { color: ${wantsToJoin ? '#4caf50' : '#ff6b35'}; font-size: 28px; margin-bottom: 16px; }
    p { color: #ccc; font-size: 18px; line-height: 1.6; }
    a { color: #ff6b35; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}

// GET /api/followup/yes?token=XXX
router.get('/yes', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send('Token requerido');

    const { data: tokenData } = await supabase
      .from('signup_tokens')
      .select('signup_id, expires_at')
      .eq('token', token)
      .single();

    if (!tokenData || new Date(tokenData.expires_at) < new Date()) {
      return res.status(400).send('Token invalido o caducado');
    }

    const { data: signup } = await supabase
      .from('signups')
      .select('id, nombre, telefono, email')
      .eq('id', tokenData.signup_id)
      .single();

    if (!signup) return res.status(404).send('Signup no encontrado');

    // Mark as wants to join
    await supabase
      .from('signups')
      .update({ wants_to_join: true })
      .eq('id', signup.id);

    // Aviso al box: es el lead mas caliente del sistema, ha probado y quiere entrar.
    await sendAlerta(
      `\u{1F525} ${signup.nombre} quiere apuntarse a Anboto SC`,
      `<h2>${signup.nombre} quiere apuntarse</h2>
       <p>Ha hecho la clase de prueba y ha dicho que si.</p>
       <p><strong>Telefono:</strong> ${signup.telefono || 'No indicado'}</p>
       <p><strong>Email:</strong> ${signup.email || 'No indicado'}</p>
       <hr><p>Llamale para formalizar la inscripcion.</p>`
    );

    res.setHeader('Content-Type', 'text/html');
    res.send(thankYouPage(signup.nombre, true));
  } catch (err) {
    console.error('Error en followup/yes:', err.message);
    res.status(500).send('Error procesando la solicitud');
  }
});

// GET /api/followup/no?token=XXX
router.get('/no', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send('Token requerido');

    const { data: tokenData } = await supabase
      .from('signup_tokens')
      .select('signup_id, expires_at')
      .eq('token', token)
      .single();

    if (!tokenData || new Date(tokenData.expires_at) < new Date()) {
      return res.status(400).send('Token invalido o caducado');
    }

    const { data: signup } = await supabase
      .from('signups')
      .select('id, nombre')
      .eq('id', tokenData.signup_id)
      .single();

    if (!signup) return res.status(404).send('Signup no encontrado');

    await supabase
      .from('signups')
      .update({ wants_to_join: false })
      .eq('id', signup.id);

    res.setHeader('Content-Type', 'text/html');
    res.send(thankYouPage(signup.nombre, false));
  } catch (err) {
    console.error('Error en followup/no:', err.message);
    res.status(500).send('Error procesando la solicitud');
  }
});

module.exports = router;