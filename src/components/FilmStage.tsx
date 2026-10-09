import { useEffect, useRef } from 'react';
import { FRAME_COUNT, frameAt, frameUrl, nearestFrame, parseBeat, RENDITION_WIDTH } from '../lib/film';
import type { Rendition } from '../lib/film';
import { filmClock, FOCUS, KNOTS } from '../lib/filmJourney';
import type { GradeSide, Look } from '../lib/filmJourney';

/** A beat that has fired stays until the film is this many seconds before it again. */
const BEAT_HYSTERESIS = 0.4;
/**
 * Decoded frames kept each side of the playhead. A decoded 1920 px frame is about 8 MB and a 540 px
 * one about 2 MB, so the window is local: no spine of far frames (with one 315-frame film a spine
 * of every 8th frame would hold ~40 decoded frames, several hundred MB on desktop).
 */
const WINDOW: Record<Rendition, number> = { wide: 8, tall: 12 };
/** Encoded files are fetched up to this many frames ahead of and behind the playhead. */
const HORIZON = 60;
/** A jump larger than this (seconds) snaps instead of easing (a nav click, a restored position). */
const SNAP = 3;
const MAX_FETCHES = 4;
const MAX_DECODES = 2;
/** Before the first scroll, only the opening frames are fetched (data on phones). */
const PRE_SCROLL_FRAMES = 24;

type Beat = { el: Element; T: number; on: boolean };
type Frame = ImageBitmap | HTMLImageElement;
/** `fails` counts failed fetches and decodes; a frame gets MAX_TRIES, then it is skipped. */
type Slot = { blob?: Blob; frame?: Frame; fetching?: boolean; decoding?: boolean; fails?: number };
const MAX_TRIES = 2;

/** What the film is doing, readable from the console (`__filmStatus`) when it does not show. */
const status = {
  decoder: 'bitmap' as 'bitmap' | 'img',
  fetched: 0,
  decoded: 0,
  failedFetches: 0,
  failedDecodes: 0,
  lastError: '',
  contextLost: 0,
};
const warned = new Set<string>();
function fail(kind: string, message: string) {
  status.lastError = message;
  if (warned.has(kind)) return;
  warned.add(kind);
  console.warn(`[film] ${message}`);
}
const errorText = (err: unknown) => (err instanceof Error ? `${err.name}: ${err.message}` : String(err));

let useBitmap = typeof window !== 'undefined' && 'createImageBitmap' in window;
if (!useBitmap) status.decoder = 'img';

async function decodeImg(blob: Blob): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  try {
    await img.decode();
  } catch (err) {
    URL.revokeObjectURL(img.src);
    throw err;
  }
  return img;
}

/**
 * createImageBitmap decodes off the main thread. It can fail where <img> works (memory
 * pressure, some GPU setups): if <img> then decodes the same file, the file is fine and
 * the decoder is not, so every later frame uses <img>. If both fail, the file is bad.
 */
async function decode(blob: Blob): Promise<Frame> {
  if (!useBitmap) return decodeImg(blob);
  try {
    return await createImageBitmap(blob);
  } catch (bitmapErr) {
    const img = await decodeImg(blob);
    useBitmap = false;
    status.decoder = 'img';
    fail('bitmap', `createImageBitmap failed (${errorText(bitmapErr)}); frames now decode with <img>`);
    return img;
  }
}

function release(frame: Frame) {
  if ('close' in frame) frame.close();
  else URL.revokeObjectURL(frame.src);
}

