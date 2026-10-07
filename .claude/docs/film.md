# The film ("Prompt to People"): the front of the site · 2026-10-07

## Purpose
One AI-generated camera journey is the background of the whole site and tells the career story
as you scroll: night desk → into the laptop screen → agent network → glass cubes ship → data
centre → XR classroom → orbit over the globe. Scroll is the playhead: the film plays forward as
you scroll down and backward as you scroll up, and text lands on the film's moments.

Decisions (Murci): concept A "Prompt to People" (2026-10-06); the film is the FULL-SCREEN
background of every section, not a framed screen (2026-10-07, replacing the "Studio" laptop); the
WebGL Earth and the particle background are retired (2026-10-07). Then, the same day: the film is
the FRONT of the site at near full brightness, not a darkened backdrop, with text art-directed into
each section's dark zones and no text boxes (design B "Editorial margins" with A's giant type at
the big moments), and light mode is retired for now (a paper veil would wash the film out; the
colour tokens stay). Clips were generated on his own OpenArt account.

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
 │    scroll ─> lib/filmJourney KNOTS ─> target T (+ look) ─> eased T ─> 2 blended frames + lighting
 │    └─ runs text cues: [data-beat="mN:f"] gets .is-beat when T reaches it
 │    └─ writes filmClock (T) ─> ExpandMedia (Vision title/copy), PopNumber (Stats counters)
 ├─ grain overlay (z-60)
 └─ sections (z-10, transparent backgrounds)
