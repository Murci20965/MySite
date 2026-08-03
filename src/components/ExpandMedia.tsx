import { useEffect, useRef } from 'react';

/* Scroll-expand media (21st.dev pattern, re-engineered): an in-flow sticky
 * section — no wheel hijacking, no forced scroll. As the visitor scrolls
 * through the tall wrapper, the media scales from a card to near-fullscreen,
 * the title words slide apart, and the mission copy fades in. Transform-only
 * per frame; reduced motion renders the fully-expanded state statically.
 */

const MEDIA_SRC = '/media/vision.png';

export default function ExpandMedia() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLHeadingElement>(null);
  const rightRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const apply = (p: number) => {
      if (mediaRef.current) {
        // A letterbox opening vertically: full width throughout, so the
        // section spans the page from the first frame and the reveal is the
        // frame growing rather than a card zooming toward the viewer.
        const inset = (1 - p) * 39;
        mediaRef.current.style.clipPath = `inset(${inset}% 0% ${inset}% 0%)`;
      }
      if (dimRef.current) {
        dimRef.current.style.opacity = String(0.55 - p * 0.35);
      }
      // Clamped so the words separate dramatically but never leave the
      // viewport (42vw pushed "made spatial" off the right edge).
      const spread = Math.min(26, (window.innerWidth * 0.26) / 16);
      if (leftRef.current) {
        leftRef.current.style.transform = `translateX(${-p * spread}vw)`;
      }
      if (rightRef.current) {
        rightRef.current.style.transform = `translateX(${p * spread}vw)`;
      }
      if (copyRef.current) {
        const t = Math.max(0, (p - 0.72) / 0.28);
        copyRef.current.style.opacity = String(t);
        copyRef.current.style.transform = `translateY(${(1 - t) * 24}px)`;
      }
    };

    if (reduce) {
      apply(1);
      return;
    }

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      apply(p);
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
    <section id="vision" className="relative bg-black">
      <div ref={wrapRef} className="relative h-[240vh]">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute top-24 z-40 flex items-center gap-4">
            <span className="h-px w-10 bg-white/20" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Vision
            </span>
            <span className="h-px w-10 bg-white/20" />
          </div>

          <div
            ref={mediaRef}
            className="absolute inset-0 h-full w-full will-change-[clip-path]"
            style={{ clipPath: 'inset(39% 0% 39% 0%)' }}
          >
            <img
              src={MEDIA_SRC}
              alt="A dark planetary horizon with a constellation of connected learning nodes"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div ref={dimRef} className="absolute inset-0 bg-black" style={{ opacity: 0.55 }} />
          </div>

          {/* Legibility scrim: sits above the returning Earth (z-30) and below
              the type (z-40), so the planet reads as atmosphere behind the
              words instead of competing with them. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[35] bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,rgba(0,0,0,0.72),rgba(0,0,0,0.35)_60%,transparent_85%)]"
          />

          {/* z-40 keeps the title above the travelling Earth layer, which
              lifts to z-30 when it returns as this section's horizon. */}
          <div className="pointer-events-none absolute z-40 flex w-full flex-col items-center gap-2 text-center mix-blend-difference">
            <h2
              ref={leftRef}
              className="font-display text-5xl font-medium leading-none tracking-[-0.01em] text-white sm:text-6xl lg:text-7xl"
            >
              Learning,
            </h2>
            <h2
              ref={rightRef}
              className="font-display text-5xl font-medium leading-none tracking-[-0.01em] text-white sm:text-6xl lg:text-7xl"
            >
              made spatial
            </h2>
          </div>

          <div
            ref={copyRef}
            className="pointer-events-none absolute bottom-10 z-40 max-w-2xl px-6 text-center"
            style={{ opacity: 0 }}
          >
            <p className="font-sans text-base leading-relaxed text-white/85 sm:text-lg">
              Traditional education gates real skills behind resources and rigid methods. I&rsquo;m
              building toward XR learning where anyone, anywhere, can practise real skills:
              interactively, spatially, without the gatekeeping.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
