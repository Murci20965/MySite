# The film ("Prompt to People"): the front of the site · v4, 2026-10-09

## Purpose
One AI-generated camera journey is the background of the whole site and tells the career story as
you scroll, in a single continuous take: Murci's desk at night → the camera dives into the monitor →
the code dissolves into points of light → threads of light → a warm glow → a city at night → up to
orbit → the globe with lime arcs. Scroll is the playhead: the film plays forward as you scroll down
and backward as you scroll up, and text lands on the film's moments.

Decisions (Murci): concept A "Prompt to People" (2026-10-06); the film is the FULL-SCREEN background
of every section (2026-10-07); the film is the FRONT of the site at near full brightness, text
art-directed into each moment's dark space, no text boxes (2026-10-07); light mode retired for now.
v4 (2026-10-09): ONE continuous ~20 s take replaces the six clips, from his own desk image (start
frame) to the previous film's globe (end frame), generated in one prompt on his own OpenArt account
and upscaled there to 4K. Content reveals one item at a time, placed where each frame leaves room
(storyboard v1, approved 2026-10-09).

## Sources (masters)
`media-src/` is gitignored and holds the masters: `film-v4-4k.mp4` (3866x2160, 30 fps, 21 s, 630
frames, the OpenArt 4K upscale) and the old six clips. Only encoded outputs are committed. Copies of
the prompt, keyframes and storyboard: `~/Downloads/mysite-video-v4/` on Murci's laptop.

Measured facts about the v4 master (2026-10-09):
- The same take as the 1284x716 original (per-second correlation >= 0.999), no added flicker, and
  genuinely sharper (upscale-check.png).
- No cuts: the largest frame-to-frame change is about 4x the median (fast moves through the screen
  glass at ~3.8 s and the glow forming at ~8 s). Brightness is steady (40-50 of 255), darkest in the
  light field at 5-7 s (~20).
- Camera speed varies: fast through 1-5 s and 14-15 s (the rise to orbit, the fastest stretch),
  slow over the city at 11-13 s, nearly still on the globe from 17 s.
- Moments (s): desk 0-3, monitor fills 3.2, through the screen 3.8, code blurs 4.5-4.8, light field
  5-7.6, threads 7.6-9, glow 9-10.4, city appears 10.4, city grid 11-13.6, rise to orbit 13.6-16,
  arcs fan out 16.4-18.4, settled 19-21.
- **The globe is over North America**, arcs leaving the US hub, not Johannesburg: no copy may say
  the arcs start in Johannesburg.

## Architecture
```
media-src/film-v4-4k.mp4 ─ scripts/pick-film-frames.py ─> src/lib/filmFrames.json  (315 kept frames)
                         └ scripts/encode-film.py ─> public/film/v4/wide/001-315.webp  (1920x1072)
                                                  public/film/v4/tall/001-315.webp  (540x960 slice)

App.tsx
 ├─ <FilmStage/>      fixed full-screen canvas, z-0 (behind every section)
 │    scroll ─> lib/filmJourney KNOTS ─> target T (+ look) ─> eased T ─> 2 blended frames + lighting
 │    └─ runs text cues: [data-beat="t:seconds"] gets .is-beat when T reaches it
 │    └─ writes filmClock (T) ─> ExpandMedia (Vision title/copy), PopNumber (Stats counters)
 ├─ grain overlay (z-60)
 └─ sections (z-10, transparent backgrounds)
```

- `src/lib/film.ts`: `FRAME_TIMES` (the time of each kept frame), `FILM_SECONDS`, `frameAt`,
  `nearestFrame`, `frameUrl`, `parseBeat`. Film time **T is in seconds of the master**, 0..20.97.
- `src/lib/filmJourney.ts`: `KNOTS` (the timeline and per-section lighting), `filmClock`.
- `src/components/FilmStage.tsx`: fetching, off-thread decoding, drawing, lighting, cues, clock.

### Why frames on a canvas, not `<video>`
Seeking a normally encoded video decodes forward from the previous keyframe, which stutters on
scroll and is worst on iOS Safari. Separate frames seek instantly (Apple's product pages use the
same technique). The renderer blends the two nearest kept frames by the time between them.

### Why the kept frames are spaced by motion, not by time
Smoothness depends on how much the picture changes between two blended frames, not on frame rate.
`pick-film-frames.py` measures the change between every pair of source frames and keeps 315 frames
spaced by equal amounts of it: dense where the camera moves fast (55-61 frames per 3 s in the first
9 s), sparse where it is nearly still (18 frames in the last 3 s), never more than 6 source frames
apart. The worst change between kept frames is 14.1 against 17.3 for every 2nd frame: smoother where
it is hard, for the same weight.

## Contracts

**Knot** `{ at: sectionId | 'start' | 'end', f?: number, T: number (seconds), wide: Look, tall: Look }`,
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
110 ms with a mouse), so wheel notches glide instead of cutting; jumps over 3 s of film snap.

**Text cue** `data-beat="t:seconds"` on any element (e.g. `t:5.6` = 5.6 s into the film). The
element gets `.is-beat` while the eased T reaches its time (0.4 s hysteresis on the way back). CSS
hides cued elements only while `html[data-film="on"]`, which is set on the visitor's FIRST SCROLL:
before that (and for crawlers, which never scroll) all text is visible. Vision and the Stats
counters follow the same rule. A malformed or out-of-range cue never fires, so its text would stay
hidden after the first scroll: check every cue with the playback script after timing changes.
Put cues on wrappers, not on elements that animate transform themselves.

