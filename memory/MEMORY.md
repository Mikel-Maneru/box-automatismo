# Memory Index — Anboto Project

**READ THIS FIRST** al comenzar cada sesión en este proyecto. Actualizado: **2026-09-02**.

---

## 📋 Quick Status (2026-09-02)

| Item | Status | Notes |
|------|--------|-------|
| **Rama activa** | `main` | Ya mergeada (`a81baca`) y 5 commits por delante de `feat/react-vite-migration`. Verificado el 25-08-2026 |
| **Dominio** | ✅ **https://anbotosc.com EN PRODUCCIÓN** | `A 76.76.21.21` en IONOS + cert TLS. `www` redirige 308 |
| **Fase 1** | ✅ COMPLETA | Dominio, widget con marca, favicon según tema |
| **Fase 2** | ✅ **DESPLEGADA Y VERIFICADA EN VIVO** | Clases por objetivo, formulario guiado, `/reservar` en React |
| **Email propio** | ✅ **FUNCIONANDO** | Envío real comprobado a `anbotocfügmail.com` desde `holaüsend.anbotosc.com` |
| **WhatsApp** | ❌ Eliminado (`017f05c`) y **desplegado** | Los 2 avisos que importaban pasaron a email |
| **Chat** | ✅ **En la cuenta de Anthropic de Xabi** (2026-08-19) | Mikel es admin. Verificado en vivo. Paga Xabi |
| **Limpieza** | ✅ `api/` borrado (`ff330ef`) | Queda solo el dominio `send.anboto.sc` en Resend |
| **Tarifas** | 🚫 **NO se publican precios** — ✅ **EN PRODUCCIÓN (25-08-2026)** | Petición del cliente. Fuera de la landing, del JSON-LD y del prompt del chatbot. Ver `decisions.md` |
| **Horario** | 🔶 **ESTATICO y por SALAS** (03-09-2026, `17ed23e`) | Xabi mando el horario nuevo en dos carteles: **Sala Anboto** y **Sala Alluitz**, con programacion distinta. La llamada a `/api/schedule` esta **QUITADA** de `Horarios.jsx` a proposito: WodBuster tiene el horario VIEJO y reactivarla pisaria el bueno. **Vuelve a ser automatico en octubre**, contra `GET /calendar/:fecha` de AimHarder |
| **Clases de Alluitz** | ✅ **EN PRODUCCION (31-08-2026, `d621f4e`)** | La web muestra el horario titulado "Anboto SC", el unico con Alluitz. 59 franjas con clases del gimnasio |
| **⚠️ Web vs reservas** | 🔶 **DIFIEREN MAS AUN — y se acepta hasta octubre** | La web enseña el horario NUEVO; WodBuster sigue con el VIEJO (web 10:30/12:30, reservas 10:15/12:45; Funcional, Tonificacion y Movilidad + Core **no se pueden reservar**). **NO se arregla en WodBuster**: en octubre se migra a AimHarder y se resuelve solo. Riesgo asumido durante septiembre: quien vea una clase en la web puede no encontrarla para reservar |
| **Domingo** | ✅ **PUBLICADO (02-09-2026)** | Xabi: **5:00–00:00, sin clases guiadas, solo entreno libre arriba**. Ya esta en la nota de horarios y en el JSON-LD (`closes: "23:59"`, no `"00:00"`, que es ambiguo). Google deja de mostrar "cerrado" |
| **Horas de apertura** | ✅ **RESUELTO (03-09-2026)** | Ya no se deducen de las clases: el JSON-LD declara **5:00–23:59 los SIETE dias**, que es lo que abre de verdad la Sala Alluitz segun el cartel de Xabi. Anboto tiene Open Box 6:15–21:15 mientras haya clases |
| **Telefono** | ✅ **688 60 67 54 — el OFICIAL del box** (01-09-2026, `45e72a2`) | Ha cambiado dos veces en dos dias: `688 661 924` (socio anterior) → `622 768 134` (Xabi) → **`688 60 67 54`**. En 13 ficheros + Supabase (`phone` y `faqs`, que es de donde lo dicta el chatbot) |
| **Paginas archivadas** | ✅ **RETIRADAS del despliegue** (01-09-2026, `cea484a`) | Estaban en `public/` y daban **200** con la marca vieja, `anbotofitness.com` y (hasta ese dia) el telefono del socio anterior. Movidas a **`archive/`** + `/archive/` en `.vercelignore`. Las 5 rutas **redirigen 308 a `/`** (regla en `vercel.json` **y** en `src/index.js`). Verificado en produccion |
| **Reserva automatica** | 🚫 **DESACTIVADA — decision confirmada (01-09-2026)** | Que el interesado se apunte solo se queda inhabilitado. `WODBUSTER_AUTOBOOK` **borrada de Vercel** (existia con valor oculto: no habia forma de saber si estaba ON). Ausente = off, y asi es auditable. La plaza la crea el **aviso por email al box** |
| **Proveedor de reservas** | 🔄 **A AimHarder en OCTUBRE 2026** | Fecha confirmada por Mikel el 01-09. Capa `src/lib/booking/` lista: el interruptor es `BOOKING_PROVIDER=aimharder`, pero `aimharder.js` es un **esqueleto sin implementar**. **Las docs oficiales YA estan** (02-09): https://aimharder.com/api_doc/aimharder/index.html — ver punto 11 de `people.md`. Lo unico que falta son **los TOKENS**, que genera Xabi en Configuracion > API |
| **API de AimHarder** | ✅ **OFICIAL y documentada** (02-09-2026) | `api.aimharder.com`, Bearer + refresh. **`GET /calendar/:fecha`** da nombre, hora, aforo y sala; **`POST /classes/booking/guest`** reserva A NOMBRE DEL INVITADO — eso elimina de raiz el problema de la cuenta personal y deja obsoleto el plan de traspaso a su pagina de bonos. Trampas: **solo HTTP/1.1** (con h2 da 403) y el **refresh token ROTA** |
| **Cifras de la landing** | ✅ Socios retirado (02-09-2026, `b3f2b45`) | Decia "46+ miembros activos" y 46 eran las RESEÑAS de Google. Quedan 8+ años · 6 disciplinas · 4,9★. **Ojo: "6 disciplinas" se queda corta** — el horario real tiene 12 tipos de clase |
| **Tipos de clase** | 🔶 En la PARRILLA salen todos; en la seccion de objetivos, 6 | La parrilla por salas ya muestra WOD, Oinarriak, Halterofilia, Hyrox, Endurance, Total Strength, Team WOD, Gymnastics, Funcional, Tonificacion y Movilidad + Core. La seccion "Una clase para cada objetivo" sigue con 6 **a proposito**: añadir las demas necesita una descripcion bilingüe y un objetivo por clase, que tiene que dar el cliente. **No lo inventes.** |
| **Legal / RGPD** | ✅ **EN PRODUCCION (02-09-2026)** | `/privacidad`, `/cookies`, `/aviso-legal` + casilla de consentimiento (sin marcar, validada en SERVIDOR) + aviso en el chat. Comprobado en produccion: **0 peticiones a terceros, 0 cookies** |
| **Datos expuestos** | 🔶 **2 de 3 corregidos** | ✅ Fuera el `console.log(req.body)` que metia nombre/telefono/email en los logs · ✅ escapado de HTML en 7 sitios · ⚠️ **la SUPABASE_SERVICE_KEY SIGUE SIN ROTAR** desde el 18-08: es el punto mas grave, da acceso total a datos de personas reales y no caduca hasta 2036 |
| **SQL pendiente** | ⚠️ **Ejecutar el final de `schema.sql` en Supabase** | RLS en las 7 tablas + columnas `consentimiento_at` y `politica_version`. Mientras no se ejecute, el alta funciona igual (hay reintento) pero **NO se guarda la prueba del consentimiento**, y el log lo grita en cada alta |
| **Próxima acción** | 🔴 **ROTAR `SUPABASE_SERVICE_KEY`** (18 dias expuesta, acceso total a datos personales) · 🔴 **ejecutar el SQL del final de `schema.sql`** en Supabase · pedir a Xabi los **TOKENS de AimHarder** (ruta critica de octubre) y sus **datos fiscales** (razon social y NIF) para las paginas legales, que hoy los muestran como hueco ROJO · las **horas reales de apertura L–S** · rotar tambien `RESEND_API_KEY` y `ANTHROPIC_API_KEY` |

