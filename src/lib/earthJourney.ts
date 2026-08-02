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

/** Desktop timeline. Order must match the page's section order. */
export const STATIONS: EarthStation[] = [
  { at: 'hero', nx: 0.36, ny: 0.04, s: 0.9, o: 1, ry: null },
  { at: 'about', nx: 0.38, ny: 0.0, s: 0.55, o: 1, ry: AFRICA_Y },
  { at: 'experience', nx: 0.62, ny: 0.1, s: 0.42, o: 0.5, ry: AFRICA_Y },
  { at: 'projects', nx: 0.7, ny: 0.2, s: 0.3, o: 0, ry: AFRICA_Y },
  { at: 'stats', nx: 0.7, ny: 0.2, s: 0.3, o: 0, ry: AFRICA_Y },
  // Returns as the horizon behind the Vision media, and holds while the
  // pinned section plays out.
  { at: 'vision', nx: 0.0, ny: -0.62, s: 1.5, o: 0.85, ry: AFRICA_Y, hold: 0.6 },
  { at: 'skills', nx: 0.0, ny: -0.9, s: 1.2, o: 0, ry: AFRICA_Y },
  { at: 'blog', nx: -0.55, ny: 0.25, s: 0.3, o: 0, ry: AFRICA_Y },
  { at: 'opensource', nx: -0.55, ny: 0.25, s: 0.3, o: 0, ry: AFRICA_Y },
  { at: 'education', nx: -0.5, ny: 0.3, s: 0.25, o: 0, ry: AFRICA_Y },
  { at: 'reviews', nx: -0.44, ny: 0.3, s: 0.22, o: 0.32, ry: AFRICA_Y },
  { at: 'faq', nx: -0.5, ny: 0.3, s: 0.22, o: 0, ry: AFRICA_Y },
  // Large and low behind the form: "from here, for anywhere".
  { at: 'contact', nx: 0.0, ny: -0.5, s: 1.1, o: 0.55, ry: AFRICA_Y },
];

/** Narrow screens: tucked away, smaller, and hidden more often. */
export const STATIONS_SM: EarthStation[] = STATIONS.map((st) =>
  st.at === 'hero'
    ? { ...st, nx: 0.2, ny: 0.26, s: 0.4 }
    : { ...st, s: st.s * 0.7, o: st.o > 0.6 ? 0.7 : st.o }
);

export const earthJourney = {
  /** current interpolated pose, written by the scroll reader */
  pose: { ...STATIONS[0] } as EarthPose,
  /** 0..1 progress through the About-anchored intro (the Joburg dot beat) */
  intro: 0,
  /** true while the desktop 3D layer is mounted */
  active: false,
};
