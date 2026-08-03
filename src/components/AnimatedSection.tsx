import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Kept for call-site compatibility; the entrance is now one shared behaviour. */
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'slide-in-left' | 'slide-in-right' | 'float';
  delay?: boolean;
}

/**
 * The site's single entrance: content wipes up from under a clip-path as it
 * enters the viewport. Defined once so every section arrives the same way and
 * the whole page can be retuned from one place.
 *
 * It FAILS OPEN by design. This component now gates the visibility of every
 * section, so a missed IntersectionObserver callback would blank the site.
 * Three independent paths reveal content: an observer, an immediate geometry
 * check on mount (covers deep links and restored scroll positions), and a
 * timer backstop.
 */
export default function AnimatedSection({
  children,
  className = '',
  delay = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already on screen (or above it) at mount: reveal without waiting.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setShown(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // threshold 0 so tall blocks reveal on first contact rather than waiting
      // to be a fraction of themselves on screen.
      { threshold: 0, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);

    // Backstop: nothing stays invisible for more than a moment, whatever happens.
    const failOpen = window.setTimeout(() => setShown(true), 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failOpen);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} t-enter ${delay ? 't-enter--delay' : ''} ${shown ? 'is-in' : ''}`}
    >
      {children}
    </div>
  );
}