### ⚠️ Diez trampas que ya nos costaron horas — no repetir

1. **Nameservers de Vercel sin zona.** Poner `ns*.vercel-dns-*.com` en el registrador NO funciona
   si Vercel no gestiona el DNS: responden REFUSED → SERVFAIL global y no se arregla esperando.
   Señal: SERVFAIL (no NXDOMAIN) + "Intended Nameservers" vacío. Solución: registros A/CNAME.
2. **Nombre de dominio mal partido.** En Resend se creó `send.anboto.sc` en vez de
   `send.anbotosc.com`. Leer el nombre carácter a carácter antes de tocar el DNS.
3. **API key de la cuenta equivocada.** El dominio estaba verificado en la cuenta Resend del box
   (`anbotocf`), pero la `RESEND_API_KEY` del `.env` era de la cuenta **personal de Mikel**. Resend
   respondía *"The send.anbotosc.com domain is not verified"* aunque el DNS estuviera perfecto: un
   dominio verificado en una cuenta **no existe** para la clave de otra.
   **Cómo saber de quién es una clave sin entrar al panel:** intenta enviar a una dirección
   cualquiera; si la cuenta está en modo pruebas, el error 403 dice literalmente el email del
   titular (*"You can only send testing emails to your own email address (X)"*).

4. **El box renombra sus clases y nada avisa.** WodBuster paso de "Wod" a "WOD (ANBOTO)" y
   se rompieron dos cosas EN SILENCIO: la descripcion de cada clase pasaba a mostrar el nombre
   crudo, y la recomendacion por objetivo dejo de casar, asi que el badge "Recomendado" de
   /reservar desaparecio sin que nadie lo notara. La causa de fondo era tener el mapa de
   nombres duplicado en tres ficheros. Ahora hay uno solo (`shared/clases.json`) y la
   normalizacion ignora acentos y sufijos entre parentesis.
   **Ha pasado DOS veces**: primero "Wod" -> "WOD (ANBOTO)", y despues INICIACION por
   Oinarriak, HYCROSS por Hyrox y STRENGTH por Total Strength. Da por hecho que volvera a
   pasar. **Nunca compares nombres de clase por string crudo: usa esMismaClase().**
