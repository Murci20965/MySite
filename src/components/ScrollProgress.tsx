import { useEffect, useRef } from 'react';

// Reading-progress hairline. rAF-throttled and transform-only, and the page length is measured
// only when it changes (resize, or the body's size via ResizeObserver, which reports after layout),
// never per frame: reading scrollHeight in a frame where the stage has just moved its steps forced a
// style and layout pass every frame (the top self-time on a 4x-slowed phone profile, 2026-10-10).
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    let max = 0;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    const update = () => {
      raf = 0;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="t-progress" aria-hidden="true">
      <div ref={barRef} className="t-progress-bar t-scroll-linked" />
    </div>
  );
}
