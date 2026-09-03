// Datos del sitio (portados del index.legacy.html). Texto no traducido = ES fijo.

// Fotos del box (agosto 2026). Los originales de camara viven en fotos/ (fuera de git,
// pesan 4-7 MB cada uno); aqui solo van las versiones optimizadas de public/fotos/.
export const HERO_SLIDES = [
  '/fotos/hero-1-monte.jpg',
  '/fotos/hero-2-clase.jpg',
  '/fotos/hero-3-calle.jpg',
  '/fotos/hero-4-fila.jpg',
];

// { src, alt } para que cada foto tenga su texto alternativo: antes todas decian "Anboto SC".
export const IG_PHOTOS = [
  { src: '/fotos/ig-1-risa.jpg',     alt: 'Atleta riendo con la camiseta de Anboto tras el entrenamiento' },
  { src: '/fotos/ig-3-grupo.jpg',    alt: 'Grupo de companeros charlando y riendo en el box' },
  { src: '/fotos/ig-4-apoyo.jpg',    alt: 'Companeras ayudando a una atleta durante el ejercicio' },
  { src: '/fotos/ig-6-veterano.jpg', alt: 'Atleta veterano entrenando a tope en Anboto SC' },
  { src: '/fotos/ig-2-sonrisa.jpg',  alt: 'Atleta sonriendo en el box de Anboto SC' },
  { src: '/fotos/ig-5-charla.jpg',   alt: 'Companeras juntas entre serie y serie' },
  { src: '/fotos/ig-7-trineo.jpg',   alt: 'Empujando el trineo en la calle, junto al box' },
  { src: '/fotos/ig-8-equipo.jpg',   alt: 'Foto de equipo de la comunidad de Anboto SC' },
];

// Horario interactivo (idéntico a SCHED del sitio original).
export const DAYS = [
  ['mon', 'd.mon'], ['tue', 'd.tue'], ['wed', 'd.wed'],
  ['thu', 'd.thu'], ['fri', 'd.fri'], ['sat', 'd.sat'],
];
// HORARIOS — dos salas, escritos a mano (2026-09-03).
//
// Los mando Xabi en dos carteles, uno por sala. Es un horario PLANO a proposito: en octubre,
// al migrar a AimHarder, pasara a venir de `GET /calendar/:fecha`, que ademas devuelve el
// aforo. Hasta entonces, esto es la fuente de verdad.
//
// OJO: la llamada a /api/schedule esta DESACTIVADA en Horarios.jsx. Si se reactiva sin mas,
// pisara esta tabla con lo que tenga WodBuster, que es el horario VIEJO. Ver el comentario
// de ese fichero antes de tocarlo.
//
// Los nombres van en el vocabulario de la web, no en el del cartel, para que la seccion de
// clases y la recomendacion por objetivo sigan casando (ver shared/clases.json):
//   Iniciacion -> Oinarriak · Haltero -> Halterofilia · Hycross -> Hyrox
//   Strength -> Total Strength · Mobilidad+Core -> Movilidad + Core
export const SALAS = [
  { id: 'anboto',  k: 'sala.anboto',  dk: 'sala.anboto.d',  nk: 'sala.anboto.n' },
  { id: 'alluitz', k: 'sala.alluitz', dk: 'sala.alluitz.d', nk: 'sala.alluitz.n' },
];

// Sala Anboto — cross training, halterofilia, iniciacion y endurance.
export const SCHED_ANBOTO = {
  mon: [['06:15','WOD'],['07:15','WOD'],['10:30','WOD'],['12:30','WOD'],['14:30','WOD'],['17:15','Hyrox'],['18:15','WOD'],['19:15','WOD'],['20:15','WOD']],
  tue: [['06:15','WOD'],['07:15','Oinarriak'],['10:30','WOD'],['12:30','WOD'],['14:30','WOD'],['17:15','WOD'],['18:15','WOD'],['19:15','Halterofilia'],['20:15','Oinarriak']],
  wed: [['06:15','WOD'],['07:15','WOD'],['10:30','WOD'],['12:30','Oinarriak'],['14:30','WOD'],['17:15','Endurance'],['18:15','WOD'],['19:15','WOD'],['20:15','WOD']],
  thu: [['06:15','WOD'],['07:15','WOD'],['10:30','Total Strength'],['12:30','WOD'],['14:30','WOD'],['17:15','WOD'],['18:15','Total Strength'],['19:15','WOD'],['20:15','Gymnastics']],
  fri: [['06:15','WOD'],['07:15','WOD'],['10:30','WOD'],['12:30','WOD'],['14:30','WOD'],['17:15','WOD'],['18:15','WOD'],['19:15','Oinarriak']],
  sat: [['09:00','Team WOD'],['10:00','Team WOD'],['11:00','Team WOD']],
};

// Sala Alluitz — salud, funcional, tonificacion y gimnasio libre.
// Martes y jueves solo tienen tarde; el sabado no tiene clases guiadas, pero la sala abre.
export const SCHED_ALLUITZ = {
  mon: [['06:30','Funcional'],['07:30','Funcional'],['10:15','Funcional'],['17:30','Total Strength'],['18:30','Funcional']],
  tue: [['17:30','Funcional'],['18:30','Hyrox']],
  wed: [['06:30','Tonificación'],['07:30','Funcional'],['10:15','Hyrox'],['17:30','Total Strength'],['18:30','Funcional']],
  thu: [['17:30','Funcional'],['18:30','Movilidad + Core']],
  fri: [['06:30','Funcional'],['07:30','Hyrox'],['10:15','Funcional'],['17:30','Tonificación'],['18:30','Funcional']],
  sat: [],
};

