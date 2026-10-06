# The film ("Prompt to People"): the site's background — 2026-10-07

## Purpose
One AI-generated camera journey is the background of the whole site and tells the career story
as you scroll: night desk → into the laptop screen → agent network → glass cubes ship → data
centre → XR classroom → orbit over the globe. Scroll is the playhead: the film plays forward as
you scroll down and backward as you scroll up, and text lands on the film's moments.

Decisions (Murci): concept A "Prompt to People" (2026-10-06); the film is the FULL-SCREEN
background of every section, not a framed screen (2026-10-07, replacing the "Studio" laptop);
light mode is a paper veil over the film (2026-10-07); the WebGL Earth and the particle
background are retired (2026-10-07: the film ends on a globe, and the three.js chunk was the
biggest cost on the P30 lite). Clips were generated on his own OpenArt account.

## Sources (masters)
`media-src/` is gitignored and holds the masters: keyframes `K0-K6.png` and clips `M1-M6.mp4`
(1280x720, 24 fps, 10 s, 241 frames, no audio). Only encoded outputs are committed.

Measured facts about the masters (2026-10-06):
- Each clip starts on its keyframe but does not land on the next one, so clips do not join end
  to end. The renderer dissolves between clips over 0.6 s of film.
- **M6 ends over North America**, with the light arcs leaving the US, not Johannesburg. Murci
  kept it. No copy may say the arcs start in Johannesburg.
- K6 has readable text labels baked in, so it is not used anywhere.
- Events per clip (seconds): M1 desk dolly 0-5, glyph waterfall 5-7, screen fills 7, light
  point 9. M2 light grows 0-6, burst 6, network 7-10. M3 network 0-2, cubes form 2, sideways
  track 3-10. M4 cubes and gate 0-3, through the gate 3-5, data-centre aisle 6-10. M5 bright aisle
  0-4, golden doorway 5-7, classroom 8-10. M6 night room 0-1, skylight 2-3, dusk window 4, city
  5, orbit 6, arcs 7-10.

## Architecture
```
media-src/Mn.mp4 ─ scripts/encode-film.sh ─> public/film/mN/wide/001-081.webp  (1280x720, landscape)
                                            public/film/mN/tall/001-081.webp  (432x720 centre crop, portrait)

App.tsx
 ├─ <FilmStage/>      fixed full-screen canvas, z-0 (behind every section)
 │    scroll ─> lib/filmJourney KNOTS ─> film time T + veil ─> draw 2 blended frames + veil
 │    └─ runs text cues: [data-beat="mN:f"] gets .is-beat when T reaches it
 │    └─ writes filmClock (T) ─> ExpandMedia (Vision title/copy), PopNumber (Stats counters)
 ├─ grain overlay (z-60)
 └─ sections (z-10, transparent backgrounds)
```

- `src/lib/film.ts`: the clip list (`CLIPS`, 81 frames each), `frameUrl`, `loadOrder`,
  `parseBeat`. Film time **T runs 0..6**: integer part = clip (0 = M1), fraction = position.
- `src/lib/filmJourney.ts`: `KNOTS` (the timeline), `veilAlpha`, `filmClock`.
- `src/components/FilmStage.tsx`: loading, drawing, veil, cues, clock.

### Why frames on a canvas, not `<video>`
Seeking a normally encoded video decodes forward from the previous keyframe, which stutters on
scroll and is worst on iOS Safari. Separate frames seek instantly (Apple's product pages use the
same technique). Every 3rd source frame is kept and the renderer blends the two nearest frames by
the fractional position, so 81 frames per clip still move smoothly.

## Contracts

**Knot** `{ at: sectionId | 'start' | 'end', f?: number, T: number, dim: number }`. A knot pins
film time T to the scroll position where section `at`'s top plus `f` of its height reaches the
focus line (the middle of the viewport). Between knots, T and dim interpolate linearly. Positions
are measured from the live layout on every update, so the timeline holds at any screen size.
Two knots per section (`f`) are used where an event must land on content near the top of a tall
section (Experience) or must hold (the Vision classroom).

**Text cue** `data-beat="mN:fraction"` on any element (e.g. `m2:0.6` = M2 at 6 s, T = 1.6). The
element gets `.is-beat` while T ≥ its time (with 0.04 hysteresis on the way back). CSS hides cued
elements only while `html[data-film="on"]`, so if the film never starts, everything is visible.
Put cues on wrappers, not on elements that animate transform themselves.

