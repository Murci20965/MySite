import { useEffect, useRef } from 'react';
import { earthJourney } from '../lib/earthJourney';

// Reading-progress hairline + the docked Earth orb the 3D journey hands over
// to. rAF-throttled and transform-only, so scrolling never pays for layout.
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = `scaleX(${p})`;
      orbRef.current?.classList.toggle(
        'is-docked',
        earthJourney.active && earthJourney.p >= 1
      );
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="t-progress" aria-hidden="true">
      <div ref={barRef} className="t-progress-bar" />
      <div ref={orbRef} className="t-earth-orb" />
    </div>
  );
}
