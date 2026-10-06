/* The "Prompt to People" film, as frame sequences for the scroll-scrub
 * chapters. Frames are encoded by scripts/encode-film.sh into
 * public/film/<id>/<width>/NNN.webp (1-based, zero-padded). Pipeline and
 * budgets: .claude/docs/film.md.
 */

export interface FilmClip {
  /** folder under public/film */
  id: string;
  /** frames per rendition (every 2nd source frame of a 10 s, 24 fps clip) */
  count: number;
}

/** Desktop rendition on wide screens, the lighter one everywhere else. */
export const WIDE_QUERY = '(min-width: 1024px)';
export const RENDITIONS = { wide: 960, narrow: 640 } as const;

export const FILM = {
  /** Chapter 01: night desk, dolly into the laptop, code becomes streaming light. */
  m1: { id: 'm1', count: 121 },
} satisfies Record<string, FilmClip>;

export function frameUrl(clip: FilmClip, width: number, index: number): string {
  return `/film/${clip.id}/${width}/${String(index + 1).padStart(3, '0')}.webp`;
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
