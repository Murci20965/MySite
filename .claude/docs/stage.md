# The reveal stage: content one step at a time, over the film · 2026-10-09

## Purpose
Murci's brief (2026-10-09): sections should not show everything at once. Each chapter reveals one
item at a time as you scroll (Experience: Nudle, then Alignerr, then Artintel), text stays minimal
and sits where its film moment leaves dark, open space, and scrolling should feel like going INTO
the page, not down it. Contact and the footer stay as they are. The placements come from storyboard
v1 (`~/Downloads/mysite-video-v4/storyboard-v1.png`, approved 2026-10-09), measured on the v4 film's
calm zones (film.md).

## Architecture
```
 App.tsx
 ├─ <FilmStage/>      canvas; sets html[data-film="on"] on the first scroll (never under reduced
 │                    motion or Save-Data); KNOTS with edge:'top'|'bottom' pin film time to scenes
 ├─ <StageDirector/>  one controller for every .scene: sizes spacers, places steps, moves the
 │                    active scene's steps on scroll (opacity + transform only)
 └─ sections
     └─ <Scene id n name stepVh mode>            a normal <section>, its heading, a .scene-stage
          └─ <Step place={{ wide, tall }}>       one item; <StepLabel> opens it ("03 · Experience 01 / 03")
```
- `src/lib/stage.ts`: placement maths (`placeBox`) and the step curve (`stepLook`), pure functions.
- `src/components/Scene.tsx`: `Scene`, `Step`, `StepLabel` markup.
- `src/components/StageDirector.tsx`: the runtime.
- `src/index.css`, "Reveal stage": the flow (default) and staged styles.

**Why one fixed stage, not pinned sections:** pinned (sticky) sections still scroll away and the next
one scrolls up, which reads as going down. Here nothing scrolls up the screen: each scene is an
invisible spacer (steps × step length), its steps sit on a fixed stage, and they arrive, hold and
pass in place while the film moves forward.

## Contracts
**Place** `{ wide: { x, y, w, align? }, tall: { y, from? } }`
- `wide`: fractions of the FILM FRAME. `x` is the box's left edge (or right or centre, by `align`),
  `y` its top, `w` its width as a fraction of the frame width. Converted to the viewport with the
  same cover fit the canvas uses (`FRAME_ASPECT` 1920/1072), so a step anchored to a dark part of
  the picture stays on it at any window shape. Width is clamped to 320-620 px and the box to 24 px
  from the edges (and 80 px from the top, under the nav).
- `tall` (portrait phones, which show a centred vertical slice): `y` is a fraction of the viewport
  height from the top (or the bottom); the box spans the width minus 24 px each side.

**Scene** `stepVh` (default 85): scroll length of one step in % of the viewport height.
`mode`: `sequence` (one step at a time) or `stack` (steps stay and pile up until the scene ends).

**Step curve** (`stepLook`, t = the step's position in steps): arrives over t -0.2 → 0.12 (from a
little depth: scale 0.965 → 1, 16 px below), holds, passes over t 0.8 → 1.0 (scale up 4%, 12 px up).
Neighbouring steps overlap only in those ramps: a short crossfade, never two steps at full strength.
A `stack` step leaves with the scene's last step.

**Film** Each scene has two knots in `filmJourney.ts`: `edge: 'top'` (its first step arriving) and
`edge: 'bottom'` (its last step gone), so its film window runs exactly across its steps.

## Data flow
Scroll → StageDirector (rAF): for each scene, p = (scrollY − scene top) / step px; a scene is active
for p in (−0.4, steps + 0.05); each active step gets `opacity` and `transform` from `stepLook(p − i)`,
and `data-on` while it is clearly visible (opacity > 0.5), which alone enables its pointer events.
Layout (spacer heights, step boxes, scene tops) runs on load, on fonts ready, when staged mode
switches on, and on a width change or a height change over 20% (phones resize the viewport when
the URL bar moves; re-laying out then would change the page height mid-scroll).

## Fallbacks and accessibility
- Default (no JavaScript, before the first scroll, reduced motion, Save-Data): every scene is a
  normal readable section: its heading, then every step in order. Crawlers see all text.
- Staged: the scene heading stays for screen readers (visually hidden); all steps stay in the DOM
  in reading order. A keyboard user tabbing into a step that is not on screen is scrolled to it.
- "Read more" is a native `<details>` (no JavaScript); open, it scrolls inside the step (32vh, 26vh
  in portrait) so it never runs off the screen or under the "Ask Murci" button.

## Performance
Only opacity and transform change per frame (compositor work), only for the active scene's steps
(7 at most so far), and nothing reads layout during scroll (scene tops are cached). Measured
(Experience, 2026-10-09, desktop and phone): one step at full opacity at each step position, the
rest at 0; film time 5.17 → 7.40 s across the 7 steps; no console errors.

## Runbook
- **Add a step:** add a `<Step place>` in the scene; pick the place from the film's calm map at the
  step's film time (its scene's window, split evenly across its steps).
- **Move a step:** change its `place`; check it on a desktop and a 360x702 phone at its position
  (`scratchpad/v4/stage_check.cjs` shows each step and its box).
- **Change a scene's pace:** `stepVh`. The film window stays the same; only the scroll length changes.
