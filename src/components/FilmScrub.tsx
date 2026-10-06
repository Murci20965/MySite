import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { frameUrl, loadOrder, RENDITIONS, WIDE_QUERY } from '../lib/film';
import type { FilmClip } from '../lib/film';

export type ScrubMode = 'pin' | 'pass' | 'still';

type Props = {
  clip: FilmClip;
  /**
   * pin: progress runs while `track` (taller than the viewport, its content
   * sticky) scrolls past. pass: progress runs while the canvas travels from
   * where it first appears to near the top of the viewport. still: the first
   * frame only (reduced motion, Save-Data).
   */
  mode: ScrubMode;
  track?: RefObject<HTMLElement>;
  /** What the film shows, for screen readers (the canvas is role="img"). */
  label: string;
  /** Called with 0..1 when progress changes, for a timeline bar. */
  onProgress?: (progress: number) => void;
};

const MAX_IN_FLIGHT = 4;

/**
 * Scroll-scrubbed film: a frame sequence drawn on a canvas, cover-fit. Frames
 * load coarse-to-fine after the page has loaded (the first frame at once, as
 * the poster); until a frame arrives, the nearest loaded one is drawn. Scroll
 * work is rAF-throttled and skipped while the film is off screen.
 *
 * Why not <video> with currentTime: seeking a normally encoded video decodes
 * forward from the previous keyframe, which stutters (worst on iOS Safari).
 * Separate frames seek instantly. Contract and budgets: .claude/docs/film.md.
 */
export default function FilmScrub({ clip, mode, track, label, onProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Latest callback without re-running the effect when the parent re-renders.
  const progressCb = useRef(onProgress);
  useEffect(() => {
    progressCb.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const width = window.matchMedia(WIDE_QUERY).matches ? RENDITIONS.wide : RENDITIONS.narrow;
    const frames: Array<HTMLImageElement | undefined> = new Array(clip.count);
    let target = 0;
    let drawn = -1;
    let lastProgress = -1;
    let visible = true;
    let raf = 0;
    let disposed = false;

    const nearest = (i: number) => {
      for (let d = 0; d < clip.count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    const paint = (force = false) => {
      const i = nearest(target);
      if (i < 0 || (i === drawn && !force)) return;
      const img = frames[i]!;
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      drawn = i;
    };

    // Scroll range in document pixels, measured on every update we run
    // (offsets move as fonts land and sections resize; one batched read).
    const range = (): [number, number] => {
      const el = mode === 'pin' && track?.current ? track.current : canvas;
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      if (el !== canvas) return [top, top + r.height - window.innerHeight];
      return [Math.max(0, top - window.innerHeight), top - window.innerHeight * 0.1];
    };

    const update = () => {
      raf = 0;
      if (mode === 'still' || !visible) return;
      const [s0, s1] = range();
      const p = s1 > s0 ? Math.min(1, Math.max(0, (window.scrollY - s0) / (s1 - s0))) : 0;
      target = Math.round(p * (clip.count - 1));
      if (p !== lastProgress) {
        lastProgress = p;
        progressCb.current?.(p);
      }
      paint();
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    // Backing store follows the box, capped at the rendition's width (more
    // pixels than the source adds nothing but memory).
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.min(Math.round(canvas.clientWidth * dpr), width);
      const ch = Math.round(cw * (canvas.clientHeight / Math.max(1, canvas.clientWidth)));
      if (cw > 0 && ch > 0 && (cw !== canvas.width || ch !== canvas.height)) {
        canvas.width = cw;
        canvas.height = ch;
        paint(true);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(mode === 'pin' && track?.current ? track.current : canvas);

    // Loading: the poster first, the rest once the page itself has loaded.
    const order = mode === 'still' ? [0] : loadOrder(clip.count);
    let next = 0;
    let inFlight = 0;
    let restAllowed = false;
    const pump = () => {
      const limit = restAllowed ? order.length : 1;
      while (!disposed && inFlight < MAX_IN_FLIGHT && next < limit) {
        const i = order[next++];
        const img = new Image();
        img.decoding = 'async';
        inFlight++;
        img.onload = () => {
          inFlight--;
          if (disposed) return;
          frames[i] = img;
          // Redraw only if this frame is closer to where the scroll is.
          if (drawn < 0 || Math.abs(i - target) < Math.abs(drawn - target)) paint();
          pump();
        };
        img.onerror = () => {
          inFlight--;
          pump();
        };
        img.src = frameUrl(clip, width, i);
      }
    };
    const loadRest = () => {
      restAllowed = true;
      pump();
    };
    pump();
    if (document.readyState === 'complete') loadRest();
    else window.addEventListener('load', loadRest, { once: true });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();

    return () => {
      disposed = true;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('load', loadRest);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [clip, mode, track]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 h-full w-full" />;
}
