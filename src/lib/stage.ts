/* The reveal stage: how a section's content appears one step at a time over the film.
 *
 * Staged mode (html[data-film="on"], set on the visitor's first scroll, never under reduced motion
 * or Save-Data): each `.scene` becomes an invisible spacer whose height is its number of steps times
 * a step's scroll length, and its content sits on a fixed stage over the film. Nothing scrolls up
 * the screen: steps arrive, hold and pass in place while the film moves forward, so scrolling feels
 * like going in, not down. Without JavaScript, before the first scroll (what crawlers see) and
 * under reduced motion, every scene renders as a normal readable section.
 *
 * Each step is placed where its film moment leaves dark, open space (storyboard v1). Wide screens
 * place it in FRAME coordinates, converted through the same cover fit the canvas uses, so it stays
 * on that part of the picture at any window shape. Phones (a centred vertical slice) place it in
 * viewport coordinates.
 */

/** The film frame's aspect (public/film/v4/wide is 1920x1072). */
export const FRAME_ASPECT = 1920 / 1072;

export type Align = 'left' | 'right' | 'center';

/** Wide screens: x and y are fractions of the film frame; x is the box's left, right or centre edge
 *  (by `align`) and y its top; w is its width as a fraction of the frame width. */
export interface WidePlace {
  x: number;
  y: number;
  w: number;
  align?: Align;
}

/** Phones: y is a fraction of the viewport height, measured from the top (or from the bottom). */
export interface TallPlace {
  y: number;
  from?: 'top' | 'bottom';
}

export interface Place {
  wide: WidePlace;
  tall: TallPlace;
}

export interface Box {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
}

const MARGIN = 24;

/** Where a placement lands in a vw x vh viewport (px). */
export function placeBox(place: Place, vw: number, vh: number): Box {
  if (vw < vh) {
    const width = vw - 2 * MARGIN;
    const { y, from = 'top' } = place.tall;
    return from === 'top' ? { left: MARGIN, width, top: y * vh } : { left: MARGIN, width, bottom: y * vh };
  }
  // The canvas covers the viewport with the frame, centred: scale to the larger ratio, crop the rest.
  const s = Math.max(vw / FRAME_ASPECT, vh);
  const offX = (vw - FRAME_ASPECT * s) / 2;
  const offY = (vh - s) / 2;
  const { x, y, w, align = 'left' } = place.wide;
  const width = Math.min(Math.max(w * FRAME_ASPECT * s, Math.min(320, vw - 2 * MARGIN)), 620);
  const px = offX + x * FRAME_ASPECT * s;
  let left = align === 'left' ? px : align === 'right' ? px - width : px - width / 2;
  left = Math.min(Math.max(left, MARGIN), vw - MARGIN - width);
  return { left, width, top: Math.max(MARGIN + 56, offY + y * s) };
}

/** How a step looks at t, its position in step units (0 = fully in, 1 = gone): it arrives from a
 *  little depth, holds, then passes the camera. `accumulate` steps stay until the scene ends. */
export interface Look {
  opacity: number;
  scale: number;
  y: number;
}

const ENTER: [number, number] = [-0.2, 0.12];
const EXIT: [number, number] = [0.8, 1.0];
const ramp = (t: number, [a, b]: [number, number]) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const ease = (k: number) => 1 - (1 - k) ** 3;

export function stepLook(t: number, accumulate: boolean, lastT: number): Look {
  const inK = ease(ramp(t, ENTER));
  // A stacking step stays on screen and leaves with the scene's last step (lastT is that step's t).
  const outT = accumulate ? lastT : t;
  const outK = ease(ramp(outT, EXIT));
  return {
    opacity: inK * (1 - outK),
    scale: 0.965 + 0.035 * inK + 0.04 * outK,
    y: (1 - inK) * 16 - outK * 12,
  };
}