**Clock** `filmClock.subscribe(fn)` → unsubscribe; `filmClock.on` is false under reduced motion
or Save-Data, and subscribers then show their final state. `PopNumber beat="m4:0.6"` pops on a
film moment.

### Current cues (each verified to fire with its element on screen, desktop and phone)
| Element | Cue | Film moment |
|---|---|---|
| About heading / lead / columns | `m1:0.55` / `m1:0.7` / `m1:0.92` | glyphs start, screen fills, light point |
| Experience heading | `m2:0.6` | the burst into the agent network |
| Open-source heading | `m3:0.2` | the first glass cubes form |
| Stats counters | `m4:0.6` (PopNumber) | the data-centre racks |
| Vision words part / copy | T 4.45-4.72 / 4.78-4.9 (filmClock) | the golden doorway / the classroom |
| Contact heading | `m6:0.76` | the arcs fan out |

## The veil and readability (measured)
The veil is drawn into the canvas over the film: black at alpha `dim` in dark mode, paper at
`min(0.9, 0.48 + 0.55 × dim)` in light mode. Each knot's dim was raised until a **pixel contrast
scan** passed: every visible text box is measured against the real screenshot pixels under it
(film + veil + scrims), using the brightest decile under light text and the darkest under dark
text, at every 0.75 viewport of the page. Final: 0 failures across desktop 1280x800 and phone
360x702, dark and light (415 and 357 text boxes). What it took:
- Dims: peaks 0.3 (hero, classroom), 0.62-0.74 (ship, stats, contact), 0.72-0.8 reading sections.
- The muted-text floor rose: dark `--tx-faint/muted/soft` 0.62/0.66/0.7 (was 0.48/0.55/0.6 on a
  solid page), light 0.67/0.7/0.74.
- Panels where small text sits on the brightest frames: Experience "What I can build" cards and
  the Contact aside get `bg-bg/55`; the Vision label a `bg-bg/60` pill.
- Scrims: the hero has a side scrim (top-to-bottom on phones, /60 at the top for the lime kicker
  in Paper mode); Vision has a radial pool behind the title and a floor under the copy.
- The Vision title is theme ink, not `mix-blend-difference`: the film is a separate fixed layer,
  so a blend only ever saw the pool and rendered grey on paper.
The scan script lives in the session scratchpad (`film_bg_check.cjs`); its method is above. It
skips text under the fixed nav or chat button and clips text to its scroll containers, as the
browser paints it.

## Loading and budgets
- Rendition by viewport shape: `wide` if width ≥ height, else `tall`. Canvas backing store is
  capped at 1.5x DPR and 1.25x the rendition width.
- Before the window `load` event only the first frame (the poster) loads. Then the clip on screen
  loads coarse-to-fine, then its neighbours, at most 4 in flight. Until a frame arrives the
  nearest loaded one is drawn.
- Budgets: ≤ 5 MB per clip on desktop, ≤ 2 MB per clip on phones. Measured (KB, wide / tall):
  M1 2,204 / 1,057 · M2 3,147 / 1,420 · M3 2,628 / 1,109 · M4 1,939 / 713 · M5 2,692 / 854 ·
  M6 1,752 / 787. A full read of the page costs about 14 MB on desktop and 6 MB on a phone,
  fetched one clip ahead, never up front.
- Reduced motion or Save-Data: one still per knot, no scrubbing, no cues, all text visible.
  Measured: 9 frame requests for the whole page.

## Error handling
A frame that fails to load is skipped and the nearest loaded frame is drawn; with none loaded the
canvas shows the theme background. Nothing throws into React. If FilmStage does not start,
`data-film` is never set and all cued text is visible.

## Security
Static, same-origin public assets only (the canvas is never tainted). No user data. The dev-only
`window.__filmClock` hook is stripped from production builds (`import.meta.env.DEV`).

## Runbook
- **Re-encode a clip:** `bash scripts/encode-film.sh m3 media-src/M3.mp4` and check the printed
  sizes against the budgets. To cut size, raise the frame step (third argument) before lowering
  quality, and update `count` in `CLIPS`.
- **Move a cue:** pick the film moment from the events list, set `data-beat`, then verify the
  element is on screen when it fires (walk the page, record T and the element's rect per step).
- **Change a section's height:** knots follow the layout automatically; re-check its cues.
- **Tune readability:** raise that knot's `dim` (or give the text a panel), then re-run the pixel
  contrast scan in both themes and both sizes.