5. **Desplegar sin hacer `git pull` estando dos personas.** El 25-08 se desplego a produccion
   antes de bajarse los commits del otro equipo, y eso **devolvio a la web las tarifas** que
   acababan de retirarse. Se detecto porque el `git push` fallo despues. **Orden correcto:
   `git pull` -> build -> `vercel --prod`**, y comprobar el hash del bundle servido.

6. **Un 503 "correcto" puede ser mala idea de cara al navegador.** `/api/schedule` devolvia
   503 cuando no habia horario, y eso pintaba un error rojo en la consola de una pagina que
   funcionaba perfectamente (la web tira del respaldo). Ahora responde 200 con
   `schedule:null`: para el cliente no es un error, es ausencia de dato.

7. **La web de WodBuster publica VARIAS tablas de horario a la vez, y no son alternativas.**
   El 31-08-2026 habia tres, tituladas "Anboto", "Abuztua" (agosto) y "Anboto SC". El scraper
   cogia `tables[0]` **por posicion**, que resulto ser la unica SIN las clases de Alluitz.
   Dos lecciones:
   - **Elegir la tabla por TITULO, no por indice.** El orden cambia cada vez que el box
     publica un horario nuevo, y un indice fijo caduca sin que salte ningun error.
   - **Cada tabla vale para un uso distinto, y hay que separarlos.** La que casa con lo
     realmente reservable manda en el emparejamiento con la API (`/api/classes`); la titulada
     con la marca actual manda en la parrilla de la web. Hoy **difieren a proposito**.
   Como se averiguo cual estaba vigente: **contrastando contra la disponibilidad real de
   mañana** por la API. La tabla nueva decia 10:30 Funcional y la API devolvia 10:15 WOD.
   No te fies del titulo ni del orden: **comprueba contra lo que se puede reservar.**

10. **`pkill` NO mata procesos de Node en Windows desde Git Bash.** El 02-09 costo cuatro
   altas de prueba en la base de datos REAL y cuatro correos al box. Se creia estar probando
   codigo nuevo y respondia el servidor viejo, que seguia vivo: el nuevo moria con
   EADDRINUSE **en segundo plano y sin que se viera**, y como el puerto respondia 200, la
   comprobacion de "ya ha arrancado" daba por bueno el proceso equivocado.
   **Como matarlo de verdad:** `Get-CimInstance Win32_Process -Filter "Name='node.exe'"`
   filtrando por `CommandLine` y `Stop-Process -Force`, desde PowerShell.
   **Y la leccion de fondo:** antes de probar contra la base de datos de produccion,
   confirmar que el servidor que responde es el que acabas de arrancar — que el puerto
   conteste no lo demuestra. Mejor aun: si la prueba escribe datos, buscar la forma de no
   escribirlos (aqui bastaba con `delete process.env.NOTIFY_EMAIL` para no enviar el aviso).
   Nota: `PORT=3999 node src/index.js` **no funciona** en este repo — dotenv usa
   `override:true` y el `PORT` del `.env` pisa la variable.

