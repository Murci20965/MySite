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

**Diagnosing a 502.** The body carries `upstream_status` and `upstream_code` from Groq (the same
pair is logged server-side as `chat: groq rejected`). 401 = the key is invalid or revoked: make a
new key at console.groq.com and replace `GROQ_API_KEY` in Vercel (Production and Preview), then
redeploy. 404/400 with a model code = the model id changed. 429 = Groq account limits (free tier:
30 req/min, 12K tokens/min, 1K req/day, 100K tokens/day). 0 = Groq unreachable. A POST with a
non-JSON body is a free check that the key is set at all (400 means set, 503 means missing).
History: 2026-10-06 the live chat returned 502 in 0.42 s with the key set; this logging was
added to name the cause.

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
