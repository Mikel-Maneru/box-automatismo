const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { sendFollowupEmail } = require('../lib/email');
const reservas = require('../lib/booking');
const { sendAlerta } = require('../lib/email');

let lastCookieAlert = 0;

// GET /api/cron/followup - Send follow-up emails after free class
router.get('/followup', async (req, res) => {
  try {
    const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Keep-alive: valida la sesion del proveedor de reservas y reintenta login si caduco
    try {
      const valid = await reservas.validateSession();
      if (!valid) {
        console.error('Sesion del proveedor de reservas expirada y auto-login fallido');
        // Aviso al box, como mucho uno por hora
        if (Date.now() - lastCookieAlert > 60 * 60 * 1000) {
          lastCookieAlert = Date.now();
          await sendAlerta(
            '\u{26A0} Anboto SC: la sesion de ' + reservas.nombreProveedor + ' ha caducado',
            '<p>La sesion de ' + reservas.nombreProveedor + ' ha expirado y el login automatico ha fallado.</p>' +
            '<p><strong>Mientras no se arregle, nadie puede reservar la clase de prueba.</strong></p>' +
            '<p>Hay que renovar la cookie .WBAuth o revisar las credenciales del proveedor en Vercel.</p>'
          );
        }
      } else {
        console.log('Sesion del proveedor de reservas valida (keep-alive)');
      }
    } catch (err) {
      console.error('Error en keep-alive del proveedor de reservas:', err.message);
      if (Date.now() - lastCookieAlert > 60 * 60 * 1000) {
        lastCookieAlert = Date.now();
        await sendAlerta(
          '\u{26A0} Anboto SC: error en el keep-alive de ' + reservas.nombreProveedor,
          `<p>Ha fallado la comprobacion diaria de la sesion de ${reservas.nombreProveedor}.</p><p><code>${err.message}</code></p>`
        );
      }
    }

    // Find signups with confirmed bookings where the class has passed > 2 hours ago
    // and follow-up hasn't been sent yet
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data: pendingSignups, error } = await supabase
      .from('class_bookings')
      .select(`
        id,
        class_date,
        class_time,
        signup_id,
        signups (
          id,
          nombre,
          email,
          followup_sent
        )
      `)
      .eq('booking_status', 'confirmed')
      .lt('class_date', twoHoursAgo.split('T')[0]);

    if (error) {
      console.error('Error querying pending follow-ups:', error);
      return res.status(500).json({ error: 'Query failed' });
    }

    let sent = 0;
    let errors = 0;

    for (const booking of (pendingSignups || [])) {
      const signup = Array.isArray(booking.signups) ? booking.signups[0] : booking.signups;
      if (!signup || signup.followup_sent || !signup.email) continue;

      // Check if the class time has actually passed (> 2 hours after class end)
      const classDateTime = new Date(`${booking.class_date}T${booking.class_time}`);
      const classEnd = new Date(classDateTime.getTime() + 60 * 60 * 1000); // Assume 1h class
      if (classEnd > new Date()) continue;

      try {
        await sendFollowupEmail(signup.email, signup.nombre, signup.id);

        await supabase
          .from('signups')
          .update({
            followup_sent: true,
            followup_sent_at: new Date().toISOString(),
          })
          .eq('id', signup.id);

        sent++;
      } catch (err) {
        console.error(`Error sending follow-up to ${signup.email}:`, err.message);
        errors++;
      }
    }

    res.json({ ok: true, sent, errors });
  } catch (err) {
    console.error('Error en cron followup:', err.message);
    res.status(500).json({ error: 'Cron failed' });
  }
});

module.exports = router;