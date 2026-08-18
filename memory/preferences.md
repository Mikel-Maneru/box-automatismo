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