/* The film: one continuous take, from Murci's desk into the screen, through the light, over a city
 * at night and out to the globe (v4, 2026-10-09). The 4K master is in media-src/ (gitignored);
 * scripts/pick-film-frames.py chooses which source frames the site keeps (spaced by equal motion,
 * listed in filmFrames.json) and scripts/encode-film.py encodes them into
 * public/film/v4/<rendition>/NNN.webp (1-based, in kept order). FilmStage draws them on a canvas.
 * Pipeline, contract and budgets: .claude/docs/film.md.
 *
 * Film time T is in SECONDS of the master, 0 .. FILM_SECONDS. Kept frames are not evenly spaced in
 * time (dense where the camera moves fast), so frames are found by time, not by index arithmetic.
 */
import filmFrames from './filmFrames.json';

/** Source frame numbers the site keeps, in order (from scripts/pick-film-frames.py). */
const SOURCE_FRAMES: number[] = filmFrames.frames;

/** The time, in seconds, of each kept frame. */
export const FRAME_TIMES: number[] = SOURCE_FRAMES.map((n) => n / filmFrames.fps);
export const FRAME_COUNT = FRAME_TIMES.length;
export const FILM_SECONDS = FRAME_TIMES[FRAME_COUNT - 1];

/** wide: the full frame, 1920 px wide; tall: a 540x960 vertical slice for portrait screens. */
export type Rendition = 'wide' | 'tall';
export const RENDITION_WIDTH: Record<Rendition, number> = { wide: 1920, tall: 540 };

export function frameUrl(rendition: Rendition, index: number): string {
  return `/film/v4/${rendition}/${String(index + 1).padStart(3, '0')}.webp`;
}

/**
 * The kept frame at or before time T, and how far (0..1) T is toward the next one: the renderer
 * draws frame i and blends frame i + 1 over it by `a`.
 */
export function frameAt(T: number): { i: number; a: number } {
  if (!(T > FRAME_TIMES[0])) return { i: 0, a: 0 };
  if (T >= FILM_SECONDS) return { i: FRAME_COUNT - 1, a: 0 };
  let lo = 0;
  let hi = FRAME_COUNT - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (FRAME_TIMES[mid] <= T) lo = mid;
    else hi = mid;
  }
  return { i: lo, a: (T - FRAME_TIMES[lo]) / (FRAME_TIMES[hi] - FRAME_TIMES[lo]) };
}

/** The kept frame nearest to time T. */
export function nearestFrame(T: number): number {
  const { i, a } = frameAt(T);
  return a > 0.5 ? Math.min(FRAME_COUNT - 1, i + 1) : i;
}

/** "t:6.3" (seconds into the film) -> 6.3. NaN if malformed or outside the film. */
export function parseBeat(beat: string): number {
  const m = /^t:(\d+(?:\.\d+)?)$/.exec(beat.trim());
  const T = m ? Number(m[1]) : NaN;
  return T >= 0 && T <= FILM_SECONDS ? T : NaN;
}
