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
export const SCHED = {
  mon: [['06:30','WOD'],['09:30','Open Box'],['13:30','WOD'],['17:30','Oinarriak'],['18:30','WOD'],['19:30','Halterofilia'],['20:30','WOD']],
  tue: [['06:30','WOD'],['09:30','Open Box'],['13:30','WOD'],['17:30','WOD'],['18:30','Hyrox'],['19:30','WOD'],['20:30','Endurance']],
  wed: [['06:30','WOD'],['09:30','Open Box'],['13:30','WOD'],['17:30','Oinarriak'],['18:30','WOD'],['19:30','Total Strength'],['20:30','WOD']],
  thu: [['06:30','WOD'],['09:30','Open Box'],['13:30','WOD'],['17:30','WOD'],['18:30','Halterofilia'],['19:30','WOD'],['20:30','Hyrox']],
  fri: [['06:30','WOD'],['09:30','Open Box'],['13:30','WOD'],['17:30','Oinarriak'],['18:30','WOD'],['19:30','Endurance'],['20:30','WOD']],
  sat: [['09:00','WOD'],['10:00','Hyrox'],['11:00','Open Box']],
};
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

// WodBuster nombra algunas clases distinto que nosotros ("Wod" por "WOD", "Haltero" por
// "Halterofilia"). Normalizamos para poder cruzar el horario real con nuestro mapa.
export const claveClase = (nombre) =>
  (nombre || '').trim().toLowerCase().replace(/^halterofilia$/, 'haltero');

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

// Tarifas mensuales. price = número, feats = lista (claves i18n o texto fijo), pop = destacado.
export const PLANS = [
  { nameKey: 't.n8',  price: 60, feats: [{ k:'t.f8' }, { txt:'Wod, Open Box, Total Strength' }, { txt:'Haltero, Oinarriak, Endurance, Hyrox' }, { k:'t.coach' }] },
  { nameKey: 't.n12', price: 70, feats: [{ k:'t.f12' }, { txt:'Wod, Open Box, Total Strength' }, { txt:'Haltero, Oinarriak, Endurance, Hyrox' }, { k:'t.coach' }] },
  { nameKey: 't.n16', price: 80, feats: [{ k:'t.f16' }, { txt:'Wod, Open Box, Total Strength' }, { txt:'Haltero, Oinarriak, Endurance, Hyrox' }, { k:'t.coach' }] },
  { nameKey: 't.nun', price: 95, pop: true, feats: [{ k:'t.fun' }, { k:'t.fall' }, { k:'t.fwa' }, { k:'t.coach' }, { k:'t.fflex' }] },
];

export const WHATSAPP_URL = 'https://wa.me/34688661924?text=Hola%2C%20me%20gustar%C3%ADa%20apuntarme%20a%20una%20clase%20gratis%20en%20Anboto%20SC';
export const WODBUSTER_URL = 'https://anboto.wodbuster.com';
export const INSTAGRAM_URL = 'https://www.instagram.com/anbotofitness/';