**Clock** `filmClock.subscribe(fn)` → unsubscribe; `filmClock.on` is false under reduced motion
or Save-Data, and subscribers then show their final state. `PopNumber beat="t:9.4"` pops on a
film moment.

### Current cues (v4 phase A: retimed to the new film; phase B/C replace them with reveals)
| Element | Cue | Film moment |
|---|---|---|
| About heading / lead / columns | `t:3.6` / `t:4.1` / `t:4.6` | the monitor fills, through the screen, the code blurs |
| Experience heading | `t:5.6` | the light field |
| Open-source heading | `t:7.8` | the threads stream in |
| Stats counters | `t:9.4` (PopNumber) | the glow |
| Vision words part / copy | T 10.2-10.6 / 10.7-10.95 (filmClock) | through the glow / the city appears |
| Contact heading | `t:20.45` | the settled globe |

Verified 2026-10-09 (desktop, full scroll): film time runs strictly forward 0 → 20.94, all 6 cues
fire, all 315 frames fetched, no failures or console errors.

## Lighting and readability (measured)
**v4 note:** the looks and the measurements below are the previous film's; the knots carry them
over as placeholders. They are re-measured on the v4 frames as each section's reveal layout lands.

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
  window around the playhead stays decoded: 8 frames each side on wide screens (a decoded 1920 px
  frame is about 8 MB), 12 on phones (about 2 MB each). There is no spine of far frames: with one
  315-frame film, the old every-8th-frame spine would hold ~40 decoded frames, several hundred MB on
  desktop. Encoded files stay in memory once fetched.
- Before the window `load` event only the poster frame loads; before the first scroll, only the
  opening 24 frames. Then frames within 60 of the playhead load outward from it (every 4th frame
  first), at most 4 in flight. Until a frame arrives the nearest decoded one is drawn.
- Caching (`vercel.json`): `/film/*` for 7 days with stale-while-revalidate. Re-encoded frames must
  go in a new folder (v4 lives in `film/v4/`), or visitors keep the old ones for up to a week.
- Sizes (measured): wide 20.5 MB, tall 6.9 MB for all 315 frames. A full read of the page costs
  about 20 MB on desktop and 7 MB on a phone, fetched around the playhead, never up front.
- Reduced motion or Save-Data: one still per knot, no scrubbing, no cues, all text visible.

## Error handling
Every frame gets 2 tries across fetching and decoding (`MAX_TRIES`); after that it is skipped and
the nearest decoded frame is drawn, and with none decoded the canvas shows the theme background.
If `createImageBitmap` fails on a file that `<img>` can decode (memory pressure, some GPU setups),
the decoder is at fault, not the file: every later frame decodes through `<img>`. If the browser's
graphics process resets, the canvas redraws on `contextrestored`. Nothing throws into React. If
FilmStage does not start, `data-film` is never set and all cued text is visible.

Before 2026-10-07 (PR #2) a failed fetch or decode was swallowed and retried at once, forever: with
`createImageBitmap` failing, the live site made 180,000 decode calls in 13 s, froze the tab and
showed only black. Measured on Chrome 154 by fault injection (scratchpad `fault_check.cjs`,
`lock_check.cjs`): with the fix, a broken decoder still draws the film through `<img>`, and blocked
or non-image frames stop after 2 tries each.

**Observability:** each kind of failure logs one `[film] ...` console warning, and
`window.__filmStatus` reports the decoder in use, frames fetched and decoded, failures and the last
error. It holds no user data.

## Security
Static, same-origin public assets only (the canvas is never tainted). No user data. The dev-only
`window.__filmClock` hook is stripped from production builds (`import.meta.env.DEV`).

## Runbook
- **The film is black for someone:** in their browser console, look for `[film]` warnings and read
  `__filmStatus`. `failedFetches` points at the network (an extension, a firewall, a wrong path);
  `failedDecodes` at the files; `decoder: 'img'` with frames drawing means the fallback worked;
  `contextLost` at the graphics process. Zero everywhere with a black canvas: check
  `prefers-reduced-motion` and Save-Data (still mode) and whether anything paints over the canvas.
- **Re-encode the film:** `python scripts/pick-film-frames.py media-src/film-v4-4k.mp4`, then
  `python scripts/encode-film.py media-src/film-v4-4k.mp4`, and check the printed
  sizes against the budgets. To cut size, lower `K` (frames kept) in pick-film-frames.py before
  lowering quality; film.ts reads the new frame list, nothing else changes. Encode into a new folder
  (cache, see Loading).
- **Move a cue:** pick the film moment from the events list, set `data-beat`, then verify the
  element is on screen when it fires (walk the page, record T and the element's rect per step).
- **Change a section's height:** knots follow the layout automatically; re-check its cues.
- **Tune readability:** first move the text to its section's dark side (the frame map) and make sure
  it is full cream; then extend that knot's grade `reach` (if the grade fades out before the text
  column), or raise its `strength` or `dim`, for the rendition that failed; re-run the pixel contrast
  scan at both sizes, at 0.1 viewport steps or finer (the film changes between samples; a 0.75-step
  scan once reported 0 failures where a fine one found 25). No panels behind text (Murci's brief).
