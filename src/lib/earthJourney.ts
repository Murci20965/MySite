// Shared scroll state for the Earth's journey (hero → About → Joburg → dock).
// A plain mutable object: written by HeroEarth's scroll handler, read
// per-frame inside R3F and by ScrollProgress's rAF — no React re-renders.
export const earthJourney = {
  // 0 = page top, 1 = journey complete (About scrolled past)
  p: 0,
  // true while the desktop 3D journey is mounted (mobile/moon never sets it)
  active: false,
};
