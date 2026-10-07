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
  /** fraction of the section's height below its top (default 0) */
  f?: number;
  /** film time at this knot */
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
  // M1 0 s: the night desk. Copy on the dark window side, the laptop in full light.
  { at: 'start', T: 0.0, wide: L(0.04, 'left', 0.78), tall: L(0.26, 'ends', 0.62) },
  // M1 5 s: glyphs start on the laptop screen. Left third measured darkest.
  { at: 'about', T: 0.5, wide: L(0.1, 'left', 0.74), tall: L(0.38, 'ends', 0.55) },
  // M2 5.6 s: the light, just before it bursts. The network fills the frame,
  // so this is the brightest stretch the text crosses.
  { at: 'experience', T: 1.56, wide: L(0.44, 'left', 0.88), tall: L(0.66, 'ends', 0.6) },
  // A second knot near the top keeps the burst on the heading even where the
  // section is tall (phones: 4,300 px); the network then grows over the roles.
  { at: 'experience', f: 0.12, T: 1.7, wide: L(0.44, 'left', 0.88), tall: L(0.66, 'ends', 0.6) },
  // Hold the reading light to the end of the roles, then ease into the next look.
  { at: 'experience', f: 0.9, T: 1.97, wide: L(0.44, 'left', 0.88), tall: L(0.66, 'ends', 0.6) },
  // M3 0 s: the network crystallises into cubes. Header top-left, cards below.
  { at: 'opensource', T: 2.0, wide: L(0.3, 'top', 0.9), tall: L(0.34, 'top', 0.75) },
  // M4 4 s: through the gate. Numbers flank the bright aisle. On phones the numbers and labels
  // fill the width over the lit racks, so they take a reading veil.
  { at: 'stats', T: 3.4, wide: L(0.06, 'sides', 0.58), tall: L(0.56, 'ends', 0.6) },
  // M5 0 s: the bright aisle; the title sits on its own pool (ExpandMedia). Stats' last row is
  // still leaving at the top of the screen, under the ceiling lights: a short top shade there,
  // the doorway and the title stay fully lit.
  { at: 'vision', T: 4.0, wide: L(0.1, 'top', 0.75, 0.35), tall: L(0.24, 'top', 1) },
  // M5 8.5 s: the classroom, held to the end. The mission copy sits low.
  { at: 'vision', f: 0.62, T: 4.85, wide: L(0.06, 'bottom', 0.6), tall: L(0.2, 'bottom', 0.62) },
  // M6 0 s: a room at night. The right edge measured darkest: the stack goes there. The
  // right-column sections' text starts near the middle, so their grade reaches 0.85 across.
  { at: 'skills', T: 5.0, wide: L(0.28, 'right', 0.88, 0.85), tall: L(0.62, 'ends', 0.55) },
  { at: 'skills', f: 0.85, T: 5.18, wide: L(0.28, 'right', 0.88, 0.85), tall: L(0.62, 'ends', 0.55) }, // hold
  { at: 'education', T: 5.2, wide: L(0.18, 'right', 0.84, 0.85), tall: L(0.52, 'ends', 0.55) }, // M6 2 s: the skylight
  // Principles is long, so its text scrolls through the whole height: a side grade, not a band.
  { at: 'principles', T: 5.38, wide: L(0.26, 'right', 0.88, 0.85), tall: L(0.52, 'ends', 0.55) }, // M6 3.8 s: dusk
  { at: 'faq', T: 5.55, wide: L(0.33, 'right', 0.9, 0.85), tall: L(0.66, 'ends', 0.55) }, // M6 5.5 s: city lights
  { at: 'faq', f: 0.85, T: 5.69, wide: L(0.33, 'right', 0.9, 0.85), tall: L(0.66, 'ends', 0.55) }, // hold
  // M6 7 s: rising into orbit. Heading in the space above, the form below. On phones Contact is
  // a long reading section whose text crosses the arcs' bright hub mid-screen, so it takes a
  // reading veil like Skills' (0.34 and 0.5 failed AA there in a 28 px-step scan).
  { at: 'contact', T: 5.72, wide: L(0.46, 'ends', 0.84), tall: L(0.6, 'ends', 0.65) },
  { at: 'end', T: 6.0, wide: L(0.46, 'ends', 0.84), tall: L(0.6, 'ends', 0.65) }, // M6 10 s: arcs over the globe
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
