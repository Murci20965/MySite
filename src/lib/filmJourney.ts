/* Where the film is, for every scroll position.
 *
 * The page is a timeline of knots. Each knot pins a film time T (see
 * lib/film.ts) to a scroll position: the moment a section's top (plus `f` of
 * its height) reaches the focus line in the middle of the viewport. Between
 * knots, T and the veil move linearly, so the film plays forward as you
 * scroll down and backward as you scroll up. Positions are measured from the
 * live layout, so the timeline holds at any screen size.
 *
 * The knots are placed from the clips' measured events (seconds in comments)
 * so that each section's content reaches the focus line as its moment plays.
 * Text that must land ON an event carries data-beat="mN:fraction".
 */

export interface FilmKnot {
  /** a section id, or the page's start/end */
  at: string;
  /** fraction of the section's height below its top (default 0) */
  f?: number;
  /** film time at this knot */
  T: number;
  /** strength of the veil between film and page, 0 (none) to 1 (opaque) */
  dim: number;
}

export const FOCUS = 0.5;

export const KNOTS: FilmKnot[] = [
  // Veil strengths are measured, not chosen: each reading section is set to
  // the lowest dim at which every text box passed WCAG AA against the real
  // pixels under it (pixel contrast scan, both themes, desktop and phone).
  // The film is strongest at the four peaks: hero, ship, classroom, planet.
  { at: 'start', T: 0.0, dim: 0.32 }, // M1 0 s: the night desk (the hero adds a side scrim)
  { at: 'about', T: 0.5, dim: 0.72 }, // M1 5 s: glyphs start on the laptop screen
  { at: 'experience', T: 1.56, dim: 0.8 }, // M2 5.6 s: the light, just before it bursts
  // A second knot near the top keeps the burst on the heading even where the
  // section is tall (phones: 4,300 px); the network then grows over the roles.
  { at: 'experience', f: 0.12, T: 1.7, dim: 0.8 }, // M2 7 s: the network forming
  { at: 'opensource', T: 2.0, dim: 0.66 }, // M3 0 s: the network, about to crystallise
  { at: 'stats', T: 3.4, dim: 0.74 }, // M4 4 s: through the gate of light
  // Stats' last labels are still on screen here, over M5's brightest aisle.
  { at: 'vision', T: 4.0, dim: 0.68 }, // M5 0 s: the bright aisle
  { at: 'vision', f: 0.62, T: 4.85, dim: 0.3 }, // M5 8.5 s: the classroom, held to the end
  { at: 'skills', T: 5.0, dim: 0.8 }, // M6 0 s: a room at night
  { at: 'education', T: 5.2, dim: 0.8 }, // M6 2 s: the skylight
  { at: 'reviews', T: 5.38, dim: 0.8 }, // M6 3.8 s: dusk over the city
  { at: 'faq', T: 5.55, dim: 0.8 }, // M6 5.5 s: the city lights
  { at: 'contact', T: 5.72, dim: 0.62 }, // M6 7 s: rising into orbit
  { at: 'end', T: 6.0, dim: 0.62 }, // M6 10 s: arcs across the globe (phones read the contact links over them)
];

/** In light mode the veil is paper, and it needs more body to carry ink text. */
export function veilAlpha(dim: number, theme: 'dark' | 'light'): number {
  return theme === 'light' ? Math.min(0.9, 0.48 + dim * 0.55) : dim;
}

type Listener = (T: number) => void;

/**
 * The film's clock, for components that move with it (the Vision title, the
 * Stats counters). FilmStage writes it on every update; `on` is false when
 * the film is not scrubbing (reduced motion, Save-Data), and listeners then
 * show their final state.
 */
export const filmClock = {
  T: 0,
  on: false,
  listeners: new Set<Listener>(),
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.T);
    return () => {
      this.listeners.delete(fn);
    };
  },
  set(T: number) {
    this.T = T;
    this.listeners.forEach((fn) => fn(T));
  },
};

// Development only (stripped from production builds): lets headless checks
// read the film time to verify that text cues land on their moments.
if (import.meta.env.DEV) {
  (window as Window & { __filmClock?: typeof filmClock }).__filmClock = filmClock;
}
