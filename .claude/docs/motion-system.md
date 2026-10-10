# Motion system

How motion works on this site, the rules every animation follows, and how to add one without
breaking them. Last updated 2026-10-09.

## The rules

1. **Compositor-only.** Animations and transitions change `transform` and `opacity` and
   nothing else. Those two can run on the GPU compositor without layout or paint, so they hold
   frame rate on the reference phone (Huawei P30 lite). `filter`, `clip-path`, `width`/`height`,
   `box-shadow` and colour tweens all repaint or re-layout every frame.
2. **Reduced motion is honoured twice.** Every effect ships a `@media (prefers-reduced-motion:
   reduce)` block, and a global rule in `src/index.css` zeroes all durations as a backstop. JS
   effects (the film, the reveal stage, the hero) also check `matchMedia` and skip the motion
   entirely; the film then shows one still per section, every cued text is visible and every
   scene reads as a normal section.
3. **Fail open.** Nothing may stay invisible because an observer missed. `AnimatedSection`
   reveals by IntersectionObserver, by a geometry check on mount and by a 2.5 s timer.
4. **Tokens, not literals.** Durations and easings live as CSS custom properties in
   `src/index.css` (the transitions.dev naming: `--enter-*`, `--chars-*`, `--shake-*`, ...). The shared ease is `cubic-bezier(0.22, 1, 0.36, 1)`.
5. **No `will-change` on large things that wait.** The hint pins a GPU layer for as long as it
   is set. It is used on elements that move continuously (the progress bar, the film canvas)
   and on a few tiny one-shot elements, never on
   section-sized blocks waiting below the fold. Transitions are promoted automatically while
   they run.
6. **Scroll-linked layers take no CSS transition.** Anything JS writes from scroll or film
   position every frame must carry no transition (`t-scroll-linked`, or `transition: none`), or it
   trails the scrollbar. The legacy global `* { transition: 200ms }` rule was removed on
   2026-10-07 (it restyled every element on every change); hover effects now declare their own
   `transition-*` class. Check with `getComputedStyle(el).transitionDuration`: it must read `0s`.

## Inventory

| Effect | Where | Animates | Notes |
|---|---|---|---|
| Section entrance | `AnimatedSection.tsx`, `.t-enter` | opacity, transform | `index` prop cascades list items by `--enter-stagger` (70 ms, capped at 4 steps) |
| Hero copy pass | `Hero.tsx` | opacity, transform | fixed on the film's first shot; passes the camera over the first 50vh of scroll; ordinary first screen under reduced motion |
| Reveal stage | `StageDirector.tsx`, `lib/stage.ts` | opacity, transform | sections 02-10 as scenes: one step at a time (or a deck that stacks) on a fixed stage, driven by scroll position; see `stage.md` |
| Heading reveal | `RevealHeading.tsx`, `.t-chars` | opacity, transform | per character; no `will-change` (it held a layer per character) |
| Reading progress | `ScrollProgress.tsx` | transform (`scaleX`) | rAF-throttled; `t-scroll-linked` |
| Film | `FilmStage.tsx`, `lib/filmJourney.ts` | canvas frames (2 blended) + lighting | the front of the site, scrubbed by scroll, eased (70/110 ms), off-thread decode; see `film.md` |
| Film text cues | `[data-beat]`, `.is-beat` | opacity, transform | text lands on a film moment; hidden only while `html[data-film="on"]` |
| Chat typing dots | `ChatWidget.tsx`, `.t-typing` | opacity, transform | announced as "Assistant is typing" |
| Assistant's point of light | `ChatWidget.tsx`, `.t-light-ping` | transform, opacity | a slow ring on the launcher (2.8 s); off under reduced motion |
| Navbar hide and return | `Navigation.tsx` | transform | slides up on scroll down, back on scroll up (6 px of intent); active link dot fades |
| Menu sheet (phones, tablets) | `Navigation.tsx`, `.t-menu-sheet`, `.t-menu-item` | opacity, transform | grows from the Menu pill's corner (280 ms), items rise in 30 ms apart; visibility flips after the fade-out; desktop keeps the row of links |
| Project pipeline pulse | `ProjectDiagram.tsx`, `.t-diagram-pulse` | stroke-dashoffset | runs while its card is the step on screen (staged only), under the boxes so it never crosses a label; off under reduced motion |
| Arrow nudge | `.t-nudge` | transform | |

### Deliberate exceptions

- **Project pipeline pulse** (`ProjectDiagram.tsx`): `stroke-dashoffset` is not compositor-only; it
  repaints the card's diagram (about 300x140 px) each frame, only while that card is the step on
  screen, so one small repaint at a time. A transform cannot move a dash along a path.
- **"Read more"** (every scene): a native `<details>`, which opens instantly (no height tween);
  its body scrolls inside the step.
- **Hover colour changes**: explicit `transition-colors` (or `transition-opacity`) classes ease
  colour and border changes on hover. They are single-element, user-triggered, and not animations
  in the sense above.

## Removed effects (2026-10-06)

The spring-physics card hover (`TiltCard`: stiffness 170, damping 16, ratio 0.61, 4-8%
overshoot, settled under 0.9 s at 30/60/144 fps), the sliding filter underline, the
view-transition project filter and the 3D viewer skeleton went out with the Selected work and
Blog sections. They are in git history (merge `2a92464`) if a future section needs them.
The hero's twinkling stars (`.radiate-star`) and the intro-video modal (`.t-modal`) went out
with the Studio hero on branch `feat/v3`. On 2026-10-07 the film became the full-screen
background, which retired the Studio laptop frame (`StudioScreen`, `FilmScrub`), the WebGL Earth
journey (`HeroEarth`, `HeroBackdrop`, `earthJourney`, three.js) and the particle canvas
(`FutureticParticles`); the Vision band lost its still image and letterbox bars. With the
film-forward redesign the same day: the Skills tech orbit (32 always-running animations and a
canvas), the Principles sticky card stack (`.t-stack-card`), the contact success check (the form
no longer claims a success it cannot know), the hero terminal and the launcher stow, the theme
toggle morph, the nav underline (`.t-navlink`) and the global `*` transition rule.

With the v4 reveal stage (2026-10-09): the Open-source filmstrip (pinned horizontal strip and
phone carousel, `.t-film-*`, `.t-carousel`, option C of 2026-10-06), the live badge ping
(`.t-live`), the Stats number pop-in (`PopNumber`, `.t-digit`), the capability marquee
(`Marquee`), the hero's line stagger (`.t-stagger-line`), the Vision doorway driven by the film
clock, the FAQ accordion, the Skills layer picker and the unused section-numeral drift
(`.t-drift`). Each section is now a scene on the stage (`stage.md`); all of these are in git
history (before `feat/v4-film` phase C).

## Adding an animation

1. Animate only `transform` and `opacity`. If the design needs something else, find the
   transform equivalent first (a sliding cover instead of `clip-path`, `scaleX` instead of
   `width`, opacity instead of `filter: brightness`).
2. Put durations and easings in a `:root` token block next to the effect.
3. Add its `prefers-reduced-motion` block, and a `matchMedia` check if JS drives it.
4. No `will-change` unless the element moves continuously.
5. If JS writes it from scroll position, opt it out of the global transition (rule 6).
6. Verify in a real browser, not only with tsc. On this laptop a local `vite build` can OOM
   while other sessions run; the Vercel preview build of the pushed branch is the fallback,
   and headless Playwright (`scratchpad/v4/all_check.cjs`) covers motion that a hidden
   Browser pane cannot run.
7. Add the effect to the inventory above.
