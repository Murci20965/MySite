import { useEffect, useRef, useState } from 'react';

// A mouse-only flourish: on touch screens it would sit wherever you last
// tapped, and its blend mode costs an extra full-screen compositing pass on
// phone GPUs, so it renders only with a hovering, fine pointer.
const MOUSE_QUERY = '(hover: hover) and (pointer: fine)';

export default function SimpleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mouse] = useState(() => typeof window !== 'undefined' && window.matchMedia(MOUSE_QUERY).matches);

  useEffect(() => {
    if (!mouse) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouse]);

  if (!mouse) return null;
  return (
    <div
      ref={cursorRef}
      className="fixed w-3 h-3 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
      style={{
        boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(255, 255, 255, 0.4)',
        transition: 'transform 0.05s ease-out'
      }}
    />
  );
}
