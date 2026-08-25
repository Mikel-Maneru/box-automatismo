const mapa = require('../../shared/clases.json');

// Normaliza el nombre de una clase tal y como lo devuelve el sistema de reservas.
// El box renombra las clases de vez en cuando ("Wod" -> "WOD (ANBOTO)"), asi que hay
// que ser tolerante: minusculas, fuera el sufijo entre parentesis y espacios colapsados.
function clave(nombre) {
  return (nombre || '')
    .replace(/\([^)]*\)/g, ' ')   // "WOD (ANBOTO)" -> "WOD "
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// Devuelve el nombre canonico de la clase, o el original si no lo reconocemos
// (mejor enseñar el nombre del proveedor que perder la clase).
function canonica(nombre) {
  return mapa.alias[clave(nombre)] || (nombre || '').trim();
}

function descripcion(nombre) {
  const c = canonica(nombre);
  return mapa.descripciones[c] || c;
}

// Para comparar la clase de un objetivo con la que viene del proveedor.
function esMismaClase(a, b) {
  return canonica(a).toLowerCase() === canonica(b).toLowerCase();
}

module.exports = { clave, canonica, descripcion, esMismaClase, mapa };
