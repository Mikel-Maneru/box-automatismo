const supabase = require('../../src/lib/supabase');
const { sendFollowupEmail } = require('../../src/lib/email');
const wodbuster = require('../../src/lib/wodbuster');
const { sendWhatsApp } = require('../../src/lib/whatsapp');

let lastCookieAlert = 0;

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Keep-alive: validate WodBuster session and auto-re-login if expired
    try {
      const valid = await wodbuster.validateSession();
      if (!valid) {
        console.error('WodBuster session expired and auto-login failed!');
        if (Date.now() - lastCookieAlert > 60 * 60 * 1000) {
          lastCookieAlert = Date.now();
          await sendWhatsApp('⚠️ La sesion de WodBuster ha expirado y el auto-login ha fallado. Revisa las credenciales (WODBUSTER_EMAIL/PASSWORD) en Vercel.');
        }
      } else {
        console.log('WodBuster session valid (keep-alive)');
      }
    } catch (err) {
      console.error('WodBuster keep-alive error:', err.message);
      if (Date.now() - lastCookieAlert > 60 * 60 * 1000) {
        lastCookieAlert = Date.now();
        await sendWhatsApp(`⚠️ Error en WodBuster keep-alive: ${err.message}`);
      }
    }

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

      const classDateTime = new Date(`${booking.class_date}T${booking.class_time}`);
      const classEnd = new Date(classDateTime.getTime() + 60 * 60 * 1000);
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
};