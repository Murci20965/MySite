import { useEffect, useRef } from 'react';

export default function RotatingMoon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = '/earth.png';
    img.onload = () => {
      imageRef.current = img;
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawEarth = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      if (imageRef.current) {
        const centerX = width * 0.65;
        const centerY = height * 0.5;
        const radius = Math.min(width, height) * 0.25;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationRef.current);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(
          imageRef.current,
          -radius,
          -radius,
          radius * 2,
          radius * 2
        );

        ctx.restore();

        const glowGradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius * 1.3);
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        glowGradient.addColorStop(0.7, 'rgba(100, 200, 255, 0.15)');
        glowGradient.addColorStop(1, 'rgba(100, 150, 255, 0.25)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      rotationRef.current += 0.0003;
      requestAnimationFrame(drawEarth);
    };

    drawEarth();

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
