# Decisions Log

## Architecture
- Widget is vanilla JS (no framework) — embeddable via `<script>` tag
- Backend uses Express + Supabase + Claude API
- Model: `claude-sonnet-4-5-20250929` (only model ID available on account)
- dotenv MUST use `{ override: true }` due to Ollama proxy env vars
- Anthropic client MUST set explicit `baseURL: 'https://api.anthropic.com'`

## Design Choices
<!-- Log important decisions here with rationale -->
<!-- Format: ### [Date] Decision — Why -->