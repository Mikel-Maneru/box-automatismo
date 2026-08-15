// Datos del sitio (portados del index.legacy.html). Texto no traducido = ES fijo.

// Fotos reales del box (placeholders hasta que llegue el nuevo centro).
export const HERO_SLIDES = [
  '/fotos/681663370_18141850495507230_842418771480859784_n.jpeg',
  '/fotos/684158573_18141850543507230_7164727509411748566_n.jpeg',
  '/fotos/684166869_18141850504507230_4228607507298611888_n.jpeg',
  '/fotos/622920499_18141564865474629_8282454509847242170_n.jpeg',
];

export const IG_PHOTOS = [
  '/fotos/681663370_18141850495507230_842418771480859784_n.jpeg',
  '/fotos/684158573_18141850543507230_7164727509411748566_n.jpeg',
  '/fotos/684166869_18141850504507230_4228607507298611888_n.jpeg',
  '/fotos/497431307_18106569196507230_5749734071044956827_n.jpeg',
  '/fotos/622920499_18141564865474629_8282454509847242170_n.jpeg',
  '/fotos/624429118_18089691254121461_6918128091737313437_n.jpeg',
  '/fotos/625681096_18091344503008058_5522638003780336332_n.jpeg',
  '/fotos/629223800_18205928797322466_1736022441803597074_n.jpeg',
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
