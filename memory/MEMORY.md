# Memory Index — Anboto Project

**READ THIS FIRST** al comenzar cada sesión en este proyecto. Actualizado: 2026-08-18.

---

## 📋 Quick Status (2026-08-18)

| Item | Status | Notes |
|------|--------|-------|
| **Active branch** | `feat/react-vite-migration` | React+Vite landing, deployed to Vercel preview |
| **Phase 1** | ✅ COMPLETE | Domain LIVE, widget redesigned, favicon theme-aware |
| **Phase 2** | 🔵 BLOCKED | Awaiting answers to 4 clarification questions |
| **Dominio** | ✅ **https://anbotosc.com EN PRODUCCIÓN** | A 76.76.21.21 en IONOS + cert emitido. El fallo NO era propagación — ver `project_status.md` |
| **Next action** | Responder las 4 preguntas de phase 2 |

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
vercel --prod           # Deploy to production (when DNS resolves)
nslookup anbotosc.com   # Check if domain resolved yet
```

---

## 🔗 External Links & Accounts

- **Vercel Project**: box-automatismo (team_Ui7yFZ02hiIaqHBTalIHAOQP)
- **Supabase**: tgbpgxakctedvlyepppu.supabase.co
- **WodBuster**: anboto.wodbuster.com (manual login, Mikel's credentials)
- **Domain registrar**: IONOS (manerugilmikel@gmail.com)
- **Email service**: Resend (RESEND_API_KEY)
- **WhatsApp API**: Kapso (KAPSO_*)

---

## 🎓 This Session's Key Insight

**Phase 1 is done, Phase 2 is blocked on user decisions.** The code exploration shows everything already exists (WodBuster API integrated, landing structure clear, widget architecture understood). Once you answer the 4 clarification questions, implementation is straightforward file modifications.

Don't proceed with code until Phase 2 questions are answered.
