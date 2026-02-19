import { useEffect, useRef } from 'react';

export default function RotatingMoon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawMoon = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.65;
      const centerY = height * 0.5;
      const radius = Math.min(width, height) * 0.25;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationRef.current);

      const gradient = ctx.createRadialGradient(
        -radius * 0.3,
        -radius * 0.3,
        0,
        0,
        0,
        radius
      );
      gradient.addColorStop(0, '#f0e6d2');
      gradient.addColorStop(0.7, '#d4c5a9');
      gradient.addColorStop(1, '#8b7355');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      const craters = [
        { x: -radius * 0.3, y: -radius * 0.2, r: radius * 0.08 },
        { x: radius * 0.2, y: -radius * 0.4, r: radius * 0.06 },
        { x: radius * 0.3, y: radius * 0.15, r: radius * 0.07 },
        { x: -radius * 0.4, y: radius * 0.3, r: radius * 0.05 },
        { x: -radius * 0.1, y: radius * 0.25, r: radius * 0.04 },
      ];

      craters.forEach((crater) => {
        ctx.beginPath();
        ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      craters.forEach((crater) => {
        ctx.beginPath();
        ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.2);
      glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      glowGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)');
      glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      rotationRef.current += 0.0005;
      requestAnimationFrame(drawMoon);
    };

    drawMoon();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
      }}
    />
  );
}
