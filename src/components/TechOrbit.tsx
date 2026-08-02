import { useEffect, useRef } from 'react';

/* Orbiting tech stack (21st.dev pattern, house-adapted): three hairline rings
 * of real stack icons orbit a half-visible particle sphere. Pure CSS keyframe
 * motion (t-orbit-* in index.css); the core is a lightweight 2D canvas — no
 * WebGL, no dependencies. Icons live in /public/icons (simple-icons, recolored).
 */

interface OrbitIcon {
  src: string;
  alt: string;
  angle: number;
}

const ORBITS: Array<{ size: string; duration: number; icons: OrbitIcon[] }> = [
  {
    size: 'w-[26rem] h-[26rem] md:w-[38rem] md:h-[38rem]',
    duration: 26,
    icons: [
      { src: '/icons/python.svg', alt: 'Python', angle: -60 },
      { src: '/icons/fastapi.svg', alt: 'FastAPI', angle: 0 },
      { src: '/icons/langchain.svg', alt: 'LangChain', angle: 60 },
    ],
  },
  {
    size: 'w-[35rem] h-[35rem] md:w-[50rem] md:h-[50rem]',
    duration: 34,
    icons: [
      { src: '/icons/pytorch.svg', alt: 'PyTorch', angle: 0 },
      { src: '/icons/docker.svg', alt: 'Docker', angle: -90 },
    ],
  },
  {
    size: 'w-[44rem] h-[44rem] md:w-[62rem] md:h-[62rem]',
    duration: 42,
    icons: [
      { src: '/icons/react.svg', alt: 'React', angle: -60 },
      { src: '/icons/typescript.svg', alt: 'TypeScript', angle: 0 },
      { src: '/icons/threedotjs.svg', alt: 'Three.js', angle: 60 },
    ],
  },
];

// Rotating dot-sphere, orthographically projected; only the top half shows
// (the container clips at the equator, mirroring the 21st.dev composition).
function ParticleCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const DOTS = 620;
    const points: Array<{ theta: number; phi: number }> = [];
    // Fibonacci sphere: evenly distributed, no pole clumping.
    for (let i = 0; i < DOTS; i++) {
      const y = 1 - (i / (DOTS - 1)) * 2;
      points.push({ theta: Math.acos(y), phi: Math.PI * (3 - Math.sqrt(5)) * i });
    }

    let raf = 0;
    let rot = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const r = Math.min(w, h) * 0.48;
      const cx = w / 2;
      const cy = h / 2;
      for (const p of points) {
        const sinT = Math.sin(p.theta);
        const x3 = sinT * Math.cos(p.phi + rot);
        const y3 = Math.cos(p.theta);
        const z3 = sinT * Math.sin(p.phi + rot);
        const depth = (z3 + 1) / 2; // 0 back, 1 front
        ctx.globalAlpha = 0.12 + depth * 0.55;
        ctx.fillStyle = depth > 0.82 ? '#a3e635' : '#ffffff';
        const size = 0.8 + depth * 1.3;
        ctx.fillRect(cx + x3 * r, cy + y3 * r, size, size);
      }
      ctx.globalAlpha = 1;
      if (!reduce) {
        rot += 0.0022;
        raf = requestAnimationFrame(draw);
      }
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

export default function TechOrbit() {
  return (
    <div
      className="relative flex h-[34rem] w-full justify-center overflow-hidden md:h-[44rem]"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-square w-80 -translate-x-1/2 translate-y-1/2 md:w-[38rem]">
        <ParticleCore />
      </div>

      {ORBITS.map((orbit, index) => {
        const cw = index % 2 === 0;
        // mirror every icon to the opposite side so rings feel populated
        const icons = [
          ...orbit.icons,
          ...orbit.icons.map((ic) => ({ ...ic, angle: ic.angle + 180, alt: `${ic.alt}-m` })),
        ];
        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-white/10 ${orbit.size}`}
          >
            {icons.map((icon) => (
              <div
                key={icon.alt}
                className={`t-orbit-spoke ${cw ? 't-orbit-cw' : 't-orbit-ccw'} absolute left-1/2 top-0 -ml-6 flex h-1/2 origin-bottom flex-col items-center justify-start`}
                style={
                  {
                    '--start-angle': `${icon.angle}deg`,
                    '--orbit-dur': `${orbit.duration}s`,
                  } as React.CSSProperties
                }
              >
                <div
                  className={`t-orbit-chip ${cw ? 't-orbit-counter-cw' : 't-orbit-counter-ccw'} relative z-10 -mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black`}
                  style={{ '--counter-offset': `${-icon.angle}deg` } as React.CSSProperties}
                >
                  <img src={icon.src} alt="" width={22} height={22} className="h-[22px] w-[22px]" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
