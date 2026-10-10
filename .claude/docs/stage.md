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
**The shade under the text**: every step of a sequence scene has a soft dark area behind it, part
of the step, so it arrives and leaves with it (Murci, 2026-10-10: text "clearly visible"). It is
45% black with a 140 px feather (96 px on phones, a smaller layer per step), so it reads as shadow,
not a shape: a 72 px feather read as a dark rectangle on the clouds and a glass panel as a UI box
(A/B on the same frames, 2026-10-09). `pool` (`data-pool`) deepens it to 58% for scenes over the
film's brightest frames (the globe chapters). The Stack deck has none (its cards are their own
glass), and the hero name takes the same shade (`.t-shade`). Shading the whole frame instead would
dim the film everywhere.

**Step curve** (`stepLook`, t = the step's position in steps): arrives over t -0.2 → 0.12 (from a
little depth: scale 0.965 → 1, 16 px below), holds, passes over t 0.8 → 1.0 (scale up 4%, 12 px up).
Neighbouring steps overlap only in those ramps: a short crossfade, never two steps at full strength.
A `stack` step leaves with the scene's last step.

**Deck** (`stack` mode, `deckDepth` + `DECK` in stage.ts): a card's depth is how many later cards
have landed on it (fractional while one is landing). Each level lifts it 14 px (its top edge peeks
out above the card in front), shrinks it 3% (capped at 6 levels) and dims it 16% (capped at 4). The
director writes `--depth` on the card; `.deck-text` fades its text out by depth 0.7, so a buried
card shows its glass edge, never ghosted text. Only the top card (depth < 0.5) takes pointer events.

**Film** Each scene has two knots in `filmJourney.ts`: `edge: 'top'` (its first step arriving) and
`edge: 'bottom'` (its last step gone), so its film window runs exactly across its steps.

## The scenes (storyboard v1)
| Scene | Film window | Steps | stepVh | Where the steps sit (wide · tall) |
|---|---|---|---|---|
| Hero (01) | 0 s | copy | first 50vh | the dark wall left of the lamp, x .085 y .37 (was the monitor's editor: the code behind it made it hard to read) · top 10% |
| About (02) | 3.0-5.0 s | 3 | 85 | editor's empty right side, x .55 · bottom band |
| Experience (03) | 5.0-7.6 s | 3 roles + 4 capabilities | 85 | right of the light field · top |
| Open source (04) | 7.6-9.2 s | 7 | 85 | open right, threads stream from the left · bottom band |
| Numbers (05) | 9.2-10.2 s | 4 | 70 | top right, clear of the warm glow · top |
| Vision (06) | 10.2-11.2 s | 2 | 90 | centred in the sky above the city · top |
| Stack (07) | 11.2-13.6 s | 8 (deck) | 55 | the sky, top left (lime glass cards) · top quarter |
| breather | 13.6-16.2 s | none | 70vh | the rise to orbit plays with nothing on it |
| Education (08) | 16.2-17.6 s | 5 | 75 | above the Earth's edge, top left · top |
| Principles (09) | 17.6-19.0 s | 6 | 70 | above the Earth's edge, top right · top |
| Questions (10) | 19.0-20.4 s | 6 | 75 | above the Earth's edge, top left · top |
| Contact, footer | 20.4-21 s | normal flow | | unchanged (Murci's call) |

**Hero** is not a Scene: its copy is placed with the same `placeBox`, held `position: fixed` from the
first paint (so it sits on the monitor while the camera pushes in) and passes the camera over the
first half screen of scroll. Reduced motion: an ordinary first screen. **Breather**
(`#breather`, App.tsx): an empty spacer (0 tall in flow, 70vh staged) so the fastest stretch of the
film, the rise from the city to orbit, plays on its own. **Marquee** (the capability ticker) was
removed: on a fixed stage there is no "between sections" for it to divide.

## Data flow
Scroll → StageDirector (rAF): for each scene, p = (scrollY − scene top) / step px; a scene is active
for p in (−0.4, steps + 0.05); each active step gets `opacity` and `transform` from `stepLook(p − i)`,
and `data-on` while it is clearly visible (opacity > 0.5), which alone enables its pointer events.
Layout (spacer heights, step boxes, scene tops) runs on load, on fonts ready, when staged mode
switches on, and on a width change or a height change over 20% (phones resize the viewport when
the URL bar moves; re-laying out then would change the page height mid-scroll).

**Navigation** Staged, nav links cut (`scroll-behavior: auto`): a smooth scroll swept the film through
every chapter in between and flashed their steps past. Each scene's `scroll-margin-top` is minus
`LAND` (0.3) steps, so a link lands with the first step fully in and the film inside the scene's
window (at the scene's top it was half faded in, on the previous scene's film). The film side of a
jump (frames not loaded yet) is in film.md, "Loading".

**Into Contact** Contact is normal flow after the last scene. Staged, its content starts 90vh down,
so it rises into view as the last question passes (it slid in under it), and the light turns to
Contact's during the last question (film.md).

## Fallbacks and accessibility
- Default (no JavaScript, before the first scroll, reduced motion, Save-Data): every scene is a
  normal readable section: its heading, then every step in order. Crawlers see all text.
- Staged: the scene heading stays for screen readers (visually hidden); all steps stay in the DOM
  in reading order. A keyboard user tabbing into a step that is not on screen is scrolled to it.
- "Read more" is a native `<details>` (no JavaScript); open, it scrolls inside the step (32vh, 26vh
  in portrait) so it never runs off the screen or under the "Ask Murci" button.

## Performance
Only opacity and transform change per frame (compositor work), only for the active scene's steps
(8 at most, the deck), and nothing reads layout during scroll (scene tops are cached). Measured
2026-10-09 on every scene, desktop 1280x800 and phone 360x702 (`scratchpad/v4/all_check.cjs`): at
each step position exactly one step is on (`data-on`) and, in sequence scenes, the only one above
half opacity; film time stays inside each scene's window (Experience 5.17 → 7.40 s, FAQ 19.10 →
20.27 s); 0 console errors, 0 failed frame fetches or decodes.

## Runbook
- **Add a step:** add a `<Step place>` in the scene; pick the place from the film's calm map at the
  step's film time (its scene's window, split evenly across its steps).
- **Move a step:** change its `place`; check it on a desktop and a 360x702 phone at its position
  (`scratchpad/v4/all_check.cjs <desktop|phone> [scene]` screenshots each step and logs its box).
  Then re-run the fine contrast scan over that scene (film.md, "Lighting").
- **Make a scene a deck:** `mode="stack"` on the Scene, and wrap each card's text in `.deck-text`
  so buried cards show only their edge. Keep cards a similar height: a taller card deeper in the
  pile would show its bottom edge below the top card.
- **Change a scene's pace:** `stepVh`. The film window stays the same; only the scroll length changes.
