import { useEffect, useRef } from 'react';
import { CLIPS, FILM_END, frameUrl, loadOrder, parseBeat, RENDITION_WIDTH } from '../lib/film';
import type { Rendition } from '../lib/film';
import { filmClock, FOCUS, KNOTS, veilAlpha } from '../lib/filmJourney';
import { currentTheme, THEME_EVENT } from '../lib/theme';

/** Clip-to-clip dissolve, as a fraction of the incoming clip (0.06 = 0.6 s). */
const CROSSFADE = 0.06;
/** A beat that has fired stays until the film is this far before it again. */
const BEAT_HYSTERESIS = 0.04;
const MAX_IN_FLIGHT = 4;

type Beat = { el: Element; T: number; on: boolean };

/**
 * The film as the site's background: one fixed full-screen canvas behind
 * every section. Scroll position maps to film time through lib/filmJourney's
 * knots; the frame on screen is a blend of the two nearest frames, clips
 * dissolve into each other, and a veil (black, or paper in light mode) is
 * drawn over it so text stays readable.
 *
 * It also runs the text cues: any element with data-beat="mN:fraction" gets
 * .is-beat while the film is at or past that moment. The cues hide text only
 * once this component has started (html[data-film="on"]), so if it never
 * runs, everything is simply visible.
 *
 * Frames load coarse-to-fine for the clip on screen first, then its
 * neighbours; until a frame arrives the nearest loaded one is drawn. Reduced
 * motion or Save-Data: one still per knot, no scrubbing, no cues.
 */
