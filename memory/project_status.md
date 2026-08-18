# Project Status — Anboto SC (2026-08-18)

## Current Active Branch
- **Branch**: `feat/react-vite-migration`
- **Status**: Deployed to Vercel preview + ready for production (`vercel --prod`)
- **Last commit**: "chore: Prepara deploy automatizado de anbotosc.com cuando DNS se propague"

## Phase 1 — Completed ✅ (2026-08-18)

### 1.1 Domain Setup: anbotosc.com
- **Nameservers**: Configured in IONOS → ns1/2/3/4.vercel-dns-3.com
- **Vercel**: Domain verified and connected to project `box-automatismo`
- **DNS Status**: PROPAGATING (24-48h typical, some regions resolving, others not yet)
- **BASE_URL**: Updated to `https://anbotosc.com` in `.env`
- **Deployment Script**: Created `deploy-anbotosc.sh` (waits for DNS + runs `vercel --prod`)

### 1.2 Chat Widget Redesign
- **File**: `public/widget/widget.js`
- **Change**: Icon from generic chat bubble to custom "pico bubble" (Anboto brand icon)
- **Design**: 
  - SVG inline with mountain pico + chat bubble silhouette
  - Button: madera #A7693B background
  - Hover: cuero #703D26
  - Panel: caliza #F4EDE2 background
  - Full palette applied: pizarra, granito, bruma, caliza, madera, cuero
- **Status**: ✅ Deployed to preview, working correctly

