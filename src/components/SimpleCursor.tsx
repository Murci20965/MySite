import { useEffect, useRef } from 'react';

export default function SimpleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
