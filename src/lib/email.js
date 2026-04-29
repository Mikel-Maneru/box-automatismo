const nodemailer = require('nodemailer');
const twilio = require('twilio');
const supabase = require('./supabase');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

function buildWhatsAppMessage({ nombre, telefono, email, nivel, origen }) {
  return `🔥 Nueva inscripción - Anboto Crossfit

👤 Nombre: ${nombre}
📱 Teléfono: ${telefono || 'No indicado'}
📧 Email: ${email || 'No indicado'}
💪 Nivel: ${nivel || 'No indicado'}
📋 Origen: ${origen}

Responde directamente a este número para contactarle.`;
}

async function sendWhatsAppNotification(data) {
  if (!twilioClient || !process.env.TWILIO_WHATSAPP_FROM || !process.env.TWILIO_WHATSAPP_TO) return;
  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO,
      body: buildWhatsAppMessage(data)
    });
  } catch (err) {
    console.error('Error enviando WhatsApp:', err.message || err);
  }
}

async function createSignup({ nombre, telefono, email, nivel, origen }) {
  // Get box_id for Anboto
  const { data: box } = await supabase
    .from('boxes')
    .select('id')
    .eq('slug', 'anboto-crossfit')
    .single();

  if (!box) throw new Error('Box no encontrado');

  // Save to Supabase
  const { data, error } = await supabase
    .from('signups')
    .insert({
      box_id: box.id,
      nombre,
      telefono: telefono || null,
      email: email || null,
      nivel: nivel || null,
      origen: origen || 'formulario'
    })
    .select()
    .single();

  if (error) throw error;

  // Send WhatsApp notification (fire-and-forget)
  sendWhatsAppNotification({ nombre, telefono, email, nivel, origen });

  // Send notification email as fallback (fire-and-forget)
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (notifyEmail) {
    const fecha = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
    transporter.sendMail({
      from: `"Anboto Crossfit" <${process.env.GMAIL_USER}>`,
      to: notifyEmail,
      subject: '\u{1F525} Nueva inscripci\u00f3n - Anboto Crossfit',
      html: `
        <h2>Nueva inscripci\u00f3n en Anboto Crossfit</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Tel\u00e9fono:</strong> ${telefono || 'No indicado'}</p>
        <p><strong>Email:</strong> ${email || 'No indicado'}</p>
        <p><strong>Nivel:</strong> ${nivel || 'No indicado'}</p>
        <p><strong>Origen:</strong> ${origen}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <hr>
        <p>Responde a este email o llama directamente al cliente.</p>
      `
    }).catch(err => console.error('Error enviando email:', err.message || err));
  }

  return data;
}

module.exports = { createSignup };