8. **Todo lo que hay en `public/` SE SIRVE, aunque lo llames "archivado" o "legacy".**
   Express sirve la carpeta entera y Vercel tambien. Descubierto el 01-09-2026 al cambiar el
   telefono: `/alt-1.html`, `/alt-2.html`, `/alt-3.html`, `/index.legacy.html` y
   `/reservar.legacy.html` daban **200 en produccion** y llevaban meses enseñando el numero
   del socio anterior — justo lo que el cliente habia pedido quitar. Nadie los revisaba
   porque "son ficheros archivados". **Al hacer un cambio global, incluye `public/` entero,
   no solo `web/src/`.**
   **Resuelto el 01-09:** esas cinco paginas viven ahora en `archive/`, con redireccion 308
   a `/`. La regla general que queda: **si no debe ser publico, no puede estar en `public/`.**
   Sacarlo de la carpeta es lo unico que lo garantiza — un `noindex` o un patron en
   `.vercelignore` dependen de acertar, y aqui ya fallo una vez (ver trampa de `fotos/`).
   Lo mismo con los bundles: `emptyOutDir: false` hace que los `assets/*.js` de builds
   anteriores se acumulen, y **siguen accesibles por su URL con el contenido viejo dentro**.
   Hay que borrarlos, pero **con cuidado**: `client-*.js` NO aparece en el HTML y aun asi lo
   importa `app-*.js`. Mirar solo las referencias del HTML se lleva por delante un fichero
   necesario (paso el 01-09; lo salvo reconstruir y comprobar antes de dar nada por bueno).
   **Criterio correcto: conservar lo referenciado por el HTML servido _o_ por cualquier JS o
   manifest que se conserve.**

9. **Un interruptor peligroso guardado como "Sensitive" es un interruptor que nadie puede
   auditar.** El 01-09-2026, al confirmar que la reserva automatica seguia apagada, aparecio
   `WODBUSTER_AUTOBOOK` **en el entorno de produccion de Vercel**, creada 13 dias antes y con
   el **valor oculto**. El proyecto fuerza las variables a "Sensitive", asi que ni
   `vercel env ls` ni `vercel env pull` la revelan (`pull` devuelve `"[SENSITIVE]"`). Es
   decir: no habia forma de saber si en produccion se estaba apuntando a gente real con la
   cuenta PERSONAL de Mikel.
   **Regla: para un flag booleano cuyo estado seguro es "apagado", no lo pongas a `off` —
   BORRALO.** El codigo ya cae en desactivado cuando la variable no existe, y una ausencia se
   comprueba de un vistazo; un valor oculto, no. Guarda "Sensitive" para secretos de verdad
   (claves, tokens), no para banderas de comportamiento.
   Y **ojo**: cambiar variables de entorno **no surte efecto hasta que se vuelve a
   desplegar**, aunque no cambie una linea de codigo.

---

## 📚 Memory Files (Read in Order)

1. **[user.md](user.md)** — Who you are, your role, communication style, dev patterns
2. **[project_status.md](project_status.md)** — MOST IMPORTANT: Current phase status, completed work, pending tasks, key files
3. **[preferences.md](preferences.md)** — Coding standards, project constraints, workflow, tools
4. **[decisions.md](decisions.md)** — All architectural decisions since 2026-05-05 (rebrand, migrations, etc)
5. **[people.md](people.md)** — Stakeholders (Xabi), open decisions needing discussion

---

## 🔧 Critical Files (For Context & Execution)

### Configuration & Setup
- `CLAUDE.md` — Project instructions, commands (`npm run dev`, `npm run web:build`), architecture
- `.env.example` — Template for environment variables (copy & fill, never commit .env)
- `schema.sql` — Supabase DDL + seed data (boxes, conversations, messages, signups tables)
- `deploy-anbotosc.sh` — Run this when anbotosc.com DNS resolves (checks + `vercel --prod`)