export const SCHED_POR_SALA = { anboto: SCHED_ANBOTO, alluitz: SCHED_ALLUITZ };

// getDay(): 0=Dom..6=Sáb -> clave del día (Dom cae a lun)
export const TODAY_KEYS = ['mon','mon','tue','wed','thu','fri','sat'];

// Disciplinas (6). eu = etiqueta euskera·categoría, name = título, dk = clave i18n descripción.
export const DISCIPLINAS = [
  { eu: 'Eguneroko · Todos',   name: 'WOD',            dk: 'disc.d1' },
  { eu: 'Hasiberriak · Inicio', name: 'Oinarriak',      dk: 'disc.d2' },
  { eu: 'Indarra · Técnica',   name: 'Halterofilia',    dk: 'disc.d3' },
  { eu: 'Lehiakorra · Híbrido', name: 'Hyrox',          dk: 'disc.d4' },
  { eu: 'Aerobikoa · Fondo',   name: 'Endurance',       dk: 'disc.d5' },
  { eu: 'Indarra · Fuerza',    name: 'Total Strength',  dk: 'disc.d6' },
];

// Objetivos (5). Única fuente de verdad: la sección de clases filtra con esto y el
// formulario recomienda con esto, así web y alta nunca se contradicen.
// `clases` referencia DISCIPLINAS[].name; el primero es la puerta de entrada recomendada.
export const OBJETIVOS = [
  { id: 'salud',       k: 'obj.salud', dk: 'obj.salud.d', clases: ['WOD', 'Oinarriak', 'Endurance'] },
  { id: 'rendimiento', k: 'obj.rend',  dk: 'obj.rend.d',  clases: ['Hyrox', 'WOD', 'Endurance'] },
  { id: 'musculacion', k: 'obj.musc',  dk: 'obj.musc.d',  clases: ['Total Strength', 'Halterofilia'] },
  { id: 'grasa',       k: 'obj.grasa', dk: 'obj.grasa.d', clases: ['WOD', 'Endurance', 'Hyrox'] },
  { id: 'empezar',     k: 'obj.emp',   dk: 'obj.emp.d',   clases: ['Oinarriak', 'WOD'] },
];

// Valores que viajan al backend (castellano fijo, como `nivel`): el backend valida
// contra esta misma lista. Ver VALID_OBJETIVOS en src/routes/signup.js.
export const OBJETIVO_VALUES = {
  salud: 'Salud y bienestar',
  rendimiento: 'Rendimiento',
  musculacion: 'Musculación',
  grasa: 'Perder grasa',
  empezar: 'Empezar de cero',
};

// Del valor guardado en la BD ("Empezar de cero") al objetivo, para poder recomendar
// clases en /reservar con el mismo criterio que usa la landing.
export const objetivoPorValor = (v) =>
  OBJETIVOS.find((o) => OBJETIVO_VALUES[o.id] === v) || null;

// Los sistemas de reserva nombran las clases a su manera ("Wod", "WOD (ANBOTO)", "Haltero").
// La normalizacion vive en shared/clases.json, que tambien lee el backend.
export { clave as claveClase, canonica as claseCanonica, esMismaClase } from './clases.js';

// Canales de captación para "¿Cómo nos conociste?" (value fijo ES, label traducida).
export const CANALES = [
  { id: 'instagram', value: 'Instagram',          k: 'cc.ig' },
  { id: 'google',    value: 'Google',             k: 'cc.google' },
  { id: 'amigo',     value: 'Un amigo',           k: 'cc.amigo' },
  { id: 'paso',      value: 'Pasaba por delante', k: 'cc.paso' },
  { id: 'otro',      value: 'Otro',               k: 'cc.otro' },
];

// Coaches (4).
export const COACHES = [
  { ini: 'XO', name: 'Xabi Osa',        rk: 'c.r1', pk: 'c.p1' },
  { ini: 'MB', name: 'Mikel Blanco',    rk: 'c.r2', pk: 'c.p2' },
  { ini: 'IS', name: 'Illan Setien',    rk: 'c.r2', pk: 'c.p3' },
  { ini: 'IG', name: 'Izas Gastañaga',  rk: 'c.r3', pk: 'c.p4' },
];

// Reseñas (texto ES fijo, no traducido en el original).
export const REVIEWS = [
  { av: 'K', name: 'KapI kasper',  src: 'Local Guide', text: 'Gran familia de entrenamiento, grandes coaches. Box grande y fácil acceso, muy cerca de la salida de autopista A8 Durango.' },
  { av: 'C', name: 'Claudia Diaz', src: 'Local Guide', text: 'Box al lado de Durango, muy buen ambiente y acogida. En mi caso solo estuve de paso dos días y me sentí como en casa. Eskerrik asko!' },
  { av: 'I', name: 'Iñigo Perez',  src: 'Google',      text: 'Muy buen sitio para entrenar. Muy buen ambiente, buenos entrenadores y material de primera. Un lujo.' },
  { av: 'K', name: 'Kike Largo',   src: 'Local Guide', text: 'He estado como en casa, gracias Xabi por toda tu amabilidad. Nos vemos en el box!' },
];

export const WHATSAPP_URL = 'https://wa.me/34688606754?text=Hola%2C%20me%20gustar%C3%ADa%20apuntarme%20a%20una%20clase%20gratis%20en%20Anboto%20SC';
export const WODBUSTER_URL = 'https://anboto.wodbuster.com';
export const INSTAGRAM_URL = 'https://www.instagram.com/anbotofitness/';
