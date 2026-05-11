const supabase = require('../../src/lib/supabase');
const { sendWantsToJoinNotification } = require('../../src/lib/whatsapp');

function thankYouPage(nombre) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a la familia Anboto!</title>
  <style>
    body { font-family: 'Barlow', Arial, sans-serif; background: #0d0d0d; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .container { max-width: 500px; text-align: center; }
    h1 { color: #4caf50; font-size: 28px; margin-bottom: 16px; }
    p { color: #ccc; font-size: 18px; line-height: 1.6; }
    a { color: #ff6b35; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Bienvenido a la familia Anboto!</h1>
    <p>En breve nos pondremos en contacto contigo, ${nombre}. Mientras tanto, si tienes cualquier duda escribenos por WhatsApp al 688 661 924.</p>
  </div>
</body>
</html>`;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

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

    await supabase
      .from('signups')
      .update({ wants_to_join: true })
      .eq('id', signup.id);

    await sendWantsToJoinNotification(signup.nombre, signup.telefono, signup.email);

    res.setHeader('Content-Type', 'text/html');
    res.send(thankYouPage(signup.nombre));
  } catch (err) {
    console.error('Error en followup/yes:', err.message);
    res.status(500).send('Error procesando la solicitud');
  }
};