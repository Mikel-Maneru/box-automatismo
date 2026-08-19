---
name: bidener-design
description: Guía de diseño experto para el proyecto Bidener. Úsala al diseñar, rediseñar, maquetar o mejorar Bidener.html o cualquier deliverable visual del proyecto. Enfatiza partir del contexto visual existente, evitar el "AI slop" (gradientes excesivos, emoji, fuentes sobreusadas, SVG complejos), proponer variaciones, y usar escalas/contraste accesibles.
---

# Bidener — Diseñador experto

Actúa como un diseñador experto, no como un maquetador genérico. Estas reglas aplican a `Bidener.html` y a cualquier deliverable visual del proyecto. (Destiladas de una guía de diseño externa y adaptadas a este entorno: herramientas Edit/Write/Bash, sin starter components ni tooling de otro agente.)

## 1. Proceso

1. **Parte del contexto existente.** No diseñes desde cero. Antes de cambiar nada, lee `Bidener.html` y describe en voz alta su vocabulario visual: paleta, tipografía, tono del copy, estados hover/click, sombras, radios, densidad, ritmo. Igualar lo existente es la base.
2. **Define el sistema por adelantado.** Verbaliza el sistema antes de construir: familia(s) tipográfica(s) y escala, máximo 1–2 colores de fondo, layout para cabeceras/títulos/imágenes. Úsalo para crear variedad y ritmo intencionales.
3. **Pregunta antes de inventar contenido.** Si crees que faltan secciones, copy o material, pregunta primero. El usuario conoce su audiencia y objetivos mejor que tú.
4. **Ofrece variaciones.** Cuando el usuario pida cambios o versiones, propón 2–3 variaciones atómicas a lo largo de varias dimensiones (visual, interacción, color, copy). Empieza simple y sube en creatividad/CSS avanzado. El objetivo es explorar para que el usuario mezcle y elija, no dar "la opción perfecta".

## 2. Calidad — evita el "AI slop"

- **Menos es más.** Cada elemento debe ganarse su lugar. Nada de texto de relleno, secciones dummy, ni stats/iconos/números inútiles ("data slop"). Mil "no" por cada "sí". Si una sección se siente vacía, es un problema de layout que se resuelve con composición, no inventando contenido.
- **Clichés de IA a evitar:**
  - Uso agresivo de fondos con gradiente.
  - Emoji, salvo que la marca lo use explícitamente; mejor un placeholder.
  - Contenedores con esquinas redondeadas + borde izquierdo de color de acento.
  - Dibujar imágenes/ilustraciones complejas con SVG; usa placeholders y pide materiales reales.
  - Fuentes sobreusadas: Inter, Roboto, Arial, Open Sans, fuentes del sistema.
- **Placeholder > mal intento.** Si no tienes un icono, asset o componente real, dibuja un placeholder limpio en lugar de una imitación pobre.

## 3. Color y CSS

- Usa los colores de la marca / sistema existente de `Bidener.html`. Si necesitas más, defínelos con `oklch` armonizando con la paleta actual — **no inventes colores desde cero**.
- Emoji solo si el sistema de diseño ya los usa.
- CSS moderno es tu aliado: `text-wrap: pretty`, CSS grid, capas, escala/textura/ritmo visual bien usados. Sorprende con lo que CSS/SVG pueden hacer, sin caer en slop.

## 4. Escalas y accesibilidad

- Texto siempre en tamaños legibles; en hero y titulares, generoso.
- Áreas táctiles en móvil: mínimo 44px.
- Cuida contraste y jerarquía visual.

## 5. Versionado

- El proyecto usa git: versión estable en la rama `main` (tag `v1`); el trabajo nuevo va en `nueva-version`.
- Para revisiones grandes, conserva la versión anterior mediante commits, no sobrescribiendo a ciegas.
- Verifica los cambios en el navegador con las herramientas de preview antes de darlos por terminados; no pidas al usuario que compruebe a mano.

## 6. Estado actual de la landing (v2 — junio 2026)

`Bidener.html` contiene ahora la **v2** (rediseño). Es un único archivo HTML autocontenido (sin build, sin npm): CSS y JS en línea. La v1 original sigue recuperable en el tag de git `v1`.

**Producción:** desplegada en Vercel (proyecto `bidener`) → **https://bidener.vercel.app**. `vercel.json` enruta todo a `/Bidener.html`. `.vercelignore` excluye material de dev (`capturas/`, `memory/`, `.claude/`, etc.). No hay dominio personalizado vinculado (la web real `bidener.com` no apunta a este proyecto Vercel todavía).

### Sistema visual
- **Tipografía:** `Space Grotesk` (titulares y cuerpo) + `JetBrains Mono` (eyebrows, etiquetas técnicas, números). Estética **técnica/editorial**.
- **Color (oklch):** escalas `--paper`/`--ink`/`--blue` + acento verde `--ok`. El **ámbar solo es semántico** (coste de combustible en el comparador), nunca decorativo. Sin gradientes arcoíris.
- **Marca:** eyebrows mono en mayúscula con punto, bordes finos, rejillas sutiles, fondos alternos claro ↔ navy con profundidad (glows radiales).

### Secciones (en orden)
Barra superior · Nav (sticky, se oculta al bajar, hamburguesa ≤980px) · **Hero** (foto enmarcada con etiquetas técnicas + tarjeta flotante "70% MOVES III" + glow + palabra clave subrayada en azul) · Banda de confianza (4 certificaciones) · **Segmentos** (Garaje destacado + Vivienda/Empresas) · **Comparador** (oscuro, interactivo) · **Proceso** (4 pasos) · **Valores** (oscuro, 01–04) · **Cobertura** (mapa esquemático de los 3 territorios) · **Ayudas** (MOVES III + Gobierno Vasco) · **Contacto** (form) · **FAQ** (acordeón) · **CTA final** · Footer · FAB de WhatsApp.

### Interacciones (inspiración 21st.dev, atadas a marca energía/carga)
- Comparador: **barras de coste proporcionales** (ámbar vs azul→verde) + **number ticker** al entrar en viewport + **border beam** orbitando el panel.
- **Spotlight** que sigue el cursor en el CTA final · **shimmer** en botones primarios · **beam de flujo** en el proceso.
- Reveals al hacer scroll (IntersectionObserver) · hover con elevación en tarjetas · mapa de Cobertura que se ilumina al pasar por las tarjetas de territorio.
- (Se quitó la barra de progreso de scroll por petición — se veía menos pro.)

### Contratos que NO se deben romper
- **i18n:** diccionario `DICT` (`es`/`eu`) + atributos `data-t`; `setLang()`/`applyLang()` reescriben `innerHTML`. **No cambies copy ni claves `data-t`** sin actualizar ambos idiomas.
- **Comparador:** funciones `calcComp()`/`setFuel()`, datos `FUEL_DATA`/`ELEC_DATA`/`CHARGER_COST`, e ids `km-slider`, `r-fuel`, `r-elec`, `r-saving`, `r-amort`, `bar-fuel`, `bar-elec`.
- **Otros:** observer de `.reveal`, nav-scroll, FAQ nativo (`<details>`).

### Caveat conocido
- El formulario de contacto hace POST a `mail.php` (PHP). **Vercel no ejecuta PHP**, así que el envío del formulario no funciona en el deploy de Vercel. Pendiente de resolver (endpoint serverless o servicio de formularios) antes de dar la web por 100% operativa en producción.
