# Brief compartido — Rediseño Anboto SC (3 alternativas)

Eres un **diseñador/ingeniero frontend de agencia top**. Vas a construir UNA landing page completa (un único archivo .html autocontenido) para un box de entrenamiento, partiendo del contenido existente y **respetando la marca**. NO inventas contenido nuevo: reutilizas el del sitio actual. Cambias **presentación, composición y motion**, no el contenido ni la funcionalidad.

## Punto de partida OBLIGATORIO
Lee `public/index.html` completo. Es la web actual (funciona, gusta). Contiene TODO el contenido, el diccionario i18n y todo el JS. Tu trabajo: reescribir el **`<style>`** y la **estructura HTML del `<body>`** (hero + composición de secciones) para realizar tu dirección asignada, **conservando**:
- Todo el **texto/copy** (ES) y todos los atributos **`data-i18n`** y **`data-i18n-ph`** en los mismos elementos (si mueves un texto, llévate su `data-i18n`).
- Todos los **`id`** de sección para que las anclas del nav funcionen: `#top`, `#sobre-nosotros`, `#que-es`, `#disciplinas`, `#horarios`, `#tarifas`, `#coaches`, `#opiniones`, `#faq`, `#empezar`, `#apuntarse`, `#contacto`.
- El **`<head>`** íntegro: title, meta description, canonical, Open Graph, Twitter, favicon SVG, y **los dos bloques JSON-LD** (HealthClub + FAQPage). Puedes cambiar SOLO los `<link>` de Google Fonts si tu dirección usa otras fuentes de marca.
- El **bloque `<script>` final completo** (diccionario `I18N` + toda la lógica JS) **tal cual, sin tocar**. Va justo antes de `</body>`.
- La línea `<script src="/widget/widget.js" data-token="anboto-token-2024"></script>` (widget de chat), antes del script principal.

## Contrato de JS intocable (estos id/clases los usa el JS — consérvalos o el sitio se rompe)
- Nav: elemento con `id="nav"` (el JS le añade `.scrolled` al hacer scroll y `.menu-open`). Cabecera transparente sobre el hero, **sólida al hacer scroll**. NO la ocultes según dirección de scroll: queda fija.
- Menú móvil: `id="hamburger"` y `id="mobileMenu"` (clase `.open`). Los enlaces del menú móvil llevan `onclick="closeMobile()"` (función global del JS). Botón hamburguesa con 3 `<span>`.
- Idioma: dos botones `.lang-btn` con `data-lang="es"` y `data-lang="eu"` (clase `.active`). Imprescindible para el toggle ES/EU.
- Slideshow del hero (opcional según dirección): si usas fotos de fondo en el hero, la estructura debe ser `.hero` → `.h-bg` → varios `.slide` (el JS les pone `.show` alternando). Si tu dirección NO usa slideshow, simplemente no incluyas `.slide` (el JS es seguro: hace `if(!slides.length) return`).
- Hilo de altitud (raíl lateral): conserva `<div class="track"><div class="fill" id="altFill"></div><div class="dot" id="altDot">↑ 0 M</div></div>`. El JS fija altura de `#altFill`, top de `#altDot` y su texto. Puedes reestilarlo pero mantén los id.
- FAQ acordeón: cada item `.faq` contiene `.faq-q` (con `role="button" tabindex="0" aria-expanded`) y `.faq-a`. El JS abre/cierra con clase `.open` en `.faq`.
- Reveal al scroll: pon la clase `.rev-up` en lo que quieras animar; el JS le añade `.in` al entrar en viewport. Define en tu CSS el estado inicial de `.rev-up` y el final `.rev-up.in` (transición suave, respeta `prefers-reduced-motion`).
- Number-ticker: los números animados llevan `data-count="46"` y opcional `data-suffix="+"`. Mantén estos atributos en los stats.
- Horario interactivo: contenedores `id="ttDays"` y `id="ttPanel"` (vacíos; el JS los rellena). El JS genera botones `.tt-day` (clase `.on` activa) y filas `.tt-row` con `.tm` (hora) y `.cl` (clase). DEFINE CSS para `.tt-day`, `.tt-day.on`, `.tt-row`, `.tm`, `.cl`.
- Formulario: `id="signupForm"` con inputs `#signup-nombre`, `#signup-telefono`, `#signup-email`, `select#signup-nivel`, botón `#signupBtn`, mensaje `#signupMsg`, y un input honeypot oculto `name="website"`. Mantén todos los id (el JS hace POST a `/api/signup`).
- i18n: cada elemento traducible mantiene su `data-i18n`. El hero actual usa claves `hero.l1`/`hero.l2` (y existe `hero.h1` con versión de 3 líneas, y `hero.desc`, `hero.card`, `hero.more`, `hero.ig`). Usa claves existentes; no pierdas ninguna traducción.

## Sistema de marca (OBEDÉCELO)
Colores (CSS vars actuales — reúsalas):
```
--pizarra:#1B1A18;  /* casi-negro cálido (texto/fondos oscuros) */
--granito:#6E6960;  /* gris piedra (texto secundario) */
--bruma:#DAD5CB;    /* beige claro (bordes/sutil) */
--caliza2:#ECE8DF;  /* piedra clara 2 (fondos alternos) */
--caliza:#F6F3EC;   /* piedra (fondo principal claro) */
--brasa:#E16C34;    /* ASCUA/naranja — acento primario de marca */
--brasa-d:#C8551F;  /* ascua oscuro (hover) */
--larre:#3E8B5C;    /* verde monte — acento secundario puntual */
--larre-d:#33744C;
```
Si necesitas tonos extra, derívalos en **oklch** armonizando con estos; no inventes una paleta nueva.

