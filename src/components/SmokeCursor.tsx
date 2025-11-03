import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  life: number;
}

export default function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const createParticle = () => {
      const particle: Particle = {
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        size: Math.random() * 8 + 4,
        alpha: 0.6,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 1,
      };
      particlesRef.current.push(particle);
    };

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (deltaTime < 50) {
        createParticle();
      }

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.size *= 1.02;
        particle.alpha *= 0.96;
        particle.life -= 0.01;

        if (particle.life <= 0 || particle.alpha < 0.01) {
          return false;
        }

        ctx.save();
        ctx.globalAlpha = particle.alpha;

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.4)');
        gradient.addColorStop(1, 'rgba(150, 150, 150, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
