# Memory Index — Anboto Project

**READ THIS FIRST** al comenzar cada sesión en este proyecto. Actualizado: **2026-08-19**.

---

## 📋 Quick Status (2026-08-19)

| Item | Status | Notes |
|------|--------|-------|
| **Rama activa** | `feat/react-vite-migration` | Aún NO mergeada a `main` |
| **Dominio** | ✅ **https://anbotosc.com EN PRODUCCIÓN** | `A 76.76.21.21` en IONOS + cert TLS. `www` redirige 308 |
| **Fase 1** | ✅ COMPLETA | Dominio, widget con marca, favicon según tema |
| **Fase 2** | ✅ COMPLETA Y DESPLEGADA | Clases por objetivo, formulario guiado, `/reservar` en React. Verificado en vivo |
| **Email propio** | ✅ `send.anbotosc.com` **Verified** en Resend | Listo para enviar. Falta `MAIL_FROM` en Vercel |
| **WhatsApp** | ❌ Eliminado (`017f05c`) | ⚠️ **En git pero SIN desplegar** |
| **Limpieza** | ⏳ Decidida, sin ejecutar | Borrar `api/` (código muerto) y el dominio `send.anboto.sc` en Resend |
| **Próxima acción** | Un solo `vercel --prod` que saque la eliminación de WhatsApp + `MAIL_FROM`, y luego alta de prueba |

### ⚠️ Dos trampas que ya nos costaron horas — no repetir

1. **Nameservers de Vercel sin zona.** Poner `ns*.vercel-dns-*.com` en el registrador NO funciona
   si Vercel no gestiona el DNS: responden REFUSED → SERVFAIL global y no se arregla esperando.
   Señal: SERVFAIL (no NXDOMAIN) + "Intended Nameservers" vacío. Solución: registros A/CNAME.
2. **Nombre de dominio mal partido.** En Resend se creó `send.anboto.sc` en vez de
   `send.anbotosc.com`. Leer el nombre carácter a carácter antes de tocar el DNS.

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
- `web/src/data/site.js` — Schedule, disciplines, coaches, plans (DATA POINT for phase 2)
- `web/src/components/Signup.jsx` — Current signup form (NEEDS: howKnew + objective fields)
- `web/src/i18n/dict.js` — ES/EU translations
- `web/src/styles/global.css` — Brand color palette (Anboto official colors)

### Backend (Express, in `src/`)
- `src/routes/chat.js` — POST /api/chat (Claude API, token validation)
- `src/routes/scheduling.js` — GET /api/classes (WodBuster integration)
- `src/routes/signup.js` — POST /api/signup (Supabase insert)
- `src/lib/wodbuster.js` — WodBuster client (598 lines, getClassAvailability + bookClass)
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

## 🚀 Phase 2 Planning (BLOCKED 🔵)

### Requirements
1. Reorganize 6 classes by user objectives (health, performance, muscle, fat loss, beginner)
2. Improve signup form: add "How did you hear?" + "What's your objective?"
3. Dynamic class recommendations based on user objective
4. New UI for free trial class booking
5. Use WodBuster API for real availability (not hardcoded)
6. Chat widget: move from personal token (Mikel) to client token

### Code Exploration ✅ (COMPLETE)
- **WodBuster**: Already integrated in `src/lib/wodbuster.js` (getClassAvailability, bookClass, etc)
- **Landing data**: Structure in `web/src/data/site.js` (6 disciplines, SCHED, PLANS)
- **Widget architecture**: Token-based, validated against Supabase `boxes` table

### 4 Questions Blocking Phase 2 ❓
**See full details in**: `C:\Users\Mikel\.claude\plans\reactive-wishing-wozniak.md`

1. **Class-to-objective mapping**: Which classes → which objectives?
2. **Chat token**: New box in Supabase vs change existing token?
3. **Free class app location**: Landing component vs /reservar page vs modal?
4. **Form fields**: Which new fields (howKnew dropdown, objective radio, wantsFreeClass checkbox)?

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
- **Registrador**: IONOS — cuenta **anbotocf@gmail.com** (¡no la personal de Mikel!)
- **Email**: Resend, cuenta `anbotocf`. Dominio de envío `send.anbotosc.com` (eu-west-1) ✅
  - La `RESEND_API_KEY` del `.env` es **solo de envío**: no sirve para leer dominios por API
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
