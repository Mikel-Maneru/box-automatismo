# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Memory System — READ AT SESSION START

At the beginning of every session, read all memory files to restore context:
1. `memory/user.md` — User profile, role, working style
2. `memory/decisions.md` — Architecture and design decisions log
3. `memory/people.md` — People, stakeholders, contacts
4. `memory/preferences.md` — Coding style, communication, workflow preferences

These files are the persistent memory of this project. Read them before doing anything else.

## Memory System — UPDATE AT SESSION END

Before ending a session (or when learning something worth remembering), update the relevant memory file:
- New decision made? → `memory/decisions.md`
- Learned about a person? → `memory/people.md`
- Discovered a preference? → `memory/preferences.md`
- Updated user context? → `memory/user.md`

Write concise, structured entries. Do NOT duplicate info already in CLAUDE.md.

## Commands

- `npm run dev` — Start dev server with nodemon (auto-restart on changes)
- `npm start` — Start production server
- Server runs on PORT from .env (currently 3003)

## Architecture

Embeddable AI chat widget for CrossFit boxes. Box owners paste a `<script>` tag into their website; the widget opens a floating chat that calls the backend, which loads box context from Supabase, builds a system prompt, and calls Claude.

**Request flow:** Widget → POST /api/chat → load box from Supabase → buildSystemPrompt → Claude API → detect SIGNUP_DATA → return reply to widget

**Signup flow (dual entry):**
1. **Chat:** Agent collects nombre/telefono/email/nivel conversationally, appends `SIGNUP_DATA:{json}` → chat.js strips it, calls createSignup
2. **Form:** Landing page form → POST /api/signup → createSignup → Supabase insert + Gmail notification

## Key technical constraints

- `dotenv` MUST use `{ override: true }` — system has ANTHROPIC_BASE_URL/AUTH_TOKEN from Ollama proxy that would shadow .env values
- Anthropic client MUST set `baseURL: 'https://api.anthropic.com'` explicitly
- Model: `claude-sonnet-4-5-20250929` (other sonnet model IDs don't exist on this account)
- Gmail uses App Password, not regular password
- Signups table must exist in Supabase (created via schema.sql, not REST API)

## Key files

- `src/index.js` — Express server, dotenv override, static serving, routes
- `src/routes/chat.js` — POST /api/chat, SIGNUP_DATA detection, 20 msg limit, 10 msg history
- `src/routes/signup.js` — POST /api/signup
- `src/lib/prompt.js` — buildSystemPrompt with CrossFit persona + signup collection logic
- `src/lib/email.js` — createSignup() + Nodemailer Gmail transport
- `src/lib/supabase.js` — Supabase client singleton
- `public/widget/widget.js` — Embeddable vanilla JS chat widget (sessionStorage, floating button)
- `public/anboto.html` — Anboto Crossfit landing page (serves as their real website)
- `schema.sql` — Supabase DDL + Anboto seed data

## Pending infrastructure

- signups table SQL needs to be executed in Supabase SQL Editor (can't create tables via REST)
- Membership plans and classes data for Anboto are empty in schema (not yet provided by user)