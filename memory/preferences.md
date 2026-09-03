# Preferences & Practices

## Coding Standards
- **Frontend**: React+Vite for landing, vanilla JS for widget (no framework)
- **Backend**: Express.js (Node.js)
- **Database**: Supabase (PostgreSQL) with lazy loading where possible
- **Styling**: CSS vanilla (brand palette in global.css), no Tailwind
- **Comments**: Minimal (only non-obvious logic); focus on clear variable names

## Project Structure Constraints
- Never add `build` script to root package.json (Vercel breaks)
- Vite build command must be `web:build` (not `build`)
- `.env` gitignored, use `.env.example` + fill manually
- Compiled output in `public/` is COMMITTED (Vercel serves it directly)
- `src/routes/*` is production code; `api/*.js` is legacy (not used)

## Communication & Feedback
- Prefers Spanish language
- Wants proof before claiming completion (screenshots, browser demo, or test output)
- Appreciates terse summaries, not detailed explanations of what code does
- Dismisses lengthy context recaps — gets to work quickly

## Workflow
- Uses `feat/` branches for features
- Commits to `feat/` branches, merges to `main` for production
- Manual deployment with `vercel --prod` (Git↔Vercel auto-sync disabled since 2026-05-12)
- Tests locally with `npm run dev` before deploying

## Key Constraints to Remember
- **Credentials**: Exposed credentials must be rotated IMMEDIATELY (Supabase, Vercel, API keys)
- **Brand names**: "Anboto SC" is official name; "Anboto Fitness" kept in domain/slug for backwards compat
- **Architecture**: Widget is token-based (data-token attribute); backend validates against `boxes` table in Supabase
- **DNS**: Changes can take 24-48h to propagate; patience required
## Cumplimiento legal en webs que recogen datos (desde 2026-09-02)

Mikel pidio expresamente que esto se tenga en cuenta **en futuros proyectos**, no solo en
Anboto. La checklist completa vive en `CLAUDE.md` (seccion "Cumplimiento legal"), porque ahi
se lee al empezar cada sesion. Resumen de lo que no se puede olvidar:

- Aviso legal, politica de privacidad y politica de cookies **desde el primer dia**.
- Consentimiento en **todos** los puntos de recogida — en Anboto eran dos y el chat se paso
  por alto en la primera pasada — sin marcar de fabrica y **validado en servidor**.
- Guardar la prueba del consentimiento: fecha del servidor + version del texto.
- **Evitar terceros** (tipografias autoalojadas, nada de mapas incrustados) en vez de montar
  un banner de cookies: menos trabajo, mejor experiencia y mas rapido.
- Nunca `console.log(req.body)` donde haya datos personales.
- RLS activo desde el principio aunque solo entre el backend.

**Como se comprueba, que es lo que de verdad convence:** cargar la web y mirar las peticiones
de red. Si no sale ni una a un tercero y no hay cookies, no hace falta banner y se puede
demostrar.