export default function FilmStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;
    const root = document.documentElement;

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const still = Boolean(conn?.saveData) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rendition: Rendition = window.innerWidth >= window.innerHeight ? 'wide' : 'tall';
    let frames: Array<Array<HTMLImageElement | undefined>> = CLIPS.map((c) => new Array(c.count));
    let veilRgb = '';
    let theme = currentTheme();
    const readVeil = () => {
      theme = currentTheme();
      const rgb = getComputedStyle(root).getPropertyValue('--c-bg').trim() || '10 10 10';
      veilRgb = rgb.split(/\s+/).join(',');
    };
    readVeil();

    // ---- Timeline: knot scroll positions from the live layout ----
    let positions: number[] = [];
    const measure = () => {
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      let prev = -Infinity;
      positions = KNOTS.map((k) => {
        let y: number;
        if (k.at === 'start') y = 0;
        else if (k.at === 'end') y = maxScroll;
        else {
          const el = document.getElementById(k.at);
          if (!el) y = prev;
          else {
            const top = el.getBoundingClientRect().top + window.scrollY;
            y = top + (k.f ?? 0) * el.offsetHeight - FOCUS * window.innerHeight;
          }
        }
        y = Math.max(y, prev + 1); // keep the timeline strictly increasing
        prev = y;
        return y;
      });
    };

    const at = (y: number): { T: number; dim: number; knot: number } => {
      const last = KNOTS.length - 1;
      if (y <= positions[0]) return { T: KNOTS[0].T, dim: KNOTS[0].dim, knot: 0 };
      if (y >= positions[last]) return { T: KNOTS[last].T, dim: KNOTS[last].dim, knot: last };
      let i = 0;
      while (i < last - 1 && y >= positions[i + 1]) i++;
      const t = (y - positions[i]) / (positions[i + 1] - positions[i]);
      if (still) return { T: KNOTS[i].T, dim: KNOTS[i].dim, knot: i };
      return {
        T: KNOTS[i].T + (KNOTS[i + 1].T - KNOTS[i].T) * t,
        dim: KNOTS[i].dim + (KNOTS[i + 1].dim - KNOTS[i].dim) * t,
        knot: i,
      };
    };

    const split = (T: number) => {
      const c = Math.min(FILM_END - 1, Math.floor(T));
      return { c, f: Math.min(1, T - c) };
    };

    // ---- Loading ----
    let lastClip = -1; // the clip whose frames are queued
    let queue: Array<[number, number]> = [];
    let inFlight = 0;
    let started = false; // full loading waits for the page's load event
    let anyLoaded = false; // before that, only the first frame (the poster)
    let disposed = false;
    const wanted = new Set<string>();

    const enqueueAround = (T: number) => {
      const { c, f } = split(T);
      const list: Array<[number, number]> = [];
      if (still) {
        // The still for each knot the visitor reaches.
        const i = Math.round(f * (CLIPS[c].count - 1));
        list.push([c, i]);
      } else {
        const clips = [c, c + 1, c - 1].filter((k) => k >= 0 && k < CLIPS.length);
        for (const k of clips) for (const i of loadOrder(CLIPS[k].count)) list.push([k, i]);
      }
      queue = list.filter(([k, i]) => !frames[k][i] && !wanted.has(`${k}:${i}`));
      pump();
    };

    const pump = () => {
      while (!disposed && queue.length && inFlight < (started ? MAX_IN_FLIGHT : 1)) {
        if (!started && anyLoaded) return;
        const [k, i] = queue.shift()!;
        const key = `${k}:${i}`;
        if (frames[k][i] || wanted.has(key)) continue;
        wanted.add(key);
        inFlight++;
        const img = new Image();
        img.decoding = 'async';
        const forRendition = rendition;
        img.onload = () => {
          inFlight--;
          wanted.delete(key);
          if (disposed || forRendition !== rendition) return;
          frames[k][i] = img;
          anyLoaded = true;
          dirty = true;
          schedule();
          pump();
        };
        img.onerror = () => {
          inFlight--;
          wanted.delete(key);
          pump();
        };
        img.src = frameUrl(CLIPS[k], rendition, i);
      }
    };

    // ---- Drawing ----
    let dirty = true;
    let lastKey = '';
    const nearest = (k: number, i: number) => {
      const list = frames[k];
      for (let d = 0; d < list.length; d++) {
        if (list[i - d]) return list[i - d];
        if (list[i + d]) return list[i + d];
      }
      return undefined;
    };
    const cover = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const draw = (T: number, dim: number) => {
      const { c, f } = split(T);
      const count = CLIPS[c].count;
      const x = f * (count - 1);
      const i0 = Math.floor(x);
      const a = still ? 0 : x - i0;

      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgb(${veilRgb})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const base = nearest(c, i0);
      if (!still && c > 0 && f < CROSSFADE) {
        // Dissolve from the previous clip's last frame into this one.
        const prev = nearest(c - 1, CLIPS[c - 1].count - 1);
        if (prev) cover(prev, 1);
        if (base) cover(base, prev ? f / CROSSFADE : 1);
      } else if (base) {
        cover(base, 1);
        const next = frames[c][i0 + 1];
        if (a > 0.02 && next) cover(next, a);
      }

      ctx.globalAlpha = veilAlpha(dim, theme);
      ctx.fillStyle = `rgb(${veilRgb})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    };

    // ---- Text cues ----
    let beats: Beat[] = [];
    const collectBeats = () => {
      beats = Array.from(document.querySelectorAll('[data-beat]'))
        .map((el) => ({ el, T: parseBeat(el.getAttribute('data-beat') ?? ''), on: el.classList.contains('is-beat') }))
        .filter((b) => !Number.isNaN(b.T));
    };
    const runBeats = (T: number) => {
      for (const b of beats) {
        const on = b.on ? T >= b.T - BEAT_HYSTERESIS : T >= b.T;
        if (on !== b.on) {
          b.on = on;
          b.el.classList.toggle('is-beat', on);
        }
      }
    };

    // ---- Sizing ----
    const resize = () => {
      const next: Rendition = window.innerWidth >= window.innerHeight ? 'wide' : 'tall';
      if (next !== rendition) {
        rendition = next;
        frames = CLIPS.map((c) => new Array(c.count));
        wanted.clear();
        queue = [];
        lastClip = -1; // re-queue the clip on screen in the new rendition
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cssW = canvas.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || window.innerHeight;
      const w = Math.min(Math.round(cssW * dpr), Math.round(RENDITION_WIDTH[rendition] * 1.25));
      const h = Math.round(w * (cssH / Math.max(1, cssW)));
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w;
        canvas.height = h;
      }
      dirty = true;
      measure();
    };

    // ---- The loop ----
    let raf = 0;
    const update = () => {
      raf = 0;
      measure(); // one batched layout read per frame we actually run
      const { T, dim } = at(window.scrollY);
      const { c } = split(T);
      if (c !== lastClip) {
        lastClip = c;
        enqueueAround(T);
      } else if (still) enqueueAround(T);
      const key = `${T.toFixed(4)}|${dim.toFixed(3)}|${theme}|${canvas.width}x${canvas.height}`;
      if (dirty || key !== lastKey) {
        draw(T, dim);
        lastKey = key;
        dirty = false;
      }
      if (!still) {
        runBeats(T);
        if (T !== filmClock.T) filmClock.set(T);
      }
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    const onLoad = () => {
      started = true;
      collectBeats();
      pump();
      schedule();
    };
    const onTheme = () => {
      readVeil();
      dirty = true;
      schedule();
    };
    const onResize = () => {
      resize();
      collectBeats();
      schedule();
    };

    resize();
    collectBeats();
    if (!still) {
      filmClock.on = true;
      root.dataset.film = 'on';
    }
    update();
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener(THEME_EVENT, onTheme);
    // Sections settle as fonts land and late content mounts.
    const settle = window.setTimeout(onResize, 1500);

    return () => {
      disposed = true;
      filmClock.on = false;
      delete root.dataset.film;
      window.clearTimeout(settle);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      window.removeEventListener(THEME_EVENT, onTheme);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="t-film-stage pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] w-full"
    />
  );
}
