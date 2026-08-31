import mapa from '../../../shared/clases.json';

// Espejo en frontend de src/lib/clases.js: ambos leen el MISMO shared/clases.json,
// para que la recomendacion por objetivo no pueda desincronizarse del backend.
// Ya paso: el box renombro "Wod" a "WOD (ANBOTO)" y la recomendacion dejo de casar
// en silencio, sin error ni aviso.

// Minusculas, sin el sufijo entre parentesis y sin espacios de sobra.
export const clave = (nombre) => (nombre || '')
  .replace(/\([^)]*\)/g, ' ')
  .trim()
  .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // sin acentos: INICIACION / INICIACIÓN valen igual
  .replace(/\s+/g, ' ');

// Nombre canonico, o el original si no lo reconocemos.
export const canonica = (nombre) => mapa.alias[clave(nombre)] || (nombre || '').trim();

// ¿Son la misma clase, aunque el proveedor la llame distinto?
export const esMismaClase = (a, b) =>
  canonica(a).toLowerCase() === canonica(b).toLowerCase();

// ¿Es entrenamiento libre (Open Box, Gimnasio + Open) en vez de clase guiada?
export const esLibre = (nombre) => (mapa.libres || []).includes(canonica(nombre));

export default mapa;