### 1.3 Favicon Theme-Aware
- **Files**: `web/index.html` and `public/reservar.html`
- **Implementation**:
  - SVG data URI with CSS `prefers-color-scheme` media query
  - Light theme: pico in black (#141311)
  - Dark theme: pico in caliza (#F4EDE2)
  - JavaScript matchMedia fallback for Chrome/Safari (media queries in SVG don't re-evaluate)
- **Status**: ✅ Working in Firefox, Chrome, Safari

### 1.4 Security: Rotated Exposed Credentials
- **Vercel Token**: Old token rotated (was exposed in chat, rotated immediately)
- **Still in .env (local only)**: SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY, RESEND_API_KEY, KAPSO_*, WODBUSTER_PASSWORD
  - ⚠️ These are secrets and should never be in memory files. Keep in `.env` only (gitignored)
  - Rotate if any are exposed

## Phase 2 — Planning Stage 🔵 (BLOCKED ON USER INPUT)

### 2.1 Requirements Summary
1. **Reorganize classes by user objectives** (health, performance, muscle gain, fat loss, beginner)
2. **Improve signup form**: Add "How did you hear about us?" + "What's your objective?" fields
3. **Dynamic class recommendations**: Show suggested classes based on user's objective
4. **Free trial class booking**: New UI component/page for selecting and reserving free class
5. **Use WodBuster API for real availability**: Replace hardcoded schedule with dynamic API calls
6. **Change chat widget token**: Move from personal account (Mikel) to client account token

### 2.2 Code Exploration Completed ✅
- **WodBuster integration**: Already exists in `src/lib/wodbuster.js` (598 lines)
  - Functions: `getClassAvailability(date)`, `bookClass(classId, date)`, `validateSession()`, `loginToWodBuster()`
  - Returns: id, name, time, available, capacity, booked, spots
  - Endpoint: `GET /api/classes?date=YYYY-MM-DD`
  
- **Landing page structure**: `web/src/data/site.js`
  - Current 6 classes/disciplines: WOD, Oinarriak, Halterofilia, Hyrox, Endurance, Total Strength
  - Data: SCHED (schedule by day), DISCIPLINES, PLANS (4 membership tiers)
  - Components: `Horarios.jsx` (schedule picker), `Signup.jsx` (form), `Sections.jsx` (render)
  
- **Chat widget architecture**: `public/widget/widget.js` + backend in `src/routes/chat.js`
  - Token-based: `data-token` attribute on script tag
  - Validation: Backend checks token against Supabase `boxes` table
  - System prompt: Built dynamically from box data
  - Current token: `'anboto-token-2024'` (hardcoded in schema.sql seed)

### 2.3 4 Clarification Questions (PENDING USER ANSWERS)
1. **Class-to-Objective Mapping**: How to map 6 current classes to 4-5 objectives?
   - Example: WOD + Hyrox → Performance? Health → Oinarriak + Endurance?
   
2. **Chat Token Strategy**: 
   - Option A: Create new box in Supabase with unique widget_token for client
   - Option B: Change existing token (affects current setup)
   
3. **Free Class App Location**:
   - Option A: New React component section in landing
   - Option B: Separate `/reservar` page (like current hand-written version)
   - Option C: Modal overlay from signup form
   
4. **Form Fields to Add**:
   - Definitely: "¿Cómo te enteraste?" (dropdown: redes, amigo, búsqueda, etc.)
   - Definitely: "¿Cuál es tu objetivo?" (radio buttons)
   - Maybe: "¿Quieres reservar clase gratuita?" (checkbox)

### 2.4 Plan Document
- **Location**: `C:\Users\Mikel\.claude\plans\reactive-wishing-wozniak.md`
- **Contains**: Exploration findings + proposed architecture + 4 clarification questions
- **Status**: Awaiting user answers to proceed with detailed implementation

## Key Files Reference
- **Frontend Landing**: `web/src/` (React+Vite)
  - `index.html` — SEO head + JSON-LD
  - `src/components/` — One component per section
  - `src/data/site.js` — Schedule, disciplines, coaches, plans
  - `src/i18n/dict.js` — ES/EU translations
  - `src/styles/global.css` — Brand palette (Anboto colors)
  
- **Backend**: `src/` (Express)
  - `index.js` — Server entry point
  - `routes/chat.js` — POST /api/chat (Claude API)
  - `routes/signup.js` — POST /api/signup (Supabase insert)
  - `routes/scheduling.js` — GET /api/classes (WodBuster)
  - `routes/cron.js` — GET /api/cron/followup
  - `lib/wodbuster.js` — WodBuster client (598 lines)
  - `lib/supabase.js` — Lazy Supabase client (Proxy)
  - `lib/email.js` — Resend + signup logic
  - `lib/whatsapp.js` — Kapso WhatsApp client
  
- **Widget**: `public/widget/widget.js` (vanilla JS, no deps)
  
- **Database**: `schema.sql` (Supabase DDL + seed data)
  - Tables: `boxes` (widget_token, box_data), `conversations`, `messages`, `signups`

## Environment Setup
- **Node**: >= 20 required
- **`.env` file**: NOT in repo (gitignored)
- **`.env.example`**: Template with all required variables
- **Dev server**: `npm run dev` (Express :3003 + Vite :5173, Vite proxies /api to :3003)
- **Build**: `npm run web:build` (Vite → public/, **NOT** `npm run build`)
- **Production serve**: `npm start` (Express from public/)

## Pending Tasks
1. ⏳ **Wait for DNS**: anbotosc.com propagation (24-48h from 2026-08-18)
   - Check periodically with `nslookup anbotosc.com`
   - Once resolved: run `deploy-anbotosc.sh` for production deploy
   
2. 🔵 **Answer Phase 2 Questions**: Respond to 4 clarification questions to unblock implementation
   - Answers should go in plan file or communicated to Claude
   
3. 📝 **Phase 2 Implementation** (once questions answered):
   - Modify `web/src/data/site.js`: Add OBJECTIVES mapping
   - Modify `web/src/components/Signup.jsx`: Add fields (howKnew, objective)
   - Create `web/src/components/ClassSelector.jsx`: Filter + recommend
   - Possibly modify Supabase schema for new fields
   - Change chat widget token in Supabase `boxes` table

## Important Notes
- **Production Deploy**: Manual via `vercel --prod` (auto Git↔Vercel disabled since 2026-05-12)
- **Brand Changes**: Always use "Anboto SC" in UI; keep domains/internal slug as "anboto-fitness" for backwards compat
- **Credentials in .env**: Real secrets are in local .env (not in repo). Exposed secrets must be rotated IMMEDIATELY.
- **WodBuster**: Manual cookie-based auth with CAPTCHA blocker (fully automated login not possible)
