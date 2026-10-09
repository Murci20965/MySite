import { useEffect, useRef } from 'react';
import Kicker from './Kicker';
import { placeBox } from '../lib/stage';
import type { Place } from '../lib/stage';

// Film 0 s, the desk: the name sits on the monitor's editor, its dark, empty right side (the
// biggest calm area in the frame, measured). Phones: the slice starts centred on the monitor, so
// the name sits on its upper part.
const PLACE: Place = { wide: { x: 0.615, y: 0.17, w: 0.27 }, tall: { y: 0.1 } };

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
    const place = () => {
      const b = placeBox(PLACE, window.innerWidth, window.innerHeight);
      el.style.left = `${b.left}px`;
      el.style.width = `${b.width}px`;
      el.style.top = b.top === undefined ? '' : `${b.top}px`;
      el.style.bottom = b.bottom === undefined ? '' : `${b.bottom}px`;
    };
    const pass = () => {
      raf = 0;
      const k = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.5)));
      el.style.opacity = String(1 - k);
      el.style.transform = `translate3d(0, ${(-16 * k).toFixed(1)}px, 0) scale(${(1 + 0.06 * k).toFixed(4)})`;
      el.style.visibility = k >= 1 ? 'hidden' : '';
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(pass);
    };
    place();
    if (!reduced) {
      el.style.position = 'fixed';
      pass();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', place, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', place);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="hero" className="t-ink relative h-[100svh]">
      <div
        ref={copyRef}
        className="absolute left-6 right-6 top-[14%] z-20 max-w-[34rem] origin-top lg:left-[61%] lg:right-auto lg:top-[17%] lg:w-[27%]"
      >
        <Kicker n="01" name="Prompt" />
        <h1 className="mt-5 font-display text-[clamp(3rem,12vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.025em] text-fg lg:text-[clamp(3.25rem,4.6vw,5rem)]">
          Nhlanhla
          <br />
          <span className="font-normal italic">Mokoena</span>
        </h1>
        <p className="mt-5 font-sans text-base leading-relaxed text-fg lg:text-lg">
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
