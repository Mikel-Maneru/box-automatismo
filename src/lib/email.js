const { Resend } = require('resend');
const supabase = require('./supabase');

let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3003';

// Remitente. OJO: con el `onboarding@resend.dev` de pruebas, Resend SOLO entrega al correo
// dueño de la cuenta y rechaza cualquier otro destinatario. Para escribir al box o a los
// usuarios hay que verificar un dominio en Resend y poner MAIL_FROM, por ejemplo
// "Anboto SC <hola@anbotosc.com>".
const MAIL_FROM = process.env.MAIL_FROM || 'Anboto SC <onboarding@resend.dev>';

async function createSignup({ nombre, telefono, email, nivel, objetivo, comoConocio, origen }) {
  // Get box_id for Anboto
  const { data: box } = await supabase
    .from('boxes')
    .select('id')
    .eq('slug', 'anboto-fitness')
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
      objetivo: objetivo || null,
      como_conocio: comoConocio || null,
      origen: origen || 'formulario'
    })
    .select()
    .single();

  if (error) throw error;

  // Send notification email via Resend
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (notifyEmail && resend) {
    const fecha = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: MAIL_FROM,
        to: notifyEmail,
        subject: '\u{1F525} Nueva inscripción - Anboto SC',
        html: `
          <h2>Nueva inscripción en Anboto SC</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Teléfono:</strong> ${telefono || 'No indicado'}</p>
          <p><strong>Email:</strong> ${email || 'No indicado'}</p>
          <p><strong>Nivel:</strong> ${nivel || 'No indicado'}</p>
          <p><strong>Objetivo:</strong> ${objetivo || 'No indicado'}</p>
          <p><strong>Cómo nos conoció:</strong> ${comoConocio || 'No indicado'}</p>
          <p><strong>Origen:</strong> ${origen}</p>
          <p><strong>Fecha:</strong> ${fecha}</p>
          <hr>
          <p>Responde a este email o llama directamente al cliente.</p>
        `
      });
      if (emailError) {
        console.error('Error enviando email via Resend:', emailError);
      } else {
        console.log('Email enviado via Resend:', emailData?.id);
      }
    } catch (err) {
      console.error('Error enviando email via Resend:', err.message || err);
    }
  }

  // Generate scheduling token and send scheduling email
  if (data?.id && email) {
    try {
      const crypto = require('crypto');
      const token = crypto.randomBytes(32).toString('hex');

      const { error: tokenError } = await supabase
        .from('signup_tokens')
        .insert({
          signup_id: data.id,
          token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (tokenError) {
        console.error('Error guardando signup_token:', tokenError);
      } else {
        await sendSchedulingEmail(email, nombre, token);

        await supabase
          .from('signups')
          .update({ scheduling_email_sent: true })
          .eq('id', data.id);
      }
    } catch (err) {
      console.error('Error en flujo de scheduling:', err.message || err);
    }
  }

  return data;
}

async function sendSchedulingEmail(toEmail, nombre, token) {
  if (!resend) {
    console.log('Resend no configurado, saltando email de scheduling');
    return;
  }

  const schedulingUrl = `${BASE_URL}/reservar?token=${token}`;

  try {
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: MAIL_FROM,
      to: toEmail,
      subject: 'Elige tu clase gratuita en Anboto SC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Hola ${nombre}!</h2>
          <p>Gracias por querer probar una clase en Anboto SC.</p>
          <p>Elige el dia y la hora que mejor te vengan para tu clase gratuita:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${schedulingUrl}" style="background-color: #ff6b35; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">Elige tu clase gratuita</a>
          </div>
          <p style="color: #666; font-size: 14px;">Este enlace caduca en 7 dias. Si tienes cualquier duda, escribenos por WhatsApp al 688 661 924.</p>
        </div>
      `
    });
    if (emailError) {
      console.error('Error enviando email de scheduling:', emailError);
    } else {
      console.log('Email de scheduling enviado:', emailData?.id);
    }
  } catch (err) {
    console.error('Error enviando email de scheduling:', err.message || err);
  }
}

async function sendFollowupEmail(toEmail, nombre, signupId) {
  if (!resend) return;

  // Generate a new token for the follow-up actions
  const crypto = require('crypto');
  const followupToken = crypto.randomBytes(32).toString('hex');

  await supabase
    .from('signup_tokens')
    .insert({
      signup_id: signupId,
      token: followupToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

  const yesUrl = `${BASE_URL}/api/followup/yes?token=${followupToken}`;
  const noUrl = `${BASE_URL}/api/followup/no?token=${followupToken}`;

  try {
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: MAIL_FROM,
      to: toEmail,
      subject: 'Como te fue en tu clase en Anboto SC?',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Hola ${nombre}!</h2>
          <p>Esperamos que disfrutaras tu clase en Anboto SC!</p>
          <p>Te ha gustado? Quieres formar parte de la familia Anboto?</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${yesUrl}" style="background-color: #4caf50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block; margin-right: 10px;">Si, me quiero apuntar!</a>
            <a href="${noUrl}" style="background-color: #999; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; display: inline-block;">No, gracias</a>
          </div>
          <p style="color: #666; font-size: 14px;">Si tienes cualquier duda, escribenos por WhatsApp al 688 661 924.</p>
        </div>
      `
    });
    if (emailError) {
      console.error('Error enviando email de follow-up:', emailError);
    } else {
      console.log('Email de follow-up enviado:', emailData?.id);
    }
  } catch (err) {
    console.error('Error enviando email de follow-up:', err.message || err);
  }
}

// Aviso operativo al box. Sustituye a las notificaciones que iban por WhatsApp (Kapso):
// lead que quiere apuntarse y sesion de WodBuster caida.
async function sendAlerta(subject, html) {
  const to = process.env.NOTIFY_EMAIL;
  if (!to || !resend) {
    console.log('Sin NOTIFY_EMAIL o Resend, no se envia aviso:', subject);
    return null;
  }
  try {
    const { error } = await resend.emails.send({ from: MAIL_FROM, to, subject, html });
    if (error) console.error('Error enviando aviso:', error);
  } catch (err) {
    console.error('Error enviando aviso:', err.message || err);
  }
  return null;
}

module.exports = { createSignup, sendSchedulingEmail, sendFollowupEmail, sendAlerta };