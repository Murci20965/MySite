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
  // Film v4, T in seconds (lib/film.ts). Each staged scene runs its film window from its first step
  // arriving ('top') to its last step gone ('bottom'); windows are contiguous, so the film never
  // jumps between scenes. Windows and placements: storyboard v1 (stage.md). Looks shade the side
  // each scene's steps sit on; the contrast scan tunes them.
  // 0-3 s: the desk; the name sits on the dark wall left of the lamp (shaded from the left), then
  // the camera pushes in. Phones: the top band, deeper (the name sits over the monitor there).
  { at: 'start', T: 0.0, wide: L(0.06, 'left', 0.45, 0.45), tall: L(0.2, 'top', 0.8, 0.5) },
  // 3-5 s: the monitor fills the frame, through the screen. Steps on the editor's empty right side.
  { at: 'about', edge: 'top', T: 3.0, wide: L(0.12, 'right', 0.55, 0.6), tall: L(0.35, 'bottom', 0.7) },
  { at: 'about', edge: 'bottom', T: 5.0, wide: L(0.12, 'right', 0.55, 0.6), tall: L(0.35, 'bottom', 0.7) },
  // 5-7.6 s: the light field, the darkest stretch. Steps on the right.
  { at: 'experience', edge: 'top', T: 5.0, wide: L(0.12, 'right', 0.6, 0.6), tall: L(0.42, 'ends', 0.6) },
  { at: 'experience', edge: 'bottom', T: 7.6, wide: L(0.12, 'right', 0.6, 0.6), tall: L(0.42, 'ends', 0.6) },
  // 7.6-9.2 s: threads stream in from the left. Steps on the open right; phones, the bottom band.
  { at: 'opensource', edge: 'top', T: 7.6, wide: L(0.12, 'right', 0.6, 0.6), tall: L(0.35, 'bottom', 0.8) },
  { at: 'opensource', edge: 'bottom', T: 9.2, wide: L(0.12, 'right', 0.6, 0.6), tall: L(0.35, 'bottom', 0.8) },
  // 9.2-10.2 s: the warm glow. Giant figures top right, clear of it.
  { at: 'stats', edge: 'top', T: 9.2, wide: L(0.1, 'top', 0.5, 0.5), tall: L(0.3, 'top', 0.7) },
  { at: 'stats', edge: 'bottom', T: 10.2, wide: L(0.1, 'top', 0.5, 0.5), tall: L(0.3, 'top', 0.7) },
  // 10.2-11.2 s: through the glow, the city appears below an open sky. Centred in the sky.
  { at: 'vision', edge: 'top', T: 10.2, wide: L(0.08, 'top', 0.55, 0.45), tall: L(0.25, 'top', 0.7) },
  { at: 'vision', edge: 'bottom', T: 11.2, wide: L(0.08, 'top', 0.55, 0.45), tall: L(0.25, 'top', 0.7) },
  // 11.2-13.6 s: over the city grid. The deck in the sky, top left.
  { at: 'skills', edge: 'top', T: 11.2, wide: L(0.08, 'top', 0.55, 0.55), tall: L(0.3, 'top', 0.7) },
  { at: 'skills', edge: 'bottom', T: 13.6, wide: L(0.08, 'top', 0.55, 0.55), tall: L(0.3, 'top', 0.7) },
  // 13.6-16.2 s: the rise to orbit, the fastest stretch: a short, empty scroll (the breather).
  { at: 'breather', edge: 'bottom', T: 16.2, wide: L(0.04, 'none', 0), tall: L(0.15, 'none', 0) },
  // 16.2-20.4 s: the globe, the arcs fanning out. Steps above the Earth's edge, alternating sides.
  { at: 'education', edge: 'top', T: 16.2, wide: L(0.06, 'top', 0.55, 0.35), tall: L(0.25, 'top', 0.7) },
  { at: 'education', edge: 'bottom', T: 17.6, wide: L(0.06, 'top', 0.55, 0.35), tall: L(0.25, 'top', 0.7) },
  { at: 'principles', edge: 'top', T: 17.6, wide: L(0.06, 'top', 0.55, 0.35), tall: L(0.25, 'top', 0.7) },
  { at: 'principles', edge: 'bottom', T: 19.0, wide: L(0.06, 'top', 0.55, 0.35), tall: L(0.25, 'top', 0.7) },
  { at: 'faq', edge: 'top', T: 19.0, wide: L(0.06, 'top', 0.55, 0.35), tall: L(0.25, 'top', 0.7) },
  // During the last question the light turns to Contact's (top and bottom bands), so Contact's
  // first lines rise into shade. FAQ is 6 x 75vh = 4.5 viewports tall at any size, so f 0.844 is
  // 1.2 viewports before its end and f 0.956 is 0.7 before; T keeps the window's even pace.
  { at: 'faq', f: 0.844, T: 20.03, wide: L(0.06, 'top', 0.55, 0.35), tall: L(0.25, 'top', 0.7) },
  { at: 'faq', f: 0.956, T: 20.18, wide: L(0.46, 'ends', 0.84), tall: L(0.66, 'ends', 0.65) },
  { at: 'faq', edge: 'bottom', T: 20.4, wide: L(0.46, 'ends', 0.84), tall: L(0.66, 'ends', 0.65) },
  // 20.4-21 s: the globe settles; contact and footer as they were (normal flow).
  // Halfway into contact, so its look cross-fades in over the section's top, not at one pixel.
  { at: 'contact', f: 0.5, T: 20.7, wide: L(0.46, 'ends', 0.84), tall: L(0.66, 'ends', 0.65) },
  { at: 'end', T: FILM_SECONDS, wide: L(0.46, 'ends', 0.84), tall: L(0.66, 'ends', 0.65) },
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
