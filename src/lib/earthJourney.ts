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
 * blinking on and off. Only the Blog-to-Education stretch drops to true zero,
 * which gives the page one real rest (and lets the canvas unmount there).
 * `hold` parks a pose while a tall or pinned section plays out.
 */
export const STATIONS: EarthStation[] = [
  { at: 'hero', nx: 0.45, ny: 0.02, s: 1.5, o: 1, ry: null, hold: 0.3 },
  { at: 'about', nx: 0.44, ny: -0.02, s: 0.95, o: 0.92, ry: AFRICA_Y, hold: 0.25 },
  { at: 'experience', nx: 0.6, ny: 0.08, s: 0.55, o: 0.42, ry: AFRICA_Y, hold: 0.2 },
  { at: 'projects', nx: 0.68, ny: 0.16, s: 0.4, o: 0.14, ry: AFRICA_Y, hold: 0.35 },
  { at: 'stats', nx: 0.6, ny: 0.0, s: 0.5, o: 0.26, ry: AFRICA_Y },
  // Returns as the horizon behind Vision. Sits LOW so the title keeps a clear
  // field, and stays parked while the pinned section plays out.
  { at: 'vision', nx: 0.0, ny: -1.05, s: 1.45, o: 0.6, ry: AFRICA_Y, hold: 0.55 },
  { at: 'skills', nx: -0.3, ny: -0.5, s: 0.7, o: 0.16, ry: AFRICA_Y, hold: 0.3 },
  // The rest: dense reading, no planet.
  { at: 'blog', nx: -0.55, ny: 0.2, s: 0.35, o: 0, ry: AFRICA_Y },
  { at: 'opensource', nx: -0.55, ny: 0.2, s: 0.35, o: 0, ry: AFRICA_Y },
  { at: 'education', nx: -0.5, ny: 0.25, s: 0.3, o: 0, ry: AFRICA_Y, hold: 0.45 },
  { at: 'reviews', nx: -0.46, ny: 0.24, s: 0.34, o: 0.3, ry: AFRICA_Y, hold: 0.3 },
  { at: 'faq', nx: -0.5, ny: 0.28, s: 0.3, o: 0.16, ry: AFRICA_Y },
  // Large and low behind the form: "from here, for anywhere".
  { at: 'contact', nx: 0.0, ny: -0.72, s: 1.15, o: 0.55, ry: AFRICA_Y, hold: 0.4 },
];

/** Narrow screens: tucked away, smaller, and hidden more often. */
export const STATIONS_SM: EarthStation[] = STATIONS.map((st) =>
  st.at === 'hero'
    ? { ...st, nx: 0.24, ny: 0.3, s: 0.62 }
    : { ...st, s: st.s * 0.7, o: st.o > 0.6 ? 0.6 : st.o }
);

export const earthJourney = {
  /** current interpolated pose, written by the scroll reader */
  pose: { ...STATIONS[0] } as EarthPose,
  /** 0..1 progress through the About-anchored intro (the Joburg dot beat) */
  intro: 0,
  /** true while the desktop 3D layer is mounted */
  active: false,
};
