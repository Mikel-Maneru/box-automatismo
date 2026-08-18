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
- `ANTHROPIC_API_KEY` (se resuelve solo con el punto 1), `RESEND_API_KEY`, `KAPSO_API_KEY`,
  `TWILIO_AUTH_TOKEN`, `GMAIL_APP_PASSWORD`.
- `WODBUSTER_PASSWORD` — **no es una clave de API, es la contrasena personal de Mikel**.
  Si la reutiliza en otros sitios, cambiarla tambien alli.

## 3. A quien deben llegar los avisos de altas
Ahora mismo van a Mikel: `NOTIFY_EMAIL` = manerugilmikel@gmail.com y
`KAPSO_WHATSAPP_TO` = +34 688 816 982. Decidir si pasan a Xabi o a una cuenta del box.
Es el cambio mas barato de todos: dos variables.

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

## 7. Dominio: anbotosc.com en Vercel (⏳ 2026-08-18, DNS en propagación)
**ESTADO**: Nameservers configurados el 2026-08-18. Propagación DNS en progreso (24-48h).
- Proyecto Vercel: box-automatismo
- Nameservers: ns1/2/3/4.vercel-dns-3.com (configurados en IONOS)
- BASE_URL: Ya cambiado a https://anbotosc.com en .env
- **PENDIENTE**: Cuando anbotosc.com resuelva (verifica en navegador), ejecuta:
  ```bash
  bash deploy-anbotosc.sh
  ```
  O manualmente: `cd /path/to/anboto && vercel --prod`
- HTTPS se generará automáticamente tras propagación y deploy.

## 8. Logo en alta
Sigue pendiente (ya anotado el 2026-08-16): conseguir el SVG o PNG original del isotipo. El
trazado actual esta aproximado a partir del PDF del manual, que esta aplanado.

## 9. Produccion va muy por detras
`main` esta en el 2 de junio; toda la migracion a React + el rediseno viven en
`feat/react-vite-migration` y NO estan en produccion. Recordar que el deploy es manual
(`vercel --prod`): la integracion Git-Vercel esta inactiva desde el 12 de mayo, asi que
hacer push no despliega nada.
