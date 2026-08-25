// Error compartido por TODOS los proveedores de reservas.
//
// Tiene que vivir aqui y no dentro de cada proveedor: las rutas hacen
// `err instanceof BookingAuthError` para distinguir "sesion caducada" de un fallo
// cualquiera, y si cada proveedor definiera su propia clase esa comprobacion
// fallaria en silencio al cambiar de proveedor.
class BookingAuthError extends Error {
  constructor(message = 'Sesion del sistema de reservas expirada') {
    super(message);
    this.name = 'BookingAuthError';
  }
}

module.exports = { BookingAuthError };