### Frontend (React+Vite, in `web/`)
- `web/src/data/site.js` — SCHED es el horario de RESPALDO (el bueno llega de /api/schedule), disciplinas, objetivos, coaches
- `web/src/components/Signup.jsx` — formulario de alta (ya lleva objetivo y "como nos conociste")
- `web/src/i18n/dict.js` — ES/EU translations
- `web/src/styles/global.css` — Brand color palette (Anboto official colors)

### Backend (Express, in `src/`)
- `src/routes/chat.js` — POST /api/chat (Claude API, token validation)
- `src/routes/scheduling.js` — GET /api/schedule (parrilla semanal, cache 6h) + /api/classes + /api/book
- `src/routes/signup.js` — POST /api/signup (Supabase insert)
- `src/lib/booking/` — capa de proveedor: `index.js` (elige con BOOKING_PROVIDER), `wodbuster.js`,
  `aimharder.js` (esqueleto) y `errors.js` (BookingAuthError COMPARTIDO)
- `shared/clases.json` + `src/lib/clases.js` — nombres de clase, fuente unica para backend y frontend
- `src/lib/supabase.js` — Lazy Supabase client (Proxy pattern for zero-env startup)

### Widget
- `public/widget/widget.js` — Embeddable chat widget (vanilla JS, no framework)

---

## 🎯 Phase 1 Summary (COMPLETE ✅)

### 1. Domain Setup
- ✅ anbotosc.com nameservers → Vercel DNS (ns1-4.vercel-dns-3.com)
- ✅ BASE_URL in .env updated to https://anbotosc.com
- ⏳ DNS propagating (check with `nslookup anbotosc.com`)

### 2. Chat Widget Redesign
- ✅ Icon changed from generic bubble to brand "pico bubble"
- ✅ Colors: madera #A7693B (btn), cuero #703D26 (hover), caliza #F4EDE2 (panel)
- ✅ Full Anboto palette applied: pizarra, granito, bruma, caliza, madera, cuero

### 3. Favicon Theme-Aware
- ✅ Light theme: black pico
- ✅ Dark theme: caliza pico
- ✅ Implementation: SVG data URI + CSS media query + JS fallback

### 4. Security
- ✅ Vercel token rotated after accidental exposure

---

## 🚀 Fase 2 — ✅ EN PRODUCCIÓN (2026-08-19)

Las 4 preguntas que bloqueaban esta fase se resolvieron implementando. Lo que hay en vivo:

1. **Clases por objetivo** — la sección *"Una clase para cada objetivo"* ya existía (era el título
   de Disciplinas, `disc.title`), así que se convirtió esa en vez de crear otra.
2. **Formulario** con `objetivo` y `comoConocio`, que recomienda clases **antes** de enviar.
3. **`/reservar` en React** (`web/src/pages/Reservar.jsx`), que recomienda el hueco del día
   según el objetivo elegido en el formulario.
4. **Avisos por email** a `anbotocfügmail.com`, WhatsApp eliminado.

Sigue pendiente de la fase original: usar la **API oficial de WodBuster** (la pide Xabi) y pasar
el chat a la **cuenta de Anthropic de Xabi**.

### Detalles de implementación que conviene no re-descubrir
- **El reveal rompe el filtrado.** `useScrollFx` observa `.rev-up` **solo al montar** y deja de
  observar cada tarjeta al revelarla → una tarjeta creada al filtrar nunca recibe `.in` y queda
  invisible para siempre. Solución: las 6 disciplinas siguen montadas y se ocultan con `[hidden]`
  (hace falta `.ei[hidden]{display:none}` porque `.ei` es `display:grid` y gana al `[hidden]` del
  navegador), y tras la primera interacción las tarjetas nacen con `.in`.
- **Un solo hueco recomendado en `/reservar`.** Marcar todas las clases del objetivo no sirve:
  la mayoría de huecos del día son WOD y acababan señalados 7 de 10. Se recorre `clases` por orden
  de preferencia y se marca **el primero reservable**.
- **`claveClase()`** cruza los nombres: WodBuster dice `Wod` y `Haltero` donde nosotros decimos
  `WOD` y `Halterofilia`. Sin ese puente la recomendación no casa nunca.
- **Fechas en euskera a mano.** Chromium en Windows **no trae datos de la locale `eu`**:
  `Intl.DateTimeFormat('eu-ES')` cae a castellano sin avisar. Hay arrays explícitos en `Reservar.jsx`.
