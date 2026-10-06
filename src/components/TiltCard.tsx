import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

const MAX_TILT = 5; // degrees of lean at the card's edge: a lean, not a flip
const LIFT_PX = -6; // how far the card rises while hovered
const LIFT_SCALE = 0.015; // and how much it grows

// A damped spring per axis instead of a fixed-duration ease: the card follows
// the pointer with momentum and settles with one small overshoot. Damping
// ratio = DAMPING / (2 * sqrt(STIFFNESS)) = 16 / 26.1 = 0.61. Simulated at
// 30/60/144 fps: 4-8% overshoot (~0.4 deg on a 5 deg lean), settled < 0.9 s.
const STIFFNESS = 170;
const DAMPING = 16;
const REST = 0.0005; // below this, position and velocity count as settled

type Axis = { x: number; v: number; target: number };

function step(a: Axis, dt: number) {
  const accel = -STIFFNESS * (a.x - a.target) - DAMPING * a.v;
  a.v += accel * dt; // semi-implicit Euler: velocity first, then position
  a.x += a.v * dt;
}

const settled = (a: Axis) => Math.abs(a.v) < REST && Math.abs(a.x - a.target) < REST;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Card hover tilt (transitions.dev 19), driven by spring physics. The pointer
 * is tracked on the flat outer wrapper so the rotating inner card never slips
 * out from under the cursor. Only transform and CSS vars are written, and the
 * rAF loop runs only while a spring is moving. Mouse-only: touch keeps native
 * scrolling, and reduced motion leaves the card flat (CSS forces it too).
 */
export default function TiltCard({ children, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const rx: Axis = { x: 0, v: 0, target: 0 };
    const ry: Axis = { x: 0, v: 0, target: 0 };
    const lift: Axis = { x: 0, v: 0, target: 0 };
    const axes = [rx, ry, lift];
    let raf = 0;
    let last = 0;

    const render = () => {
      card.style.setProperty('--tilt-rx', `${(rx.x * MAX_TILT).toFixed(3)}deg`);
      card.style.setProperty('--tilt-ry', `${(ry.x * MAX_TILT).toFixed(3)}deg`);
      card.style.setProperty('--tilt-lift', `${(lift.x * LIFT_PX).toFixed(3)}px`);
      card.style.setProperty('--tilt-scale', (1 + lift.x * LIFT_SCALE).toFixed(4));
    };

    const frame = (now: number) => {
      // Clamp dt: a long frame or a backgrounded tab must not blow up the
      // integration (large steps make an explicit spring explode).
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      axes.forEach((a) => step(a, dt));
      if (axes.every(settled)) {
        axes.forEach((a) => {
          a.x = a.target;
          a.v = 0;
        });
        render();
        raf = 0;
        return;
      }
      render();
      raf = window.requestAnimationFrame(frame);
    };

    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !finePointer.matches || reduce.matches) return;
      const r = wrap.getBoundingClientRect();
      const px = clamp01((e.clientX - r.left) / r.width);
      const py = clamp01((e.clientY - r.top) / r.height);
      ry.target = (px - 0.5) * 2;
      rx.target = (0.5 - py) * 2;
      lift.target = 1;
      wrap.classList.add('is-hover');
      card.style.setProperty('--tilt-gx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--tilt-gy', `${(py * 100).toFixed(1)}%`);
      kick();
    };

    const onLeave = () => {
      rx.target = 0;
      ry.target = 0;
      lift.target = 0;
      wrap.classList.remove('is-hover');
      kick();
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="t-tilt">
      <div ref={cardRef} className={`t-tilt-card ${className}`}>
        {children}
        <div className="t-tilt-glare" />
        <div className="t-tilt-spot" />
      </div>
    </div>
  );
}
