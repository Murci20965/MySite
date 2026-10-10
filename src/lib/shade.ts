/**
 * The shade under the text: soft dark areas the film canvas paints in its own frame (FilmStage),
 * under each step and the hero name. As CSS layers (a blurred box-shadow, then a gradient the size
 * of the shade), every shade was one more translucent layer composited over the film each frame and
 * cost the reference phone 5-8 fps (A/B at 4x CPU, 2026-10-10); painted into the canvas, which
 * redraws every frame anyway, it adds no layer.
 *
 * Publishers (StageDirector, Hero) set a box in viewport CSS pixels and an alpha; the film draws the
 * box with a soft feather around it (see FilmStage, "The shade under the text").
 */
export type Shade = { x: number; y: number; w: number; h: number; alpha: number };

const shades = new Map<string, Shade>();
const listeners = new Set<() => void>();

export const shadeLayer = {
  /** Set or clear one shade (`null`, or an alpha too small to see, clears it). */
  set(id: string, shade: Shade | null) {
    if (shade && shade.alpha > 0.005) shades.set(id, shade);
    else if (!shades.delete(id)) return;
    listeners.forEach((fn) => fn());
  },
  each(fn: (shade: Shade) => void) {
    shades.forEach(fn);
  },
  /** Called whenever a shade changes; returns the unsubscribe. */
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

/** The feather, as a CSS box-shadow would draw it (the look Murci approved): `spread` px of full
 *  shade around the box, then a blur of `blur` px. Phones take a shorter one. */
export const FEATHER = { wide: { spread: 90, blur: 140 }, phone: { spread: 60, blur: 96 } };
/** Strength: every step and the hero name; scenes over the film's brightest frames (data-pool). */
export const SHADE = { base: 0.55, pool: 0.65 };