- **El `<Head>` de vite-react-ssg no llega al HTML generado** en esta versión: el `<title>` y el
  `noindex` de `/reservar` se ponen en cliente y la señal buena es `Disallow: /reservar` en
  `robots.txt`.
- El SSG emite `public/reservar.html` **en la misma ruta de siempre**, así que la ruta de Express
  y el rewrite de `vercel.json` siguieron valiendo sin tocarlos.

---

## 📞 People & Decisions

- **Mikel**: Owner, developer, makes final decisions
- **Xabi**: Involved in box operations, needs to discuss 9 open items (see people.md)
- **Anthropic API**: Currently using Mikel's personal account → phase 2 should move to client/Xabi account

---

## ⚠️ Important Constraints

- **Never add `build` script** to root package.json (Vercel breaks)
- **Vite output** must be named `web:build` not `build`
- **public/ folder** is COMMITTED (Vercel serves it directly, not building on deploy)
- **Production deploy** is MANUAL: `vercel --prod` (auto Git↔Vercel disabled since 2026-05-12)
- **WodBuster auth**: Manual cookie + CAPTCHA (fully automated login impossible)
- **Brand name**: Always "Anboto SC" in UI; internal slug/domain stays "anboto-fitness" for compat
- **Secrets in .env**: Never committed; local only; rotate immediately if exposed

---

## ✅ Commands Reference

```bash
npm run dev              # Express :3003 + Vite :5173 (Vite proxies /api to Express)
npm run web:build       # Build React landing to public/ (vite-react-ssg)
npm start               # Express serving public/ (production mode)
npm run server:dev      # Express only (no Vite)
npm run web:dev         # Vite only (no Express)
npm run web:install     # Install web/ dependencies separately
vercel --prod           # Desplegar a producción (MANUAL, el push no despliega)
```

Comprobar que un deploy salió de verdad (no fiarse del "ready"):

```bash
curl -s https://anbotosc.com | grep -o 'app-[A-Za-z0-9_-]*\.js'
```

Ese hash debe coincidir con el de `public/assets/`. Si no coincide, producción está atrasada.

---

## 🔗 External Links & Accounts

- **Vercel Project**: box-automatismo (`team_Ui7yFZ02hiIaqHBTalIHAOQP`). Deploy MANUAL:
  la integración Git↔Vercel está inactiva desde el 12-may, hacer push NO despliega.
- **Supabase**: tgbpgxakctedvlyepppu.supabase.co
- **WodBuster**: anboto.wodbuster.com (login manual con credenciales de Mikel, CAPTCHA)
- **Registrador**: IONOS — cuenta **anbotocfügmail.com** (¡no la personal de Mikel!)
- **Email**: Resend, **cuenta `anbotocf`** (¡NO la personal de Mikel — ver trampa 3!).
  Dominio de envío `send.anbotosc.com` (eu-west-1) ✅ · `MAIL_FROM=Anboto SC <holaüsend.anbotosc.com>`
  - La `RESEND_API_KEY` es **solo de envío**: no sirve para leer ni crear dominios por API
    (devuelve `restricted_api_key`). Para inspeccionar dominios hay que mirar el panel.
- ~~WhatsApp API: Kapso~~ — **eliminado el 2026-08-19**, los avisos van solo por email

---

## 🎓 Lo aprendido en la sesión del 18–19 de agosto

**El patrón que se repitió dos veces: dar por buena una configuración sin verificarla.**
Primero con los nameservers (se esperaron 5 horas a una "propagación" que nunca iba a llegar,
porque los NS respondían REFUSED) y después con el nombre del dominio de Resend
(`send.anboto.sc` en vez de `send.anbotosc.com`).

En ambos casos **30 segundos de comprobación** habrían ahorrado horas:
- `nslookup dominio 8.8.8.8` → SERVFAIL ≠ NXDOMAIN ≠ respuesta buena, cada uno dice algo distinto
- Preguntar **directamente al nameserver autoritativo** antes de culpar a la propagación
- Leer el nombre del dominio carácter a carácter antes de crear registros DNS a su alrededor

Y una regla de trabajo: **verificar el resultado, no el paso**. Que IONOS diga "guardado" o que
Vercel diga "deploy ready" no prueba nada; lo que prueba es `curl` devolviendo 200 y el bundle
servido coincidiendo con el del repo.
