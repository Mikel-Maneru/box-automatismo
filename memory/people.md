# People

## Anboto SC
- Box owner: Mikel
- **Xabi** — implicado en el box (aparece en resenas de Google: "gracias Xabi por toda tu
  amabilidad" y en la seccion de coaches). ROL EXACTO POR CONFIRMAR: coach, socio o
  responsable del negocio. Varias decisiones de cuentas y facturacion dependen de esto.

## Stakeholders
<!-- Add clients, partners, team members -->

## Contacts
<!-- Add relevant external contacts -->

---

# PENDIENTE DE HABLAR CON XABI

Lista abierta (anotada el 2026-08-18). Marcar como resuelto y mover a `decisions.md` segun se cierre.

## 1. Cuenta de Anthropic y facturacion del chat  ← el motivo original de esta lista
Hoy el chat consume de la cuenta de **Mikel** y se le factura a el. Decision del usuario:
debe pasar a Xabi.
- El codigo NO esta atado a ninguna cuenta: es solo la variable `ANTHROPIC_API_KEY`
  (`src/routes/chat.js` y `api/chat.js`). El cambio es de una linea de configuracion.
- Camino recomendado: **Xabi crea la cuenta/organizacion en console.anthropic.com con SU
  metodo de pago y despues invita a Mikel como administrador**. Asi paga Xabi pero Mikel
  conserva el control de claves y consumo. Al reves NO sirve: si Mikel invita a Xabi a su
  organizacion, el cargo lo sigue pagando Mikel.
- Luego: poner la clave nueva en el panel de Vercel (produccion) y revocar la de Mikel.
- Alternativa si no compensa: quitar el widget de chat. El formulario de reserva seguiria
  funcionando igual y desapareceria el gasto de API.

## 2. URGENTE — rotar credenciales expuestas
El 2026-08-18 se pegaron TODAS las claves en texto plano en un chat. Hay que rotarlas.
Por orden de gravedad:
- `SUPABASE_SERVICE_KEY` — se salta el RLS, acceso total a la BD (hay 16 inscripciones con
  nombres, telefonos y emails de personas reales). El JWT caduca en 2036.
- `VERCEL_TOKEN` — permite desplegar y administrar el proyecto.
- `ANTHROPIC_API_KEY` (se resuelve solo con el punto 1), `RESEND_API_KEY`,
  `TWILIO_AUTH_TOKEN`, `GMAIL_APP_PASSWORD`. (Las `KAPSO_*` ya no aplican: WhatsApp eliminado.)
- `WODBUSTER_PASSWORD` — **no es una clave de API, es la contrasena personal de Mikel**.
  Si la reutiliza en otros sitios, cambiarla tambien alli.

## 3. A quien deben llegar los avisos de altas — ✅ RESUELTO
Ya van a la cuenta del box: **anbotocf@gmail.com** (commit `47d060b`, 2026-08-18).
Las notificaciones por WhatsApp se eliminaron por completo el 2026-08-19 (`017f05c`),
asi que ahora el unico canal de aviso es el email via Resend.

## 4. Cuenta de WodBuster
El sistema entra con el usuario y la contrasena PERSONALES de Mikel, y con una cookie
`.WBAuth` renovada a mano porque un CAPTCHA impide el login automatico. Valorar una cuenta
del box en vez de una personal.

## 5. Cifras falsas en la landing
La banda de cifras muestra **"5+ MIEMBROS ACTIVOS"**, **"1 DISCIPLINAS"** y
**"1+ ANOS DE EXPERIENCIA"**. Son valores de relleno y hacen dano: la propia pagina lista 8
disciplinas y presume de 46 resenas con 4.9 estrellas. Hacen falta los numeros reales.
Se corrigen en `web/src/data/site.js`.

## 6. Tarifas anuales en el prompt del chatbot
Probando el chat, el asistente ofrecio "12 clases por 780 EUR/ano" con compromiso anual.
Pero el 2026-05-12 se decidio quitar el precio anual de la landing. El bot promete algo que
la web ya no ofrece. Decidir: se reponen las tarifas anuales o se quitan del prompt.

## 7. Dominio: anbotosc.com — ✅ RESUELTO (2026-08-18)
**https://anbotosc.com esta en produccion y sirve la landing.** Detalle tecnico completo del
fallo y de la configuracion buena en `project_status.md` y `decisions.md`.
- IONOS: NS propios de IONOS + `A @ 76.76.21.21` + `CNAME www cname.vercel-dns.com`
- Vercel: `anbotosc.com` + `www.anbotosc.com` (308 al apex), certificado emitido a mano
- Los registros de correo de IONOS quedaron intactos
- `anbotosc.com` es el dominio definitivo y esta registrado a vuestro nombre. **Cerrado, no hay
  nada que decidir aqui.** `anbotofitness.com` no existe en el registro `.com` (NXDOMAIN) y NO se
  va a recuperar; el SEO ya apunta a `anbotosc.com` como canonico. La marca "Anboto Fitness" solo
  sobrevive en el slug de Supabase `anboto-fitness` y en el Instagram `@anbotofitness` (ver CLAUDE.md).

## 8. Logo en alta
Sigue pendiente (ya anotado el 2026-08-16): conseguir el SVG o PNG original del isotipo. El
trazado actual esta aproximado a partir del PDF del manual, que esta aplanado.

## 9. Produccion va muy por detras — ✅ RESUELTO (2026-08-19)
Todo lo de `feat/react-vite-migration` esta desplegado y verificado en https://anbotosc.com.
Ojo, la rama **sigue sin mergearse a `main`**: `main` continua en el 2 de junio. Y el deploy
sigue siendo manual (`vercel --prod`); la integracion Git-Vercel esta inactiva desde el 12 de
mayo, asi que hacer push NO despliega.

## 10. Fotos y datos reales del centro nuevo
Pendiente de Xabi (lista completa preparada el 2026-08-18):
- Fotos de los 4 coaches (hoy son medallones con iniciales) y del centro nuevo
- Tarifas definitivas (hoy: 8/12/16 clases a 60/70/80 EUR e Ilimitado 95 EUR, mas bonos)
- Horario del centro nuevo y confirmacion de las 6 disciplinas
- Direccion exacta si cambia: condiciona mapa, coordenadas y datos estructurados

## 11. API oficial de WodBuster — a solicitar por Xabi
WodBuster **si tiene API oficial** (comprobado en su web): **API de Reservas** (reservar desde
una plataforma externa) y **API de Usuarios** (alta de atletas desde tu propia web, que es el
"autorregistro" del video que os pasaron), ademas de API de Datos, de Tornos y RestHook.
**No publican documentacion**: hay que pedir acceso a soporte (+34 911 238 103) y, como el
cliente de WodBuster es el box, **lo tiene que pedir Xabi**.
Merece la pena: quitaria la cookie `.WBAuth` renovada a mano, el bloqueo por CAPTCHA y la
limitacion de ver solo hoy y manana. El cambio seria barato: `src/lib/wodbuster.js` ya expone
una interfaz limpia (`getClassAvailability`, `bookClass`, `validateSession`) que solo consumen
`scheduling.js` y `cron.js` → bastaria un adaptador detras de la misma interfaz.
