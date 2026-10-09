/* Where the film is, and how it is lit, for every scroll position.
 *
 * The page is a timeline of knots. Each knot pins a film time T (see
 * lib/film.ts) to a scroll position: the moment a section's top (plus `f` of
 * its height) reaches the focus line in the middle of the viewport. Between
 * knots, T and the lighting move linearly, so the film plays forward as you
 * scroll down and backward as you scroll up. Positions are measured from the
 * live layout, so the timeline holds at any screen size.
 *
 * The film is the front of the site (Murci, 2026-10-07), so the lighting is
 * art-directed, not a blanket veil: a light uniform `dim`, plus a soft
 * one-sided `grade` on the side where that section's text sits. The sides come
 * from a measured frame map (where each section's frames are darkest and
 * calmest): desktop text sits in the dark side zones, phones (a centre crop)
 * in the top and bottom bands. Strengths are then tuned with a pixel contrast
 * scan. Text that must land ON a film event carries data-beat="mN:fraction".
 */

import { FILM_SECONDS } from './film';

/** Where the grade darkens the frame. 'sides' = left and right, 'ends' = top and bottom. */
export type GradeSide = 'none' | 'left' | 'right' | 'top' | 'bottom' | 'sides' | 'ends';

export interface Look {
  /** uniform veil over the whole frame, 0 (none) to 1 (opaque) */
  dim: number;
  /** the side darkened for the text */
  grade: GradeSide;
  /** opacity of the grade at the frame edge (it fades to 0 toward the subject) */
  strength: number;
  /** how far a one-sided grade reaches across the frame (fraction, default 0.62). A text column
   *  that starts near the middle (the right-column sections) needs a longer reach to be covered. */
  reach?: number;
}

export interface FilmKnot {
  /** a section id, or the page's start/end */
  at: string;
  /** fraction of the section's height below its top (default 0), measured at the focus line */
  f?: number;
  /** for a staged scene (Scene.tsx): pin T to the scroll position where the scene starts ('top',
   *  its first step arriving) or ends ('bottom', its last step gone), instead of the focus line */
  edge?: 'top' | 'bottom';
  /** film time at this knot, in seconds */
  T: number;
  /** landscape screens (the full frame) */
  wide: Look;
  /** portrait screens (the centre crop) */
  tall: Look;
}

export const FOCUS = 0.5;

const L = (dim: number, grade: GradeSide, strength: number, reach?: number): Look =>
  reach === undefined ? { dim, grade, strength } : { dim, grade, strength, reach };

export const KNOTS: FilmKnot[] = [
  // Film v4, T in seconds (lib/film.ts). Windows follow the approved storyboard; the looks are the
  // previous film's, carried over until each section's reveal layout lands and is re-measured.
  // 0-3 s: the desk; the camera starts toward the monitor.
  { at: 'start', T: 0.0, wide: L(0.04, 'left', 0.78), tall: L(0.26, 'ends', 0.62) },
  // 3-5 s: the monitor fills the frame and the camera passes through the screen.
  { at: 'about', T: 3.0, wide: L(0.1, 'left', 0.74), tall: L(0.38, 'ends', 0.55) },
  // 5-7.6 s: the light field, the darkest and calmest stretch of the film.
  { at: 'experience', T: 5.0, wide: L(0.44, 'left', 0.88), tall: L(0.66, 'ends', 0.6) },
  { at: 'experience', f: 0.12, T: 5.4, wide: L(0.44, 'left', 0.88), tall: L(0.66, 'ends', 0.6) },
  { at: 'experience', f: 0.9, T: 7.4, wide: L(0.44, 'left', 0.88), tall: L(0.66, 'ends', 0.6) }, // hold
  // 7.6-9.2 s: threads of light stream in from the left.
  { at: 'opensource', T: 7.6, wide: L(0.3, 'top', 0.9), tall: L(0.34, 'top', 0.75) },
  // 9.2-10.2 s: the threads gather into the warm glow.
  { at: 'stats', T: 9.2, wide: L(0.06, 'sides', 0.58), tall: L(0.56, 'ends', 0.6) },
  // 10.2-11.2 s: through the glow, the city appears below an open sky.
  { at: 'vision', T: 10.2, wide: L(0.1, 'top', 0.75, 0.35), tall: L(0.24, 'top', 1) },
  { at: 'vision', f: 0.62, T: 11.0, wide: L(0.06, 'bottom', 0.6), tall: L(0.2, 'bottom', 0.62) },
  // 11.2-13.6 s: over the city grid, the camera slows.
  { at: 'skills', T: 11.2, wide: L(0.28, 'right', 0.88, 0.85), tall: L(0.62, 'ends', 0.55) },
  { at: 'skills', f: 0.85, T: 13.6, wide: L(0.28, 'right', 0.88, 0.85), tall: L(0.62, 'ends', 0.55) }, // hold
  // 13.6-16.2 s: the rise to orbit, the fastest stretch, crossed in a short scroll (no text there).
  // 16.2-20.4 s: the globe, the arcs fanning out.
  { at: 'education', T: 16.2, wide: L(0.18, 'right', 0.84, 0.85), tall: L(0.52, 'ends', 0.55) },
  { at: 'principles', T: 17.6, wide: L(0.26, 'right', 0.88, 0.85), tall: L(0.52, 'ends', 0.55) },
  { at: 'faq', T: 19.0, wide: L(0.33, 'right', 0.9, 0.85), tall: L(0.66, 'ends', 0.55) },
  { at: 'faq', f: 0.85, T: 20.2, wide: L(0.33, 'right', 0.9, 0.85), tall: L(0.66, 'ends', 0.55) }, // hold
  // 20.4-21 s: the globe settles; contact and footer as they were.
  { at: 'contact', T: 20.4, wide: L(0.46, 'ends', 0.84), tall: L(0.6, 'ends', 0.65) },
  { at: 'end', T: FILM_SECONDS, wide: L(0.46, 'ends', 0.84), tall: L(0.6, 'ends', 0.65) },
];

type Listener = (T: number) => void;

/**
 * The film's clock, for components that move with it (the Vision title, the
 * Stats counters). FilmStage writes it on every update with the SMOOTHED film
 * time; `on` is false when the film is not scrubbing (reduced motion,
 * Save-Data), and listeners then show their final state.
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
