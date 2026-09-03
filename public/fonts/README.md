# Tipografías autoalojadas

Se sirven desde nuestro dominio **a propósito**, desde el 2026-09-02.

Antes se cargaban desde `fonts.googleapis.com`, y eso hacía que el navegador de cada
visitante enviase su dirección IP a Google **antes de que nadie hubiera aceptado nada**. Es
uno de los dos motivos por los que la web habría necesitado un banner de cookies (el otro era
el mapa incrustado, también retirado). Sirviéndolas nosotros, la web no hace **ninguna**
petición a terceros y el banner deja de ser necesario.

## Qué hay aquí

| Fichero | Familia | Pesos |
|---|---|---|
| `archivo-var-latin.woff2` / `-latin-ext` | Archivo (variable) | 400–900 en un solo fichero |
| `spacemono-400-latin.woff2` / `-latin-ext` | Space Mono | 400 |
| `spacemono-700-latin.woff2` / `-latin-ext` | Space Mono | 700 |

**No hay cursivas** y no hacen falta: todos los `<em>` del CSS son `font-style:normal`.

Los `latin-ext` sólo se descargan si aparece un carácter que los necesite — es lo que hace la
regla `unicode-range`. Una visita normal en castellano o euskera se baja unos 76 KB.

## Licencia

Ambas familias están bajo la **SIL Open Font License 1.1**, que permite alojarlas y
redistribuirlas. Origen y licencia completa:

- Archivo — https://fonts.google.com/specimen/Archivo
- Space Mono — https://fonts.google.com/specimen/Space+Mono

## Si hay que actualizarlas

Las declaraciones `@font-face` viven en `web/src/styles/global.css`. Si se cambia un fichero
hay que cambiar también el nombre allí. **No volver a enlazar a Google**: se rompería el
motivo por el que la web no lleva banner de cookies.