Tipografía de marca: **Archivo** (display, pesos 400–900, tracking cerrado en titulares) + **Space Mono** (etiquetas/eyebrows/datos, mayúsculas, tracking abierto). Puedes añadir UNA fuente display complementaria SOLO si tu dirección lo pide y combina con la marca (justifícalo); por defecto, Archivo + Space Mono.

Identidad: **el monte Anboto** (1.331 m, Durangaldea/Bizkaia). Motivo gráfico = **triángulo/pico** + barra brasa (es el logo: `path d="M50 10 L91 88 H9 Z M30 66 H70 V75 H30 Z"`). Metáfora de **ascenso/altitud**. Índices de sección **bilingües**: `01 — Esentzia · Sobre nosotros`. Bilingüe euskera·castellano en toda la web. Tono: cercano, de barrio, cálido pero exigente. Cierre de marca: **"GORA ANBOTO! · ↑ 1.331 M"**.

Negocio: Anboto Strength & Conditioning (Anboto SC), Polígono Ertzilla P4, 48215 Iurreta (Bizkaia), junto a salida A8 Durango. Tel 688 661 924, anbotocf@gmail.com, @anbotofitness. 4.9★ (46 reseñas). Disciplinas: WOD/CrossFit, Halterofilia, Hyrox, Endurance, Oinarriak, Total Strength, Open Box. Primera clase GRATIS. Reservas en WodBuster (https://anboto.wodbuster.com).

## Fotos reales disponibles (en /fotos/, rutas absolutas)
Usa estas (conocidas, funcionan). Puedes listar `fotos/` para ver más, pero estas son seguras:
```
/fotos/681663370_18141850495507230_842418771480859784_n.jpeg
/fotos/684158573_18141850543507230_7164727509411748566_n.jpeg
/fotos/684166869_18141850504507230_4228607507298611888_n.jpeg
/fotos/622920499_18141564865474629_8282454509847242170_n.jpeg
/fotos/497431307_18106569196507230_5749734071044956827_n.jpeg
/fotos/624429118_18089691254121461_6918128091737313437_n.jpeg
/fotos/625681096_18091344503008058_5522638003780336332_n.jpeg
/fotos/629223800_18205928797322466_1736022441803597074_n.jpeg
```
**Usa fotografía real, NO dibujes imágenes complejas con SVG.** SVG sólo para iconos simples, el pico/logo, líneas, patrones geométricos.

## Calidad — evita el "AI slop"
Menos es más. Cada elemento se gana su sitio; nada de relleno ni "data slop". Evita: gradientes de fondo agresivos por todos lados, emoji (la marca no los usa), tarjetas redondeadas con borde-acento a la izquierda genéricas, fuentes sobreusadas (Inter/Roboto/Arial/Open Sans) — la marca tiene las suyas. Los efectos "wow" deben **significar algo para esta marca** (ascenso, altitud, montaña, comunidad, esfuerzo), ir en paleta de marca, y aparecer **una vez, donde aportan**. Contención.

## Mobile-first + reglas no negociables
La mayoría entra desde el móvil. Diseña y comprueba el móvil primero.
- `body{overflow-x:hidden}` y **cero desbordamiento horizontal** en 390 / 768 / 1440 px. Nada de anchos fijos mayores que el viewport; usa `max-width`, `clamp()`, `minmax()`.
- Inputs y selects a **`font-size:16px`** mínimo (evita el zoom de iOS al enfocar).
- Áreas táctiles **≥44px**. CTA principal a **ancho completo** en móvil; el secundario **compacto** (no apiles dos botones pesados a ancho completo).
- Sobre fotos: **scrim/overlay fuerte** + `text-shadow`/`drop-shadow` y peso para que el texto se lea siempre.
- Cuida el **contraste** (WCAG AA). Ojo al invertir paletas (texto claro que queda invisible sobre fondo claro).
- Añade **`scroll-margin-top`** a las secciones con ancla (la cabecera fija no debe taparlas). El `html` ya trae `scroll-padding-top`.
- 0 errores de consola. CSS moderno bienvenido: grid, `clamp`, `text-wrap:balance/pretty`, capas, máscaras, glows sutiles.

## Entregable
- Escribe TU archivo en la ruta que se te indique (alt-1 / alt-2 / alt-3). **No toques `public/index.html` ni los otros alt-\*.html.** No ejecutes git. No arranques servidores de desarrollo (la verificación en navegador la hago yo de forma central).
- El archivo debe ser **autocontenido**: un solo .html con `<style>` inline y el `<script>` original al final. Misma estructura general de secciones (todas presentes), nueva piel y composición.
- Al terminar, devuelve un resumen: nombre de la dirección, decisiones de diseño (layout del hero, fuentes usadas y por qué, tokens oklch nuevos si los hay, efectos "wow" y su significado de marca), y **confirmación explícita** de que conservas el contrato de JS (lista los id que mantienes) y todas las claves i18n.
