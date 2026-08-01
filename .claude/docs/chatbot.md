# Portfolio assistant ("Ask about me") — 2026-08-01

## What it is
A floating chat on the site answering visitor questions about Murci, grounded EXCLUSIVELY in
his verified facts. It exists to position him well for employers — and to itself be proof he
ships LLM systems.

## Architecture & data flow
```
ChatWidget.tsx ── POST {messages} ──> /api/chat (Vercel Edge Function)
                                          │  prepends SYSTEM_PROMPT (api/_corpus.ts)
                                          ▼
                             Groq chat completions (OpenAI-compatible)
                             model: llama-3.3-70b-versatile, stream: true
                                          │
ChatWidget <── SSE passthrough (text/event-stream, OpenAI delta frames) ──┘
```
- **No RAG / vector DB by design**: the whole verified corpus is a few KB and fits in the
  system prompt. Zero retrieval infrastructure, zero retrieval failures. Right-sized.
- The client parses `data:` SSE lines itself (fetch + TextDecoder) — no SDK dependency.

## API contract (`POST /api/chat`)
Request: `{ "messages": [{ "role": "user"|"assistant", "content": string }] }`
— last 12 messages max, each ≤600 chars.
Responses: `200` SSE stream · `400 invalid_json|invalid_messages` · `405` · `429 rate_limited`
· `502 upstream_error` · `503 chat_not_configured` (key missing).

## Security & spend posture
- **Key**: `GROQ_API_KEY` — set by Murci in Vercel → Project → Settings → Environment
  Variables (never in the repo, never in chat, per standing secret-hygiene rule). Absent key
  → clean 503, widget shows the email fallback.
- Input validation: role whitelist, length caps, message-count cap. `max_tokens: 400`.
- Rate limiting: best-effort per-IP token bucket (10 req / 5 min) — **per edge isolate**, so
  it's a soft brake; hard protection = request caps + Groq account limits (free tier).
- Prompt-injection posture: the system prompt instructs facts-only + refuse-off-topic; the
  corpus contains nothing sensitive, so the worst leak is public CV data.
- Honesty guardrails in the prompt: unknown → "email him"; no invented praise/metrics.

## Updating the facts
Edit `api/_corpus.ts` (single source). Keep it in sync with
[content-truth-map.md](content-truth-map.md) — same truth, condensed.

## Local dev
No `/api` under `vite dev` → the widget catches the failed fetch and shows an honest
"assistant comes online with deployment" note with the email. Full end-to-end testing happens
on a Vercel preview deployment (`vercel dev` would also work if ever needed).

## Activation checklist (at deploy)
1. Murci creates a Groq API key (console.groq.com) and sets `GROQ_API_KEY` in Vercel envs.
2. Deploy; ask the three starter questions + one out-of-corpus question (expect the honest
   "I don't know — email" behaviour) + one off-topic question (expect a polite steer-back).
3. `vercel.json` rewrite excludes `/api/` — SPA deep links and the function coexist.
