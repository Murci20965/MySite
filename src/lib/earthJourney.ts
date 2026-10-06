/* The Earth's journey across the whole page.
 *
 * Sections declare a "station" — where the planet sits, how big it is, and
 * how visible — and the renderer interpolates between the station before and
 * after the current scroll position. Absence is part of the design: opacity 0
 * stations are where content needs silence.
 *
 * Written by HeroEarth's single scroll reader, read per-frame inside R3F.
 * A plain mutable object so scrolling never triggers a React render.
 */

export interface EarthPose {
  /** viewport-relative x, right positive, roughly [-0.5, 0.5] */
  nx: number;
  /** viewport-relative y, up positive */
  ny: number;
  /** scale multiplier on the base model */
  s: number;
  /** 0 hides the canvas entirely at this station */
  o: number;
  /** y rotation target in radians; null keeps the idle spin */
  ry: number | null;
  /**
   * Minimum position of the globe's LEFT edge, as a fraction of viewport
   * width, so it can sit close to the copy without ever covering it.
   *
   * The globe's on-screen size is driven by viewport HEIGHT (the camera's
   * vertical fov is fixed) while `nx` is a fraction of WIDTH, so a single nx
   * that looks right on a short window overlaps the text on a tall one.
   * This clamp is resolved per frame against the real radius. 0 = no clamp.
   */
  clampLeft?: number;
}

export interface EarthStation extends EarthPose {
  /** DOM id the station is anchored to */
  at: string;
  /**
   * Fraction of the gap to the next station that holds this pose before the
   * transition starts (0 = move immediately). Tall pinned sections need it,
   * otherwise the Earth drifts away while the section is still on screen.
   */
  hold?: number;
}

// Africa faces the camera at this y rotation (tuned visually).
export const AFRICA_Y = 0.55;

/**
 * Desktop timeline. Order must match the page's section order.
 *
 * The planet is a companion, not a switch: it swells and recedes rather than
 * blinking on and off. It is absent at the hero, where the Studio laptop owns
 * the right half, and fades in place for About; the Education stretch is the
 * other true zero. Opacity 0 lets the canvas unmount, so reduced motion (which
 * pins the hero pose) shows no planet at all. `hold` parks a pose while a
 * tall or pinned section plays out.
 */
export const STATIONS: EarthStation[] = [
  // The hero pose mirrors About's, so scrolling down is a fade, not a fly-in.
  // hold 0.6 keeps it at zero while the hero fills the screen (the focus line
  // starts at raw 0.5 on a one-screen hero, ~0.42 on a phone's taller one).
  // nx pulls the planet toward the copy; clampLeft stops it at the text edge
  // on any screen, so these two ride as close as they are allowed to.
  { at: 'hero', nx: 0.3, ny: -0.02, s: 0.95, o: 0, ry: AFRICA_Y, hold: 0.6, clampLeft: 0.52 },
  {
    at: 'about',
    nx: 0.3,
    ny: -0.02,
    s: 0.95,
    o: 0.92,
    ry: AFRICA_Y,
    hold: 0.25,
    clampLeft: 0.52,
  },
  { at: 'experience', nx: 0.6, ny: 0.08, s: 0.55, o: 0.42, ry: AFRICA_Y, hold: 0.2 },
  // Pinned filmstrip: park faintly while the strip slides past.
  { at: 'opensource', nx: 0.68, ny: 0.16, s: 0.4, o: 0.14, ry: AFRICA_Y, hold: 0.6 },
  { at: 'stats', nx: 0.6, ny: 0.0, s: 0.5, o: 0.26, ry: AFRICA_Y },
  // Returns as the horizon behind Vision. Sits LOW so the title keeps a clear
  // field, and stays parked while the pinned section plays out.
  { at: 'vision', nx: 0.0, ny: -1.05, s: 1.45, o: 0.6, ry: AFRICA_Y, hold: 0.55 },
  { at: 'skills', nx: -0.3, ny: -0.5, s: 0.7, o: 0.16, ry: AFRICA_Y, hold: 0.3 },
  // The rest: dense reading, no planet.
  { at: 'education', nx: -0.5, ny: 0.25, s: 0.3, o: 0, ry: AFRICA_Y, hold: 0.45 },
  { at: 'reviews', nx: -0.46, ny: 0.24, s: 0.34, o: 0.3, ry: AFRICA_Y, hold: 0.3 },
  { at: 'faq', nx: -0.5, ny: 0.28, s: 0.3, o: 0.16, ry: AFRICA_Y },
  // Large and low behind the form: "from here, for anywhere".
  { at: 'contact', nx: 0.0, ny: -0.72, s: 1.15, o: 0.55, ry: AFRICA_Y, hold: 0.4 },
];

/** Narrow screens: tucked away, smaller, and hidden more often. */
export const STATIONS_SM: EarthStation[] = STATIONS.map((st) => ({
  ...st,
  s: st.s * 0.7,
  o: st.o > 0.6 ? 0.6 : st.o,
}));

export const earthJourney = {
  /** current interpolated pose, written by the scroll reader */
  pose: { ...STATIONS[0] } as EarthPose,
  /** 0..1 progress through the About-anchored intro (the Joburg dot beat) */
  intro: 0,
  /** true while the desktop 3D layer is mounted */
  active: false,
};
