# Motion system

How motion works on this site, the rules every animation follows, and how to add one without
breaking them. Last updated 2026-10-06.

## The rules

1. **Compositor-only.** Animations and transitions change `transform` and `opacity` and
   nothing else. Those two can run on the GPU compositor without layout or paint, so they hold
   frame rate on the reference phone (Huawei P30 lite). `filter`, `clip-path`, `width`/`height`,
   `box-shadow` and colour tweens all repaint or re-layout every frame.
2. **Reduced motion is honoured twice.** Every effect ships a `@media (prefers-reduced-motion:
   reduce)` block, and a global rule in `src/index.css` zeroes all durations as a backstop. JS
   effects (spring hover, view transition, scroll-linked Vision band, number pop-in) also check
   `matchMedia` and skip the motion entirely.
3. **Fail open.** Nothing may stay invisible because an observer missed. `AnimatedSection`
   reveals by IntersectionObserver, by a geometry check on mount and by a 2.5 s timer.
4. **Tokens, not literals.** Durations and easings live as CSS custom properties in
   `src/index.css` (the transitions.dev naming: `--enter-*`, `--stagger-*`, `--tilt-*`,
   `--skel-*`, ...). The shared ease is `cubic-bezier(0.22, 1, 0.36, 1)`.
5. **No `will-change` on large things that wait.** The hint pins a GPU layer for as long as it
   is set. It is used on elements that move continuously (marquee, orbit, tilt card, progress
   bar) and on a few tiny one-shot elements (hero lines, digits, the success check), never on
   section-sized blocks waiting below the fold. Transitions are promoted automatically while
   they run.

## Inventory

| Effect | Where | Animates | Notes |
|---|---|---|---|
| Section entrance | `AnimatedSection.tsx`, `.t-enter` | opacity, transform | `index` prop cascades list items by `--enter-stagger` (70 ms, capped at 4 steps) |
| Hero text reveal | `Hero.tsx`, `.t-stagger-line` | opacity, transform | runs once on mount |
| Heading reveal | `RevealHeading.tsx`, `.t-chars` | opacity, transform | per character; no `will-change` (it held a layer per character) |
| Section numeral drift | `.t-drift` | transform | CSS scroll-driven (`animation-timeline: view()`), static where unsupported |
| Reading progress | `ScrollProgress.tsx` | transform (`scaleX`) | rAF-throttled |
| Vision band | `ExpandMedia.tsx` | transform, opacity | letterbox = two page-black bars sliding out (replaced a per-frame `clip-path`) |
| Principles stack | `.t-stack-card` | transform, opacity | scroll-driven; opacity 0.6 renders like brightness 0.6 on black |
| Project card hover | `TiltCard.tsx` | transform (via CSS vars) | spring physics, see below; mouse only |
| Project filter | `Projects.tsx`, `::view-transition-*` | snapshots (compositor) | View Transitions API, see below |
| Filter underline | `.t-underline` | transform (`translate` + `scaleX` of a 1px bar) | never tweens `width` |
| Number pop-in | `PopNumber.tsx`, `.t-digit` | opacity, transform | |
| 3D viewer skeleton | `ViewerSkeleton.tsx`, `.t-skel-*` | opacity, transform | covers both the chunk download and the GLB load |
| Chat typing dots | `ChatWidget.tsx`, `.t-typing` | opacity, transform | announced as "Assistant is typing" |
| Nav underline, arrow nudge | `.t-navlink`, `.t-nudge` | transform | |
| Hero stars | `.radiate-star` | opacity, transform | glow is a static shadow |
| Marquee, tech orbit | `.t-marquee-track`, `.t-orbit-*` | transform | infinite; frozen by the reduced-motion rule |

### Deliberate exceptions

- **FAQ accordion height** (`FAQ.tsx`): `grid-template-rows` 0fr to 1fr. There is no transform
  that grows a box without distorting its text. It is one 250 ms tween on a small list; the
  answer itself only fades and rises, and padding sits on the inner block, never the track.
- **Success check stroke** (`Contact.tsx`): `stroke-dashoffset` on a 60 px SVG path, once.
- **Hover colour changes**: the global `*` transition rule eases colour and border changes on
  hover. They are single-element, user-triggered, and not animations in the sense above.

## Spring hover (TiltCard)

One damped spring per axis (tilt X, tilt Y, lift), integrated with semi-implicit Euler in a rAF
loop that runs only while a spring is moving.

| Constant | Value | Why |
|---|---|---|
| `STIFFNESS` | 170 | |
| `DAMPING` | 16 | ratio 16 / (2 * sqrt(170)) = 0.61, under-damped |
| `MAX_TILT` | 5 deg | a lean, not a flip |
| `LIFT_PX` / `LIFT_SCALE` | -6 px / +1.5% | |
| dt clamp | 1/30 s | a long frame must not make the integration explode |

Simulated at 30 / 60 / 144 fps: 4-8% overshoot (about 0.4 deg on a 5 deg lean), settled in
under 0.9 s at every rate. Damping 20 was tried first and rejected: overshoot under 2% is
invisible, so the physics would not read. Touch never tilts, and the card sets no
`touch-action`, so a swipe that starts on a card scrolls the page.

## Project filter view transition

`document.startViewTransition` (Baseline since Oct 2025 per MDN) wraps the state change in
`flushSync`, so the DOM shows the new state before the browser snapshots it. Every card stays
mounted and filtering toggles `hidden`; each card carries `view-transition-name: project-<i>`.
Cards in both states glide; cards entering or leaving fade and scale (`t-vt-enter`/`t-vt-exit`).

`:root { view-transition-name: none }` keeps the page itself out of the capture. Measured in the
production build (6 alternating runs each): with the root captured, 2 of 6 transitions stalled
1.1-1.4 s before motion started, with the page frozen; with it excluded, all 6 started in
67-150 ms and finished in 534-623 ms.

Fallback: no API, or reduced motion, means a plain state swap.

## Adding an animation

1. Animate only `transform` and `opacity`. If the design needs something else, find the
   transform equivalent first (a sliding cover instead of `clip-path`, `scaleX` instead of
   `width`, opacity instead of `filter: brightness`).
2. Put durations and easings in a `:root` token block next to the effect.
3. Add its `prefers-reduced-motion` block, and a `matchMedia` check if JS drives it.
4. No `will-change` unless the element moves continuously.
5. Verify in the production build (`npm run build`, then `npm run preview`), not only in dev. To
   time a view transition, wrap `document.startViewTransition` and await its `ready` and
   `finished` promises.
6. Add the effect to the inventory above.