/**
 * The film as the site's background (and its front): one fixed full-screen
 * canvas behind every section. Scroll position maps to film time through
 * lib/filmJourney's knots; the drawn time eases toward it (so wheel notches
 * glide), the two nearest frames are blended,
 * and each section's lighting (a light veil plus a one-sided grade where its
 * text sits) is drawn over the frame.
 *
 * Smoothness: frames are fetched as files and decoded off the main thread
 * (createImageBitmap), only a window around the playhead stays decoded, and
 * section positions are measured when the layout changes, not every frame.
 *
 * Text cues: elements with data-beat="t:seconds" get .is-beat while the film
 * is at or past that moment. Cues hide text only after the visitor's first
 * scroll (html[data-film="on"]), so crawlers and anyone who has not scrolled
 * see all text. Reduced motion or Save-Data: one still per knot, no cues.
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
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const TAU = coarse ? 70 : 110; // ms: how quickly the drawn film catches the scroll

    let rendition: Rendition = window.innerWidth >= window.innerHeight ? 'wide' : 'tall';
    const freshSlots = (): Slot[] => Array.from({ length: FRAME_COUNT }, () => ({}));
    let slots = freshSlots();
    const bg = (getComputedStyle(root).getPropertyValue('--c-bg').trim() || '10 10 10').split(/\s+/).join(',');
    let disposed = false;

    // ---- Timeline: knot scroll positions, measured when the layout changes ----
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

    type Pose = { T: number; a: Look; b: Look; t: number };
    const at = (y: number): Pose => {
      const last = KNOTS.length - 1;
      const look = (i: number) => KNOTS[i][rendition];
      if (y <= positions[0]) return { T: KNOTS[0].T, a: look(0), b: look(0), t: 0 };
      if (y >= positions[last]) return { T: KNOTS[last].T, a: look(last), b: look(last), t: 0 };
      let i = 0;
      while (i < last - 1 && y >= positions[i + 1]) i++;
      const t = (y - positions[i]) / (positions[i + 1] - positions[i]);
      if (still) return { T: KNOTS[i].T, a: look(i), b: look(i), t: 0 };
      return { T: KNOTS[i].T + (KNOTS[i + 1].T - KNOTS[i].T) * t, a: look(i), b: look(i + 1), t };
    };

    // ---- Frames: fetch (network) and decode (off-thread), around the playhead ----
    let started = false; // full fetching waits for the page's load event
    let scrolled = false; // neighbours and the full opening clip wait for a first scroll
    let fetches = 0;
    let decodes = 0;
    let focus = 0;

    /** Fetch order: the playhead outward within HORIZON frames, every 4th frame first, then the rest. */
    const fetchOrder = (): number[] => {
      if (still || !started) return [focus]; // the still, or the poster before the page has loaded
      const lo = scrolled ? Math.max(0, focus - HORIZON) : 0;
      const hi = Math.min(FRAME_COUNT - 1, scrolled ? focus + HORIZON : PRE_SCROLL_FRAMES - 1);
      const idx: number[] = [];
      for (let j = lo; j <= hi; j++) idx.push(j);
      const byDist = (a: number, b: number) => Math.abs(a - focus) - Math.abs(b - focus);
      return [...idx.filter((j) => j % 4 === 0).sort(byDist), ...idx.filter((j) => j % 4 !== 0).sort(byDist)];
    };

    /** Which decoded frames to keep: a window around the playhead. */
    const keep = (j: number) => Math.abs(j - focus) <= WINDOW[rendition];

    const pump = () => {
      if (disposed) return;
      // Evict decoded frames outside the window (the encoded file stays cached in memory).
      slots.forEach((s, j) => {
        if (s.frame && !keep(j)) {
          release(s.frame);
          s.frame = undefined;
        }
      });
      // Decode what the window needs and is already downloaded, nearest first.
      const want: number[] = [];
      for (let d = 0; d <= WINDOW[rendition]; d++) {
        for (const j of d ? [focus - d, focus + d] : [focus]) if (j >= 0 && j < FRAME_COUNT) want.push(j);
      }
      for (const j of want) {
        if (decodes >= MAX_DECODES) break;
        const s = slots[j];
        if (!s.blob || s.frame || s.decoding) continue;
        s.decoding = true;
        decodes++;
        const forRendition = rendition;
        decode(s.blob)
          .then((frame) => {
            if (disposed || forRendition !== rendition || !keep(j)) return release(frame);
            s.frame = frame;
            status.decoded++;
            dirty = true;
            schedule();
          })
          .catch((err) => {
            // A file no decoder can read: drop it so it is fetched again, within the budget.
            s.blob = undefined;
            s.fails = (s.fails ?? 0) + 1;
            status.failedDecodes++;
            fail('decode', `a frame could not be decoded (${errorText(err)})`);
          })
          .finally(() => {
            s.decoding = false;
            decodes--;
            pump();
          });
      }
      // Fetch the next files in priority order.
      for (const j of fetchOrder()) {
        if (fetches >= (started ? MAX_FETCHES : 1)) break;
        const s = slots[j];
        // A frame that failed MAX_TRIES times is skipped; the nearest decoded one is drawn.
        if (s.blob || s.fetching || (s.fails ?? 0) >= MAX_TRIES) continue;
        s.fetching = true;
        fetches++;
        const forRendition = rendition;
        const url = frameUrl(rendition, j);
        fetch(url)
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(`HTTP ${r.status}`))))
          .then((blob) => {
            if (disposed || forRendition !== rendition) return;
            s.blob = blob;
            status.fetched++;
          })
          .catch((err) => {
            s.fails = (s.fails ?? 0) + 1;
            status.failedFetches++;
            fail('fetch', `a frame could not be fetched: ${url} (${errorText(err)})`);
          })
          .finally(() => {
            s.fetching = false;
            fetches--;
            pump();
          });
      }
    };

    // ---- Drawing ----
    let dirty = true;
    let lastKey = '';
    const nearest = (i: number) => {
      for (let d = 0; d < slots.length; d++) {
        if (slots[i - d]?.frame) return slots[i - d].frame;
        if (slots[i + d]?.frame) return slots[i + d].frame;
      }
      return undefined;
    };
    const frameSize = (f: Frame) => ('naturalWidth' in f ? [f.naturalWidth, f.naturalHeight] : [f.width, f.height]);
    const cover = (img: Frame, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const [iw, ih] = frameSize(img);
      const s = Math.max(cw / iw, ch / ih);
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s);
    };

    // Grades: full-strength gradients, cached per size; drawn with globalAlpha = strength.
    const gradients = new Map<string, CanvasGradient[]>();
    const gradesFor = (side: GradeSide, span: number): CanvasGradient[] => {
      const key = `${side}|${span}|${canvas.width}x${canvas.height}`;
      const hit = gradients.get(key);
      if (hit) return hit;
      const w = canvas.width;
      const h = canvas.height;
      const make = (x0: number, y0: number, x1: number, y1: number) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, `rgba(${bg},1)`);
        g.addColorStop(0.45, `rgba(${bg},0.55)`);
        g.addColorStop(1, `rgba(${bg},0)`);
        return g;
      };
      const reach = { x: w * span, y: h * span };
      const list: CanvasGradient[] = [];
      if (side === 'left' || side === 'sides') list.push(make(0, 0, side === 'sides' ? w * 0.38 : reach.x, 0));
      if (side === 'right' || side === 'sides') list.push(make(w, 0, w - (side === 'sides' ? w * 0.38 : reach.x), 0));
      if (side === 'top' || side === 'ends') list.push(make(0, 0, 0, side === 'ends' ? h * 0.42 : reach.y));
      if (side === 'bottom' || side === 'ends') list.push(make(0, h, 0, h - (side === 'ends' ? h * 0.42 : reach.y)));
      gradients.set(key, list);
      return list;
    };
    const lightBy = (look: Look, weight: number) => {
      if (weight <= 0.001) return;
      if (look.dim > 0.005) {
        ctx.globalAlpha = look.dim * weight;
        ctx.fillStyle = `rgb(${bg})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      if (look.grade !== 'none' && look.strength > 0.005) {
        ctx.globalAlpha = look.strength * weight;
        for (const g of gradesFor(look.grade, look.reach ?? 0.62)) {
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    };

    const draw = (T: number, pose: Pose) => {
      const { i, a } = frameAt(T);
      const base = nearest(i);
      if (base) {
        cover(base, 1);
        // Blend toward the next kept frame (frames are spaced by equal motion, so this stays subtle).
        const next = slots[i + 1]?.frame;
        if (!still && a > 0.02 && next) cover(next, a);
      } else fillBg();
      // Lighting: the two knots' looks cross-fade as the scroll moves between them.
      lightBy(pose.a, pose.a === pose.b ? 1 : 1 - pose.t);
      if (pose.a !== pose.b) lightBy(pose.b, pose.t);
      ctx.globalAlpha = 1;
    };
    const fillBg = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgb(${bg})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        slots.forEach((s) => s.frame && release(s.frame));
        slots = freshSlots();
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cssW = canvas.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || window.innerHeight;
      const w = Math.min(Math.round(cssW * dpr), Math.round(RENDITION_WIDTH[rendition] * 1.25));
      const h = Math.round(w * (cssH / Math.max(1, cssW)));
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w;
        canvas.height = h;
        gradients.clear();
      }
      dirty = true;
      measure();
    };

    // ---- The loop: target from scroll, drawn time eases toward it ----
    let raf = 0;
    let drawnT = Number.NaN;
    let lastNow = 0;
    const update = (now: number) => {
      raf = 0;
      const pose = at(window.scrollY);
      const target = pose.T;
      const dt = lastNow ? Math.min(64, now - lastNow) : 16;
      lastNow = now;
      if (still || Number.isNaN(drawnT) || Math.abs(target - drawnT) > SNAP) drawnT = target; // jumps snap
      else drawnT += (target - drawnT) * (1 - Math.exp(-dt / TAU));
      const settling = Math.abs(target - drawnT) > 1e-4;
      if (!settling) drawnT = target;

      const nextFocus = nearestFrame(drawnT);
      if (Math.abs(nextFocus - focus) >= 2) {
        focus = nextFocus;
        pump();
      }
      // The scroll position fixes the lighting; the drawn time fixes the frame.
      const key = `${drawnT.toFixed(4)}|${Math.round(window.scrollY)}|${canvas.width}x${canvas.height}`;
      if (dirty || key !== lastKey) {
        draw(drawnT, pose);
        lastKey = key;
        dirty = false;
      }
      if (!still) {
        runBeats(drawnT);
        if (drawnT !== filmClock.T) filmClock.set(drawnT);
      }
      if (settling) schedule();
      else lastNow = 0;
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    const onScroll = () => {
      if (!scrolled && !still) {
        scrolled = true;
        root.dataset.film = 'on'; // cues start hiding text only once the visitor scrolls
        pump();
      }
      schedule();
    };
    const onLoad = () => {
      started = true;
      collectBeats();
      measure();
      pump();
      schedule();
    };
    const onResize = () => {
      resize();
      collectBeats();
      schedule();
    };

    resize();
    collectBeats();
    if (!still) filmClock.on = true;
    if (window.scrollY > 0) onScroll(); // a deep link or restored position counts as scrolled
    focus = nearestFrame(at(window.scrollY).T);
    pump();
    update(performance.now());
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // Section heights change as fonts land and late content mounts: re-measure then, not per frame.
    const ro = new ResizeObserver(() => {
      measure();
      schedule();
    });
    ro.observe(document.body);
    document.fonts?.ready.then(() => !disposed && onResize());
    // If the browser's graphics process resets, the canvas comes back blank: redraw it.
    const onContextLost = () => {
      status.contextLost++;
      fail('context', 'the film canvas lost its graphics context');
    };
    const onContextRestored = () => {
      gradients.clear();
      dirty = true;
      schedule();
    };
    canvas.addEventListener('contextlost', onContextLost);
    canvas.addEventListener('contextrestored', onContextRestored);
    (window as Window & { __filmStatus?: typeof status }).__filmStatus = status;

    return () => {
      disposed = true;
      filmClock.on = false;
      delete root.dataset.film;
      ro.disconnect();
      canvas.removeEventListener('contextlost', onContextLost);
      canvas.removeEventListener('contextrestored', onContextRestored);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) window.cancelAnimationFrame(raf);
      slots.forEach((s) => s.frame && release(s.frame));
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
