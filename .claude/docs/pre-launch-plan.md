# Pre-launch refinement plan — 2026-08-02

Murci's final pass before publishing. Twelve requested changes, plus the recommendations that
make each one land harder. Design system unchanged: black, Fraunces / Hanken Grotesk / Space
Mono, one lime accent, hairlines. **No Nexera/GDD specifics ever appear on this site.**

---

## A. The spine: one continuous Earth, and a scroll system

### A1. The Earth carries the whole page (requested)
Today the journey ends after About. It becomes a **persistent ambient layer driven by global
scroll progress**, with named stations — present where it adds meaning, absent where content
needs focus:

| Section | Earth state |
|---|---|
| Hero | Large (bigger than now), right, slow idle spin |
| About | Shrinks, rotates to face Africa, lime dot lands on Johannesburg |
| Experience | Slides to the far edge — a thin lit limb, barely there |
| Projects · Stats | **Absent** (dense content, cards breathe) |
| Vision | **Returns as the real horizon behind the expanding media** — the artwork and the planet become one shot |
| Skills | Absent (the tech orbit is that section's 3D moment) |
| Blog · OpenSource · Education | Absent |
| Principles | A faint distant sphere, top-right |
| FAQ | Absent |
| Contact | Returns large and low behind the form — "from here, for anywhere" |

Implementation: extend `src/lib/earthJourney.ts` from a single `p` to a **station timeline**
(array of `{ atSectionId, pose, opacity }`), interpolated by one rAF reader in `HeroEarth`.
One WebGL context, one scroll listener, damped transitions. Sections declare their station by
id, so reordering the page can't desync it.

### A2. Section entrance system — "behave like Vision" (requested)
Three reusable behaviours, applied deliberately (not everywhere — that's how scrollytelling
sites become exhausting):

1. **Pinned scene** — sticky, full-bleed, scroll-scrubbed. Vision + Skills orbit only.
2. **Full-bleed reveal** — content wipes in under a `clip-path` with a 2% scale settle. Replaces
   today's weak opacity fade on every section header.
3. **Sticky rail** — heading pins left while content scrolls right. FAQ has it; extend to
   Experience, Education, Principles.

**Hard rule: at most two pinned scenes on the page.** More and the visitor feels trapped —
the single most common failure of ambitious scroll sites.

---

## B. Section-by-section work

| # | Change | Approach |
|---|---|---|
| B1 | **Hero: sleeker, tighter** (requested: text too big, runs too far down) | h1 down from `xl:text-8xl` to `lg:text-6xl xl:text-7xl`; stagger gaps `mb-8/10` → `mb-5/6`; bio clamped to 2 lines on desktop; CTAs pulled up beside the text instead of a separate centred row; hero becomes a true two-column (text 55% left, Earth right) vertically centred in the viewport |
| B2 | **Bigger Earth on hero** (requested) | `PHASE_HERO.s` 0.62 → ~0.85 with `nx` pushed right so it reads as a large planetary presence, not a wall behind the text |
| B3 | **Remove every em-dash** (requested) | 73 occurrences / 24 files. **Not a find-replace** — each user-facing sentence gets rewritten (comma, colon, parentheses, or a full stop) so the prose still reads well. Code comments handled separately in the same pass |
| B4 | **Replace "How a project runs"** (requested: duplicates Principles) | → **"What I can build"**: four capability cards (Agentic AI systems · RAG & knowledge systems · XR & 3D pipelines · MLOps delivery), each with a one-line outcome and a link to the project that proves it. Principles = *how I work*; Capabilities = *what you get*. No overlap |
| B5 | **Principles: wider cards with life** (requested) | Sticky-rail layout: heading pins left, cards stack right at ~2× width; `min-h` cut so they stop looking empty; lime index numeral, hairline that lights on the active card, deeper stack offset |
| B6 | **Projects: kill the floating chip, align everything** (requested; Murci chose to keep the viewer) | The floating "VIEW IN 3D" chip is removed. The action becomes a third text link beside "Code" and "Live demo", on the same baseline as every other card, so the interactive viewer survives without breaking the grid. Cards become equal-height flex columns: fixed diagram ratio → title → clamped 3-line description → metric row on its own baseline → tech pills → links pinned to the bottom with `mt-auto`. Every row lines up across all six cards |
| B7 | **Stats: replace "Contributions"** (requested, GitHub-verified) | → **"14 projects shipped · past 2 years"** (16 repos created since Aug 2024, minus the profile README and one empty repo). Honest and checkable |
| B8 | **Vision: full-bleed, different behaviour** (requested) | Media goes edge-to-edge (`100vw`, no container, no radius at full open). Behaviour changes from "card scales up" to a **letterbox that opens vertically** while the title splits outward and the copy rises — a cinematic reveal rather than a zoom |
| B9 | **Bigger tech orbit** (requested) | Height `22rem/30rem` → `34rem/44rem`, full-bleed width, denser particle core, and the bottom crop made intentional (icons no longer sliced in half) |
| B10 | **Remove OpenSource stats** (requested) | The 4-stat block goes; the new stat band already owns those numbers |
| B11 | **Remove Skills certifications** (requested) | Duplicated by Education's carousel. Section drops to categories + the orbit |

---

## C. Recommendations (my additions, for approval)

1. **Delete the `......` repo on GitHub.** A public repo literally named "......" sits on the
   profile this site links to. Recruiters click through. 30 seconds to remove.
2. **Performance budget before publishing.** The page is heavy enough that screenshots timed
   out during the audit. Target: one WebGL context, ≤3 rAF loops, no layout-reading scroll
   handlers, LCP under 2.5s on a mid-range phone. Measure, then cut.
3. **Self-host the two fonts.** Google Fonts is currently a render-blocking third party; it
   stalled repeatedly during testing. Self-hosting removes a network dependency and a privacy
   footnote.
4. **A real favicon + OG check** before launch (og:image must become an absolute URL on the
   live domain, or link previews break).
5. **Reduced-motion pass** once the new scroll system lands — every new behaviour needs its
   static fallback, same as the existing ones.

---

## D. Order of work

1. Em-dash rewrite (B3) — pure copy, safest first, touches everything
2. Hero (B1, B2) — the first impression
3. Projects alignment + 3D removal (B6), Stats (B7), removals (B10, B11)
4. Capabilities replaces process strip (B4); Principles rail (B5)
5. Vision full-bleed (B8); orbit size (B9)
6. The Earth station timeline (A1) and entrance system (A2) — last, because it depends on final
   section order and heights
7. Performance measurement + reduced-motion pass, then publish

Each step: build → Playwright screenshot → typecheck → atomic commit → push.

## E. Verification

Playwright at 1440×900 and 390×844 (mobile), screenshotting every section after each step.
`npx tsc -b` with the dev server stopped (it OOMs otherwise on this machine).
