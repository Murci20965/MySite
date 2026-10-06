import { useEffect, useRef } from 'react';
import { filmClock } from '../lib/filmJourney';
import { parseBeat } from '../lib/film';

type Props = {
  value: string;
  className?: string;
  /** Pop on a film moment ("m4:0.6") instead of on scrolling into view. */
  beat?: string;
};

/**
 * Number pop-in (transitions.dev 02). Renders each character as its own digit
 * span; when the figure scrolls into view it re-enters with a staggered,
 * blurred bounce. With `beat`, it pops when the film reaches that moment
 * instead (and on scroll-in if the film is not running). Digits stay visible
 * (no pop-in) under reduced motion or without IntersectionObserver.
 */
export default function PopNumber({ value, className = '', beat }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    group.classList.add('is-pending');
    const pop = () => {
      group.classList.remove('is-pending');
      void group.offsetHeight; // force reflow so the animation runs
      group.classList.add('is-animating');
    };

    const at = beat ? parseBeat(beat) : NaN;
    if (filmClock.on && !Number.isNaN(at)) {
      let done = false;
      const unsubscribe = filmClock.subscribe((T) => {
        if (done || T < at) return;
        done = true;
        pop();
      });
      return unsubscribe;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          pop();
          obs.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(group);
    return () => io.disconnect();
  }, [value, beat]);

  const chars = value.split('');
  return (
    <span ref={ref} className={`t-digit-group ${className}`}>
      {chars.map((ch, i) => {
        const stagger =
          i === chars.length - 2 ? '1' : i === chars.length - 1 ? '2' : undefined;
        return (
          <span key={i} className="t-digit" data-stagger={stagger}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}
