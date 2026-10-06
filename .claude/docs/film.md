# The film ("Prompt to People") — 2026-10-06

## Purpose
One AI-generated camera journey tells the career story across the page: night desk → into the
laptop screen → agent network → glass cubes ship → data centre → XR classroom → Earth at night.
Each clip is a **chapter** of the site. Concept A and design direction B "Studio" were chosen by
Murci; the clips were generated on his own OpenArt account (the prompts are in his notes, not in
this repo).

## Sources (masters)
`media-src/` is gitignored and holds the masters: keyframes `K0-K6.png` and clips `M1-M6.mp4`
(1280x720, 24 fps, 10 s, 241 frames, no audio). Only encoded outputs are committed.

Known facts about the masters (measured 2026-10-06):
- Each clip starts on its keyframe but does not land on the next one, so the clips do not join
  end to end. That is fine: each clip plays in its own chapter, separated by page content.
- **M6 ends over North America**, with the light arcs leaving the US, not Johannesburg. Murci
  decided to keep it. Copy around the Planet chapter must not say the arcs start in Johannesburg.
- K6 has readable text labels baked in, so it is not used anywhere.

## Architecture
```
media-src/M1.mp4 ──scripts/encode-film.sh m1──> public/film/m1/960/001-121.webp  (desktop)
                                                public/film/m1/640/001-121.webp  (phones/tablets)
src/lib/film.ts      FILM manifest {id, count}, frameUrl(), loadOrder(), WIDE_QUERY
src/components/FilmScrub.tsx   canvas; picks the rendition, loads, maps scroll -> frame, draws
src/components/Hero.tsx        chooses the mode, pins the section, owns the timeline bar
```

Playback is **hybrid** (plan section 5): scroll-scrubbed chapters use frame sequences on a canvas;
the other chapters will use short muted loops. Built so far: **M1 in the hero (chapter 01)**.

### Why frames on a canvas, not `<video>` + `currentTime`
Seeking a normally encoded video decodes forward from the previous keyframe, which stutters on
scroll and is worst on iOS Safari. Separate frames seek instantly. Apple's product pages use the
same technique.

## Contract

`FilmClip = { id: string; count: number }`. Frames live at
`/film/<id>/<width>/<NNN>.webp`, 1-based and zero-padded to three digits, with `width` in
`{960, 640}`. `frameUrl(clip, width, index)` takes a 0-based index.

`<FilmScrub clip mode track? label onProgress? />`
| prop | meaning |
|---|---|
| `mode: 'pin'` | progress 0→1 while `track` scrolls past: from its top reaching the viewport top to its bottom reaching the viewport bottom. The track is taller than the viewport and its content is `position: sticky`. |
| `mode: 'pass'` | progress 0→1 while the canvas travels from where it first appears (or the bottom of the viewport) up to 10% from the top. Used where the hero does not fit one screen. |
| `mode: 'still'` | first frame only, one request. Reduced motion or Save-Data. |
| `label` | the canvas is `role="img"` with this text, saying what the film shows |
| `onProgress(p)` | called only when progress changes; the hero uses it for one `scaleX` on the timeline bar |

### Hero modes (`Hero.tsx`)
- `pin` when `(min-width: 1024px) and (min-height: 600px)` and motion is allowed: the section is
  `200vh` and its stage is `sticky top-0 h-[100dvh]`. The film plays across one screen of scroll,
  then the page moves on.
- `pass` elsewhere (phones, tablets, short windows).
- `still` under `prefers-reduced-motion: reduce` or `navigator.connection.saveData`: no pin, no
  timeline caption, one frame.

**Sticky gotcha:** any ancestor with `overflow: hidden` becomes the scroll container and the pin
silently scrolls away. The Hero + About wrapper in `App.tsx` uses `overflow-clip` for this reason
(measured: before the fix the stage moved with the scroll; after it, the stage stays at top 0
from scroll 0 to 800).

## Data flow (per frame)
scroll event → rAF → one `getBoundingClientRect` on the track or canvas → progress → target frame
→ draw the nearest **loaded** frame, cover-fit, only if it differs from the last one drawn.
An IntersectionObserver (200 px margin) skips the work while the film is off screen. The canvas
backing store follows its box (ResizeObserver), at up to 2x DPR and capped at the rendition width.

## Loading and budgets
- The first frame (the poster) loads at once. The rest wait for the window `load` event, then
  load coarse-to-fine (first, last, every 32nd, 16th, ... 1st) with at most 4 in flight.
  Scrubbing works almost immediately and sharpens as frames arrive.
- Budgets: a chapter is **≤ 2 MB on phones** and **≤ 5 MB on desktop**.
- Measured for M1 (121 frames each): desktop 960 px **2,634 KB**, phones 640 px **1,476 KB**,
  reduced motion **21 KB** (1 request).

## Error handling
A frame that fails to load is skipped, and the nearest loaded frame is drawn instead. If no frame
has loaded, the screen stays the dark `bg-screen`. Nothing throws into React.

## Security
Static public assets only, served same-origin. That is why `getImageData` works in tests (the
canvas is not tainted). No user data is involved.

## Runbook: add a scrub chapter
1. `bash scripts/encode-film.sh m3 media-src/M3.mp4` and check the printed sizes against the
   budgets. To cut size, raise the frame step (third argument) before lowering quality.
2. Add `m3: { id: 'm3', count: <frames> }` to `FILM` in `src/lib/film.ts`.
3. Render `<FilmScrub clip={FILM.m3} mode=... track=... label="..." />` in the chapter. Give its
   section an `overflow` that is not `hidden` on any ancestor if it pins.
4. Verify headless: frames change with scroll, the pin holds, there is one request under reduced
   motion, and the byte totals come from `performance.getEntriesByType('resource')`.
