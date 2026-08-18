let client = null;

function getClient() {
  if (client) return client;

  const apiKey = process.env.KAPSO_API_KEY;

  if (!apiKey) return null;

  try {
    const { WhatsAppClient } = require('@kapso/whatsapp-cloud-api');
    client = new WhatsAppClient({
      baseUrl: 'https://api.kapso.ai/meta/whatsapp',
      kapsoApiKey: apiKey,
    });
    return client;
  } catch {
    console.error('Error inicializando cliente Kapso WhatsApp');
    return null;
  }
}

async function sendWhatsApp(message) {
  const wa = getClient();
  if (!wa) {
    console.log('Kapso no configurado, saltando WhatsApp');
    return null;
  }

  const phoneNumberId = process.env.KAPSO_PHONE_NUMBER_ID;
  const to = process.env.KAPSO_WHATSAPP_TO;

  if (!phoneNumberId || !to) {
    console.error('KAPSO_PHONE_NUMBER_ID y KAPSO_WHATSAPP_TO son obligatorias');
    return null;
  }

  try {
    const result = await wa.messages.sendText({ phoneNumberId, to, body: message });
    console.log('WhatsApp enviado:', result?.messages?.[0]?.id);
    return result;
  } catch (err) {
    console.error('Error enviando WhatsApp:', err.message || err);
    return null;
  }
}

async function sendNewSignupNotification(nombre, telefono, email, nivel, origen, objetivo, comoConocio) {
  return sendWhatsApp(
    `Nueva inscripcion: ${nombre} | Tlf: ${telefono || '-'} | Email: ${email || '-'} | Nivel: ${nivel || '-'} | Objetivo: ${objetivo || '-'} | Nos conocio por: ${comoConocio || '-'} | Origen: ${origen}`
  );
}

async function sendWantsToJoinNotification(nombre, telefono, email) {
  return sendWhatsApp(
    `${nombre} (${telefono || 'sin tlf'}, ${email || 'sin email'}) quiere unirse a Anboto Crossfit! Llamar para formalizar la inscripcion.`
  );
}

module.exports = { sendNewSignupNotification, sendWantsToJoinNotification, sendWhatsApp };