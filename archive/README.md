# Archivo — páginas que ya no se publican

Versiones anteriores de la landing, conservadas **solo como referencia**. Estuvieron en
`public/`, y eso significaba que **se servían en producción**: `anbotosc.com/alt-1.html` y
compañía devolvían 200. Se descubrió el 2026-09-01, al cambiar el teléfono del box.

Estaban publicando:

- El teléfono del **socio anterior** (`688 661 924`) — justo lo que el cliente había pedido
  retirar. Se corrigió antes de moverlas, para que el historial no conserve el número.
- La marca **anterior** al rebrand de 2026-06-02.
- Enlaces a **`anbotofitness.com`**, un dominio que nunca llegó a existir.

Además, `alt-*.html` e `index.legacy.html` **no llevaban `noindex`** y `robots.txt` permitía
rastrearlas: eran copias de la landing compitiendo en Google con la buena.

## Por qué están aquí y no en `public/`

Porque Express (`src/index.js`) sirve `public/` **entera** y Vercel también. Sacarlas de esa
carpeta es lo único que garantiza que no se publiquen; un `noindex` o una regla en
`.vercelignore` dependen de acertar con un patrón, y en este repo ya hubo un incidente por
eso (`fotos/` sin anclar tumbó todas las imágenes del sitio).

Las cinco rutas antiguas **redirigen 301 a la portada**, en `vercel.json` y también en
`src/index.js`. Se eligió redirección y no 404 porque podían estar indexadas.

## Qué son

| Fichero | Qué es |
|---|---|
| `index.legacy.html` | La landing anterior a la migración a React (2026-08-15) |
| `reservar.legacy.html` | La página de reserva antes de pasarla a React |
| `alt-1/2/3.html` | Variantes de diseño del rediseño de 2026-06-02 |

**No las edites ni las vuelvas a mover a `public/`.** La web viva se genera desde `web/`.
