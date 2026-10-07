# Nhlanhla "Murci" Mokoena · portfolio

**Live:** https://my-site-six-rose.vercel.app

The portfolio of an AI engineer (agentic AI, RAG, MLOps) building XR learning that anyone can reach.
The site is told as one film, "Prompt to People": a single camera journey from a night desk, into a
laptop screen, through an agent network, glass cubes that ship, a data centre and an XR classroom,
out to the globe. The film is the background of the whole page and plays as you scroll; each
section's text sits in the film's dark, quiet zones and lands on its moments.

## Stack

- **Vite + React 18 + TypeScript + Tailwind 3**, a static single page.
- **The film:** six AI-generated clips (OpenArt), encoded as WebP frame sequences and drawn on one
  full-screen `<canvas>`, scrubbed by scroll. Frames are decoded off the main thread
  (`createImageBitmap`), only a window around the playhead stays decoded, and the drawn time eases
  toward the scroll position so wheel scrolling glides.
- **The assistant ("Ask Murci"):** a Vercel function (`api/chat.ts`) streaming answers from Groq,
  grounded only in a verified fact corpus (`api/_corpus.ts`), rate-limited, with an honest offline
  fallback.
- **Hosting:** Vercel. Static assets and fonts are cached as immutable; the page sends a strict
  Content-Security-Policy and standard security headers (`vercel.json`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (the assistant needs `vercel dev` and a GROQ_API_KEY)
npm run typecheck
npm run lint
npm run build      # production build in dist/
```

Film frames are committed under `public/film/`. To re-encode a clip from its master (kept outside
the repo), see `scripts/encode-film.sh`.

## How it is built (docs)

| Doc | What it covers |
|---|---|
| [`.claude/docs/film.md`](.claude/docs/film.md) | The film: pipeline, timeline knots, lighting, text cues, budgets, runbook |
| [`.claude/docs/motion-system.md`](.claude/docs/motion-system.md) | Motion rules and the inventory of every animation |
| [`.claude/docs/chatbot.md`](.claude/docs/chatbot.md) | The assistant: data flow, API contract, triage |
| [`.claude/docs/content-truth-map.md`](.claude/docs/content-truth-map.md) | Where every claim on the site comes from |

## Principles this site follows

- **Measured, not guessed:** text contrast is checked against the real film pixels under it
  (0 WCAG AA failures at desktop and phone sizes); scroll smoothness and load are measured on the
  production build.
- **Honest content:** every number and credential traces to the CV or the public repos.
- **Accessible:** reduced motion and Save-Data get still frames and all text visible; a skip link,
  labelled controls, live regions for the assistant and focus that returns where it came from.

## Contact

nhlanhla18mokoena@gmail.com · [LinkedIn](https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/) ·
[GitHub](https://github.com/Murci20965)
