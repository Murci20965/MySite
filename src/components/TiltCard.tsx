import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

const MAX = 9; // peak tilt in degrees — kept gentle for a smooth, subtle lean

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Card hover tilt (transitions.dev 19). The pointer is tracked on the flat
 * outer wrapper so the rotating inner card never slips out from under the
 * cursor. Pointer-only and flattened under reduced motion.
 */
export default function TiltCard({ children, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tilt = wrapRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const reset = () => {
      tilt.classList.remove('is-hover');
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
    };

    const track = (e: PointerEvent) => {
      if (reduce.matches) return;
      const r = tilt.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      tilt.classList.add('is-hover');
      card.classList.add('is-tilting');
      card.style.setProperty('--tilt-ry', ((px - 0.5) * MAX).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-rx', ((0.5 - py) * MAX).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--tilt-gy', (py * 100).toFixed(1) + '%');
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        try {
          tilt.setPointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') reset();
    };

    tilt.addEventListener('pointerdown', onDown);
    tilt.addEventListener('pointermove', track);
    tilt.addEventListener('pointerup', reset);
    tilt.addEventListener('pointercancel', reset);
    tilt.addEventListener('pointerleave', onLeave);
    return () => {
      tilt.removeEventListener('pointerdown', onDown);
      tilt.removeEventListener('pointermove', track);
      tilt.removeEventListener('pointerup', reset);
      tilt.removeEventListener('pointercancel', reset);
      tilt.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="t-tilt">
      <div ref={cardRef} className={`t-tilt-card ${className}`}>
        {children}
        <div className="t-tilt-glare" />
      </div>
    </div>
  );
}
