const { BookingAuthError } = require('./errors');

// Punto unico por el que el resto de la aplicacion habla con el sistema de reservas
// del box. Las rutas NO deben importar un proveedor concreto: asi cambiar de sistema
// es cambiar una variable de entorno, no reescribir codigo.
//
// Interfaz que todo proveedor debe cumplir:
//   getClassAvailability(date) -> { classes: [...], realData: bool }
//   getWeeklySchedule()        -> { mon: [[hora, clase], ...], ... } | null  (opcional)
//   bookClass(classId, date)   -> { success: bool }
//   validateSession()          -> bool
// y lanzar BookingAuthError cuando la sesion haya caducado.

const PROVIDERS = {
  wodbuster: () => require('./wodbuster'),
  aimharder: () => require('./aimharder'),
};

const NOMBRES = { wodbuster: 'WodBuster', aimharder: 'AimHarder' };

const elegido = (process.env.BOOKING_PROVIDER || 'wodbuster').toLowerCase();
const cargar = PROVIDERS[elegido];

if (!cargar) {
  throw new Error(
    `BOOKING_PROVIDER="${elegido}" no existe. Valores validos: ${Object.keys(PROVIDERS).join(', ')}`
  );
}

const proveedor = cargar();

module.exports = {
  // Nombre legible del proveedor, para logs y para los emails de aviso al box.
  nombreProveedor: NOMBRES[elegido] || elegido,
  proveedorActivo: elegido,

  getClassAvailability: (...args) => proveedor.getClassAvailability(...args),
  // Parrilla semanal para la web. Opcional: no todos los proveedores tienen que darla.
  getWeeklySchedule: (...args) => (proveedor.getWeeklySchedule ? proveedor.getWeeklySchedule(...args) : Promise.resolve(null)),
  bookClass: (...args) => proveedor.bookClass(...args),
  validateSession: (...args) => proveedor.validateSession(...args),

  BookingAuthError,
};
