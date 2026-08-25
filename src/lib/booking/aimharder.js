const { BookingAuthError } = require('./errors');

// Cliente de AimHarder. ESQUELETO A PROPOSITO: todavia no hay documentacion oficial
// de su API (agosto 2026). Lo unico que circula por internet es ingenieria inversa
// del trafico de su web:
//
//   POST https://login.aimharder.com/api/login        (email, password, fingerprint)
//   GET  https://{box}.aimharder.com/api/bookings?day=YYYYMMDD&box={boxId}
//   POST https://{box}.aimharder.com/api/book         (id, day, insist, familyId)
//
// NO se implementa sobre eso. Es exactamente el camino que ya nos costo caro con
// WodBuster: cookie renovada a mano, CAPTCHA bloqueando el login automatico y, lo
// peor, reservas hechas con la cuenta personal de una persona del box.
//
// Cuando Xabi consiga de AimHarder la documentacion y unas credenciales de servicio,
// se rellena esto respetando la misma interfaz que expone `wodbuster.js`:
//
//   getClassAvailability(date) -> { classes: [{ id, name, time, available, full,
//                                               capacity, booked }], realData: bool }
//   bookClass(classId, date)   -> { success: bool }
//   validateSession()          -> bool
//
// Para la clase de prueba gratuita NO hace falta API: AimHarder publica una pagina
// donde el interesado se registra el mismo y reserva, que es justo lo que queremos
// (queda a su nombre, no al del box). Va en AIMHARDER_TRIAL_URL.

const BOX = process.env.AIMHARDER_BOX_SLUG || '';
const BOX_ID = process.env.AIMHARDER_BOX_ID || '';

const noConfigurado = (que) => {
  throw new Error(
    `AimHarder todavia no esta implementado (${que}). Falta la documentacion oficial de su API. ` +
    'Mientras tanto usa BOOKING_PROVIDER=wodbuster.'
  );
};

async function getClassAvailability(_date) {
  return noConfigurado('getClassAvailability');
}

async function bookClass(_classId, _date) {
  return noConfigurado('bookClass');
}

async function validateSession() {
  // Sin credenciales no hay sesion que validar: se responde false para que el cron
  // avise por email en vez de reventar.
  if (!BOX || !BOX_ID) return false;
  return noConfigurado('validateSession');
}

module.exports = {
  getClassAvailability,
  bookClass,
  validateSession,
  BookingAuthError,
};
