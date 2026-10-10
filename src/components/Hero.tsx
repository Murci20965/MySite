import { useEffect, useRef } from 'react';
import Kicker from './Kicker';
import { placeBox } from '../lib/stage';
import type { Place } from '../lib/stage';
import { SHADE, shadeLayer } from '../lib/shade';

// Film 0 s, the desk: the name sits on the dark wall left of the lamp, between the window and the
// lamp (measured over the hero's first 1.5 s: p90 brightness 12-17 there, against 50-120 on the
// monitor's editor, and it widens as the camera pushes in and the window leaves the frame). It sat on
// the editor first, where the code behind it made it hard to read (Murci, 2026-10-10). Phones show
// only the middle of the frame (the monitor), so there the name keeps the top, under a deeper shade.
const PLACE: Place = { wide: { x: 0.085, y: 0.37, w: 0.3 }, tall: { y: 0.1 } };

/**
 * Chapter 01, "Prompt": the opening shot. The copy is placed on the film from the first paint and
 * stays put on screen (fixed) while the camera pushes into the monitor, then passes the camera and
 * is gone by half a screen of scroll. Without JavaScript or with reduced motion it is an ordinary
 * first screen.
 */
export default function Hero() {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let box = { x: 0, y: 0, w: 0, h: 0 }; // the copy's placed box, for the shade under it
    const place = () => {
      const b = placeBox(PLACE, window.innerWidth, window.innerHeight);
      el.style.left = `${b.left}px`;
      el.style.width = `${b.width}px`;
      el.style.top = b.top === undefined ? '' : `${b.top}px`;
      el.style.bottom = b.bottom === undefined ? '' : `${b.bottom}px`;
      // On a short window the copy would run into the "Scroll to dive in" cue (its bottom offset is
      // bottom-8 from sm up, bottom-24 on phones): lift it to end clear of the cue, never under the nav.
      if (b.top !== undefined) {
        const clear = window.innerWidth >= 640 ? 88 : 136;
        const maxTop = window.innerHeight - clear - el.offsetHeight;
        if (b.top > maxTop) el.style.top = `${Math.max(80, maxTop)}px`;
      }
      const h = el.offsetHeight;
      const top = el.style.top ? parseFloat(el.style.top) : window.innerHeight - (parseFloat(el.style.bottom) || 0) - h;
      box = { x: b.left, y: top, w: b.width, h };
      if (!reduced) pass();
    };
    const pass = () => {
      raf = 0;
      const k = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.5)));
      el.style.opacity = String(1 - k);
      el.style.transform = `translate3d(0, ${(-16 * k).toFixed(1)}px, 0) scale(${(1 + 0.06 * k).toFixed(4)})`;
      el.style.visibility = k >= 1 ? 'hidden' : '';
      // The shade under the name, painted by the film (lib/shade.ts), passes with it (origin top centre).
      const sc = 1 + 0.06 * k;
      shadeLayer.set(
        'hero',
        k >= 1 ? null : { x: box.x - (box.w * (sc - 1)) / 2, y: box.y - 16 * k, w: box.w * sc, h: box.h * sc, alpha: (1 - k) * SHADE.base }
      );
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(pass);
    };
    place();
    // The display face changes the copy's height when it lands; place again then.
    void document.fonts?.ready.then(place);
    if (!reduced) {
      el.style.position = 'fixed';
      pass();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', place, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', place);
      shadeLayer.set('hero', null);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="hero" className="t-ink relative h-[100svh]">
      <div
        ref={copyRef}
        className="absolute left-6 right-6 top-[14%] z-20 max-w-[34rem] origin-top lg:left-[7%] lg:right-auto lg:top-[37%] lg:w-[30%]"
      >
        <Kicker n="01" name="Prompt" />
        <h1 className="mt-5 font-display text-[clamp(3.25rem,14vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.025em] text-fg lg:text-[clamp(4rem,5.8vw,6.5rem)]">
          Nhlanhla
          <br />
          <span className="font-normal italic">Mokoena</span>
        </h1>
        <p className="mt-5 font-sans text-lg leading-relaxed text-fg lg:text-[1.375rem]">
          AI Engineer · agentic AI, RAG and MLOps
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-24 left-6 z-20 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-fg sm:bottom-8 sm:left-10 lg:left-16 xl:left-24"
      >
        <span className="h-px w-10 bg-fg/60" />
        Scroll to dive in
      </div>
    </section>
  );
}
