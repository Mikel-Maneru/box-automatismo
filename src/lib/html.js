// Escapado de HTML para todo lo que venga de fuera y acabe dentro de una plantilla.
//
// Hace falta porque el nombre que escribe la persona en el formulario se interpola tal cual
// en las paginas que sirve `webhook.js` y en los correos de `email.js`. La validacion de
// `signup.js` solo comprueba la LONGITUD (2-50 caracteres), no el contenido, asi que un
// nombre como `<img src=x onerror=...>` pasaba el filtro y se ejecutaba en una pagina
// servida desde nuestro propio dominio.
//
// Se escapan tambien la comilla simple y la doble: aunque hoy los valores solo caen en el
// cuerpo del HTML, si alguien los mete manana en un atributo sin darse cuenta, siguen
// estando a salvo.
const MAPA = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(valor) {
  if (valor === null || valor === undefined) return '';
  return String(valor).replace(/[&<>"']/g, (c) => MAPA[c]);
}

module.exports = { escapeHtml };
