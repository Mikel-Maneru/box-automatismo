# Cómo reutilizar el proceso de mejora en otro proyecto

Aquí tienes el **playbook** que aplicamos en Bidener, empaquetado para que lo uses en otra web.
Lo entrego en las **3 formas** que pediste — elige la que te encaje:

---

## Opción A · Skill (recomendada, para Claude Code)
Ya está creado en: `.claude/skills/premium-redesign/SKILL.md`

**Instalar en el otro proyecto:** copia esa carpeta a la raíz del otro repo:
```
<otro-proyecto>/.claude/skills/premium-redesign/SKILL.md
```
Reinicia Claude Code en ese proyecto. A partir de ahí se **activa solo** cuando digas cosas como
"mejora esta web", "rediseña la landing", "hazla más atractiva", "tengo un manual de marca"…
o invócalo a mano con `/premium-redesign`.

> Es genérico (no menciona Bidener), así que sirve para cualquier web.

---

## Opción B · Agente (subagente dedicado)
Si prefieres un agente al que delegar la tarea, crea este archivo en el otro proyecto:
`.claude/agents/redisenador-premium.md`

```md
---
name: redisenador-premium
description: Mejora/rediseña una web existente a calidad premium respetando el manual de marca, mobile-first, sin romper contenido/i18n/formularios/SEO, verificando en navegador y desplegando con versionado.
tools: ["*"]
---
Sigue al pie de la letra el playbook de la skill `premium-redesign` (en .claude/skills/premium-redesign/SKILL.md).
Trabaja como diseñador/ingeniero frontend de agencia top. Prioridad mobile-first.
No despliegues a producción ni cambies ajustes públicos sin confirmación explícita del usuario.
```
(Requiere tener también la carpeta de la skill copiada.)

---

## Opción C · Prompt (pegar en cualquier sesión)
Si no usas el sistema de skills, pega esto al empezar:

> Quiero mejorar esta web existente a calidad premium siguiendo nuestro manual de marca, **sin
> romper contenido, i18n, formularios ni SEO**, con prioridad **mobile-first**. Proceso:
> (1) extrae el sistema de marca del manual y respétalo (paleta en hex y oklch, tipografías,
> logo, tono); (2) audita la web actual y haz inventario de lo intocable (copy, i18n, formularios,
> calculadoras, meta/SEO, anclas); (3) versiona con git y **etiqueta la versión actual** (`git tag v1`),
> trabaja en rama/archivo aparte; (4) propón **3+ variaciones de hero** en un único archivo con
> selector para que yo elija; (5) construye la elegida a página completa reusando todo el contenido
> y la lógica; (6) **verifícalo en el navegador** a 390/768/1440 → **0 errores de consola, 0
> desbordamiento horizontal, contraste e interactividad OK**; (7) despliega en Vercel (**preview
> primero**). Reglas móvil: inputs a 16px (evita zoom iOS), áreas táctiles ≥44px, cabecera
> transparente que se vuelve sólida al hacer scroll (no la ocultes según el scroll), checkbox/select
> a medida, CTA principal a ancho completo y secundario compacto. Avísame de los caveats (PHP no
> corre en Vercel; cambia imágenes stock por assets de marca; caché de producción ~1h).

---

## Lo esencial que aprendimos (resumen)
- **Marca primero**: extrae el sistema del manual y obedécelo; extiende color con `oklch`.
- **No romper**: conserva copy, i18n (`data-t`/diccionarios), formularios, calculadoras, SEO, anclas.
- **Variaciones, no una sola**: propón 3+ heroes en un selector; deja elegir al cliente.
- **Wow con sentido**: efectos tipo 21st.dev **atados al significado de la marca**, una vez cada uno.
- **Mobile-first + verificación real** en navegador (consola, overflow, contraste, interactividad).
- **Versiona** (tags `v1/v2/v3`) y **despliega con cuidado** (preview → producción; `.vercelignore`).

> Pásame el **manual de marca** y la **URL/código** del otro proyecto y lo arrancamos con esto.
