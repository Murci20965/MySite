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
   effects (filmstrip, scroll-linked Vision band, number pop-in) also check
   `matchMedia` and skip the motion entirely.
3. **Fail open.** Nothing may stay invisible because an observer missed. `AnimatedSection`
   reveals by IntersectionObserver, by a geometry check on mount and by a 2.5 s timer.
4. **Tokens, not literals.** Durations and easings live as CSS custom properties in
   `src/index.css` (the transitions.dev naming: `--enter-*`, `--stagger-*`, `--tilt-*`,
   `--skel-*`, ...). The shared ease is `cubic-bezier(0.22, 1, 0.36, 1)`.
5. **No `will-change` on large things that wait.** The hint pins a GPU layer for as long as it
   is set. It is used on elements that move continuously (marquee, orbit, progress
   bar, filmstrip) and on a few tiny one-shot elements (hero lines, digits, the success check), never on
   section-sized blocks waiting below the fold. Transitions are promoted automatically while
   they run.
6. **Scroll-linked layers take no CSS transition.** A legacy global rule
   (`* { transition-property: ...transform, opacity...; 200ms }`) eases every style change.
   Anything JS writes from scroll position every frame must opt out (`t-scroll-linked`, or
   `transition: none` in its own rule), or it trails the scrollbar by 200 ms. Check with
   `getComputedStyle(el).transitionDuration`: it must read `0s`.

## Inventory

| Effect | Where | Animates | Notes |
|---|---|---|---|
| Section entrance | `AnimatedSection.tsx`, `.t-enter` | opacity, transform | `index` prop cascades list items by `--enter-stagger` (70 ms, capped at 4 steps) |
| Hero text reveal | `Hero.tsx`, `.t-stagger-line` | opacity, transform | runs once on mount |
| Heading reveal | `RevealHeading.tsx`, `.t-chars` | opacity, transform | per character; no `will-change` (it held a layer per character) |
| Section numeral drift | `.t-drift` | transform | CSS scroll-driven (`animation-timeline: view()`), static where unsupported |
| Reading progress | `ScrollProgress.tsx` | transform (`scaleX`) | rAF-throttled; `t-scroll-linked` |
| Vision band | `ExpandMedia.tsx` | transform, opacity | letterbox = two page-black bars sliding out (replaced a per-frame `clip-path`); `t-scroll-linked` |
| Open-source filmstrip | `OpenSource.tsx`, `.t-film-*` | transform, opacity | pinned horizontal strip, see below; carousel on phones and under reduced motion |
| Live badge | `.t-live` | transform, opacity | ring expands and fades; marks projects with a live demo |
| Principles stack | `.t-stack-card` | transform, opacity | scroll-driven; opacity 0.6 renders like brightness 0.6 on black |
| Number pop-in | `PopNumber.tsx`, `.t-digit` | opacity, transform | |
| Chat typing dots | `ChatWidget.tsx`, `HeroTerminal.tsx`, `.t-typing` | opacity, transform | announced as "Assistant is typing" / "Thinking" |
| Hero film scrub | `FilmScrub.tsx`, `Hero.tsx` | canvas frames; the timeline bar is `scaleX` (`t-scroll-linked`) | M1 frame sequence driven by scroll; the hero pins for one screen on desktop; a single still frame under reduced motion. See `film.md` |
| Chat launcher stow | `ChatWidget.tsx` | opacity, transform | hides (and leaves the tab order) while the hero terminal is in view |
| Nav underline, arrow nudge | `.t-navlink`, `.t-nudge` | transform | |
| Marquee, tech orbit | `.t-marquee-track`, `.t-orbit-*` | transform | infinite; frozen by the reduced-motion rule |

### Deliberate exceptions

- **FAQ accordion height** (`FAQ.tsx`): `grid-template-rows` 0fr to 1fr. There is no transform
  that grows a box without distorting its text. It is one 250 ms tween on a small list; the
  answer itself only fades and rises, and padding sits on the inner block, never the track.
- **Success check stroke** (`Contact.tsx`): `stroke-dashoffset` on a 60 px SVG path, once.
- **Hover colour changes**: the global `*` transition rule eases colour and border changes on
  hover. They are single-element, user-triggered, and not animations in the sense above.

## Removed effects (2026-10-06)

The spring-physics card hover (`TiltCard`: stiffness 170, damping 16, ratio 0.61, 4-8%
overshoot, settled under 0.9 s at 30/60/144 fps), the sliding filter underline, the
view-transition project filter and the 3D viewer skeleton went out with the Selected work and
Blog sections. They are in git history (merge `2a92464`) if a future section needs them.
The hero's twinkling stars (`.radiate-star`) and the intro-video modal (`.t-modal`) went out
with the Studio hero on branch `feat/v3`.

## Open-source filmstrip

The single work section (option C of three, chosen by Murci on 2026-10-06). Mode is decided by
`(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)`.

**Pinned mode.** The wrapper's height becomes `innerHeight + travel`, and a sticky stage holds
the header and track for that extra scroll. Each rAF-throttled scroll event computes progress
`p` from the wrapper's top and writes:
- `translate3d(-p * travel)` on the track;
- per panel, opacity `1 - min(|d| * 0.9, 0.6)` and scale `1 - min(|d| * 0.1, 0.06)`, where `d` is
  the panel's distance from the stage centre in stage widths (from `offsetLeft`, pre-transform);
- a parallax `translate3d(-d * 48px)` on the panel's diagram, which is 2rem wider than its
  frame on each side so no edge shows;
- the header's progress bar (`scaleX(p)`) and the "01 of 07" counter (text only when it changes).

`travel` is the last panel's right edge plus the end gutter, minus the stage width.
(`scrollWidth` drops a flex row's end padding and left the last panel overhanging.) The stage is
`overflow-x: clip`, so focus cannot scroll it sideways. Instead, focusing a link in an off-screen
panel scrolls the page to the point where that panel is centred.

**Carousel mode.** Native `scroll-snap-type: x mandatory` with `scroll-padding` equal to the page
gutter, Prev/Next buttons, and the same counter and bar driven by `scrollLeft`.

Verified headless (Playwright) at 1280x800, 1366x768, 1440x900, 1920x1080 and 360x702, plus
reduced motion. Stage stays at y=0 while pinned, track 0 -> -2136 px at 1280 wide, counter
01 -> 07, keyboard focus centres panel 6 at x=640, touch swipe advances the carousel, and the
header row clears the floating chat launcher at every size.

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
   and headless Playwright (see the filmstrip numbers above) covers motion that a hidden
   Browser pane cannot run.
7. Add the effect to the inventory above.
