/* The "Prompt to People" film: six clips encoded as frame sequences by
 * scripts/encode-film.sh into public/film/<id>/<rendition>/NNN.webp (1-based,
 * zero-padded). FilmStage draws them as the site's full-screen background.
 * Pipeline, contract and budgets: .claude/docs/film.md.
 *
 * Film time T runs 0..6 across the whole film: the integer part is the clip
 * (0 = M1 ... 5 = M6), the fraction is how far through it (0 = 0 s, 1 = 10 s).
 */

export interface FilmClip {
  /** folder under public/film */
  id: string;
  /** frames per rendition (every 3rd source frame of a 10 s, 24 fps clip) */
  count: number;
}

export const CLIPS: FilmClip[] = [
  { id: 'm1', count: 81 }, // night desk, dolly into the laptop, glyph waterfall
  { id: 'm2', count: 81 }, // glyph rain, a point of light, burst (6 s), agent network
  { id: 'm3', count: 81 }, // network crystallises into glass cubes (2 s), sideways track
  { id: 'm4', count: 81 }, // cubes pass a gate of light (3-5 s) into a data-centre aisle
  { id: 'm5', count: 81 }, // bright aisle, golden doorway (5-7 s), XR classroom (8 s)
  { id: 'm6', count: 81 }, // night room, skylight, dusk city, orbit, arcs over the globe
];
export const FILM_END = CLIPS.length;

/** wide: the full 1280x720 frame; tall: a 432x720 centre crop for portrait screens. */
export type Rendition = 'wide' | 'tall';
export const RENDITION_WIDTH: Record<Rendition, number> = { wide: 1280, tall: 432 };

export function frameUrl(clip: FilmClip, rendition: Rendition, index: number): string {
  return `/film/${clip.id}/${rendition}/${String(index + 1).padStart(3, '0')}.webp`;
}

/**
 * Coarse-to-fine load order: the first and last frames, then every 32nd,
 * 16th, ... 1st. Scrubbing works almost at once (the nearest loaded frame is
 * drawn) and sharpens as the rest arrive.
 */
export function loadOrder(count: number): number[] {
  const seen = new Uint8Array(count);
  const order: number[] = [];
  const push = (i: number) => {
    if (!seen[i]) {
      seen[i] = 1;
      order.push(i);
    }
  };
  push(0);
  push(count - 1);
  for (let step = 32; step >= 1; step >>= 1) {
    for (let i = 0; i < count; i += step) push(i);
  }
  return order;
}

/** "m2:0.6" (clip id, fraction through it) -> film time 1.6. NaN if malformed. */
export function parseBeat(beat: string): number {
  const m = /^m([1-6]):(0(?:\.\d+)?|1(?:\.0+)?)$/.exec(beat.trim());
  return m ? Number(m[1]) - 1 + Number(m[2]) : NaN;
}