```

- `src/lib/film.ts`: the clip list (`CLIPS`, 81 frames each), `frameUrl`, `loadOrder`,
  `parseBeat`. Film time **T runs 0..6**: integer part = clip (0 = M1), fraction = position.
- `src/lib/filmJourney.ts`: `KNOTS` (the timeline and per-section lighting), `filmClock`.
- `src/components/FilmStage.tsx`: fetching, off-thread decoding, drawing, lighting, cues, clock.

### Why frames on a canvas, not `<video>`
Seeking a normally encoded video decodes forward from the previous keyframe, which stutters on
scroll and is worst on iOS Safari. Separate frames seek instantly (Apple's product pages use the
same technique). Every 3rd source frame is kept and the renderer blends the two nearest frames by
the fractional position, so 81 frames per clip still move smoothly.

## Contracts

**Knot** `{ at: sectionId | 'start' | 'end', f?: number, T: number, wide: Look, tall: Look }`,
where `Look = { dim, grade, strength, reach? }` and `grade` is one of none, left, right, top, bottom,
sides (both walls) or ends (top and bottom); `reach` is how far a one-sided grade extends across the
frame (default 0.62). A knot pins film time T to the scroll position where
section `at`'s top plus `f` of its height reaches the focus line (the middle of the viewport).
Between knots, T moves linearly and the two looks cross-fade. Positions are measured on resize,
font load and body size changes (not every frame), so the timeline holds at any screen size. Extra
knots (`f`) land an event near the top of a tall section (Experience), hold a moment (the Vision
classroom) or hold a long section's reading light until it has scrolled past (Experience, Skills,
FAQ).

**Easing** The drawn time eases toward the scroll target (time constant 70 ms on touch screens,
110 ms with a mouse), so wheel notches glide instead of cutting; jumps over half a clip snap.

**Text cue** `data-beat="mN:fraction"` on any element (e.g. `m2:0.6` = M2 at 6 s, T = 1.6). The
element gets `.is-beat` while the eased T reaches its time (0.04 hysteresis on the way back). CSS
hides cued elements only while `html[data-film="on"]`, which is set on the visitor's FIRST SCROLL:
before that (and for crawlers, which never scroll) all text is visible. Vision and the Stats
counters follow the same rule.
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

## Lighting and readability (measured)
The film runs at near full brightness. Each section's look is a light uniform veil plus a soft
one-sided grade (black, strongest at the frame edge, gone by 62% of the way across) on the side
where its text sits. The sides come from a **frame map**: for each section, the frames that play
behind it were measured on a grid for brightness (p90) and busyness, and the text was moved to the
darkest, calmest zone. Desktop: left for the hero, About and Experience; right for Skills,
Education, Principles and FAQ; both rack walls for Stats; top for the Open-source header; top and
bottom for Contact. The right-column sections (Skills, Education, Principles, FAQ) start their text
near the middle of the frame, so their grade reaches 0.85 across; at the default 0.62 it faded out
before the text column began. As Vision opens, Stats' last row leaves under the aisle's ceiling
lights, so Vision starts with a short top shade (reach 0.35) instead of wall shades. Phones (a
centre crop) use the top and bottom bands, with a reading veil (0.46-0.66) in long reading sections
(Experience, Stats, Skills, Education, Principles, FAQ, Contact) because their text spans the width
and scrolls through the middle. Long sections need a side grade, not a band: their text travels the
whole screen height.

Lettering does the rest, with no text boxes:
- cream text (`--c-fg` 244 239 230) with `.t-ink`: a tight shadow plus a soft 26 px one; small and
  mono text gets a denser halo; dark text on light buttons gets none;
- running text (leads, paragraphs, the Stats notes) is full cream: on a moving film every bit of
  alpha lets the frame through the letters. Hierarchy comes from size, weight and face. The faint
  tiers (raised to 76-92%) are only for small metadata. Text lime is lighter (`--c-accent`
  200 242 107) but still about 11% darker than the cream, so small lime text needs its section's
  shade;
- a feathered radial "pool" under chapter kickers, the Open-source header and Contact's link list
  (desktop: the globe's lime arcs cross it, and lime headings on lime arcs lose their edge), and
  Vision's pool behind its title and floor under its copy (soft shade, no edges);
- the footer is type on the film's last frame (the arcs over the globe), not a slab: the end
  knot's bottom band shades it, and it follows the same lettering rules.

Verified with a **pixel contrast scan**: every visible text box is measured against the real
screenshot pixels under it (film + lighting + shadows; text made transparent), using the brightest
decile under light text. The film changes with scroll, so the scan steps every 0.1 viewport over the
whole page, and every 28-32 px over any section that failed or sits on a bright moment. Final
(2026-10-07): **0 failures** at 1280x800 (2,198 text-box checks over the page) and 360x702 (2,104
over the page, then each re-tuned stretch again at 28 px: hero, Experience, Stats into Vision,
Contact and the footer). Later tuning only added shade, so it cannot undo a pass elsewhere. An
earlier scan at 0.75-viewport steps had reported 0 failures where the fine scan found 25: a coarse
scan is a sample. The scan script lives in the session scratchpad (`film_bg_check.cjs`;
`CFROM`/`CTO`/`CSTEP` narrow a re-scan); it skips text under the fixed nav, the chat button and the
progress hairline, clips text to its scroll containers, and treats blended text separately.

## Loading and budgets
- Rendition by viewport shape: `wide` if width ≥ height, else `tall`. Canvas backing store is
  capped at 1.5x DPR and 1.25x the rendition width.
- Frames are fetched as files and decoded with `createImageBitmap` (off the main thread). Only a
  window of 12 frames each side of the playhead, every 8th frame of the clip and the dissolve edges
  stay decoded; the rest are closed (their encoded files stay in memory).
- Before the window `load` event only the poster frame loads; before the first scroll, only the
  opening 24 frames. Then the clip on screen loads outward from the playhead (every 4th frame
  first), then its neighbours, at most 4 in flight. Until a frame arrives the nearest decoded one
  is drawn. Measured: 0.47 MB (phone) and 0.82 MB (desktop) before any scroll.
- Caching (`vercel.json`): `/film/*` for 7 days with stale-while-revalidate. Re-encoded frames must
  go in a new folder, or visitors keep the old ones for up to a week.
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
- **Tune readability:** first move the text to its section's dark side (the frame map) and make sure
  it is full cream; then extend that knot's grade `reach` (if the grade fades out before the text
  column), or raise its `strength` or `dim`, for the rendition that failed; re-run the pixel contrast
  scan at both sizes, at 0.1 viewport steps or finer (the film changes between samples; a 0.75-step
  scan once reported 0 failures where a fine one found 25). No panels behind text (Murci's brief).
