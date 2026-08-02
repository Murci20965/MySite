import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, MathUtils, Vector3 } from 'three';
import type { Group, Mesh } from 'three';
import { earthJourney } from '../lib/earthJourney';

/* ---- Journey tuning --------------------------------------------------------
 * The Earth travels as the visitor scrolls: large at the hero, smaller and
 * rotated toward Africa through About, a lime dot lands on Johannesburg,
 * then it docks under the progress hairline and hands over to a DOM orb.
 * Anchors are viewport-relative (x right+, y up+, each in [-0.5, 0.5]).
 */
const PHASE_HERO = { nx: 0.34, ny: 0.05, s: 0.62 };
const PHASE_ABOUT = { nx: 0.38, ny: 0.0, s: 0.42 };
const PHASE_DOCK = { nx: 0.45, ny: 0.46, s: 0.055 };
// Narrow screens: tuck the globe higher and smaller so it never crowds the hero text.
const PHASE_HERO_SM = { nx: 0.2, ny: 0.26, s: 0.4 };
// Y rotation (radians) at which Africa faces the camera — tuned visually.
const AFRICA_Y = 0.55;
// Texture-seam longitude offset for placing surface markers — tuned with AFRICA_Y.
const LON_OFFSET = 0;
const JOBURG_LAT = MathUtils.degToRad(-26.2);
const JOBURG_LON = MathUtils.degToRad(28.05);

const smooth = (t: number) => t * t * (3 - 2 * t);
const seg = (p: number, a: number, b: number) => smooth(MathUtils.clamp((p - a) / (b - a), 0, 1));

function EarthModel({ small }: { small: boolean }) {
  const group = useRef<Group>(null);
  const dot = useRef<Mesh>(null);
  const { scene } = useGLTF('/earth.opt.glb');
  const { viewport } = useThree();
  const hero = small ? PHASE_HERO_SM : PHASE_HERO;
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // World radius of the globe (model units are huge; the primitive is 0.003).
  const radius = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    return (Math.max(size.x, size.y, size.z) / 2) * 0.003;
  }, [scene]);

  // Johannesburg's position on the globe surface, in the rotating group's space.
  const joburg = useMemo(() => {
    const lon = JOBURG_LON + LON_OFFSET;
    return new Vector3(
      Math.cos(JOBURG_LAT) * Math.sin(lon),
      Math.sin(JOBURG_LAT),
      Math.cos(JOBURG_LAT) * Math.cos(lon)
    ).multiplyScalar(radius * 1.02);
  }, [radius]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = reduce ? 0 : earthJourney.p;

    // Position + scale: hero → about (0–0.45), hold (0.45–0.7), → dock (0.7–1).
    const t1 = seg(p, 0, 0.45);
    const t2 = seg(p, 0.7, 1);
    const nx = MathUtils.lerp(MathUtils.lerp(hero.nx, PHASE_ABOUT.nx, t1), PHASE_DOCK.nx, t2);
    const ny = MathUtils.lerp(MathUtils.lerp(hero.ny, PHASE_ABOUT.ny, t1), PHASE_DOCK.ny, t2);
    const s = MathUtils.lerp(MathUtils.lerp(hero.s, PHASE_ABOUT.s, t1), PHASE_DOCK.s, t2);

    g.position.x = MathUtils.damp(g.position.x, nx * viewport.width, 6, delta);
    g.position.y = MathUtils.damp(g.position.y, ny * viewport.height, 6, delta);
    const sc = MathUtils.damp(g.scale.x, s, 6, delta);
    g.scale.setScalar(sc);

    // Rotation: free idle spin at the top, then settle facing Africa.
    if (reduce) {
      // static under reduced motion
    } else if (p < 0.12) {
      g.rotation.y += delta * 0.05;
    } else {
      // damp toward the nearest equivalent of AFRICA_Y so it never spins backward
      const twoPi = Math.PI * 2;
      const target = AFRICA_Y + twoPi * Math.round((g.rotation.y - AFRICA_Y) / twoPi);
      g.rotation.y = MathUtils.damp(g.rotation.y, target, 3, delta);
    }

    // Johannesburg dot pops in mid-About, rides the globe, fades at the dock.
    if (dot.current) {
      const pop = seg(p, 0.5, 0.62) * (1 - seg(p, 0.85, 0.95));
      dot.current.scale.setScalar(Math.max(0.0001, pop));
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={0.003} />
      <mesh ref={dot} position={joburg}>
        <sphereGeometry args={[radius * 0.045, 16, 16]} />
        <meshBasicMaterial color="#a3e635" toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function HeroEarth() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Unmount the WebGL work once the journey completes (with hysteresis so a
  // scroll-up remounts it; useGLTF caches the model, so remounts are cheap).
  const [journeyDone, setJourneyDone] = useState(false);
  const doneRef = useRef(false);
  // Phones get the real Earth too — just cheaper: lower dpr, no antialiasing,
  // and a tucked-away hero pose.
  const [small, setSmall] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = () => setSmall(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // A canvas that mounts while the page has no viewport (hidden tab/pane:
  // innerWidth === 0) locks to the 300x150 default and never re-measures —
  // a loaded but invisible Earth. Gate the mount on a real viewport, then
  // nudge a re-measure once we're in.
  const [sized, setSized] = useState(
    () => typeof window !== 'undefined' && window.innerWidth > 0 && window.innerHeight > 0
  );

  useEffect(() => {
    if (sized) {
      const t = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
      return () => window.clearTimeout(t);
    }
    const check = () => {
      if (window.innerWidth > 0 && window.innerHeight > 0) setSized(true);
    };
    const poll = window.setInterval(check, 400);
    window.addEventListener('resize', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(poll);
      window.removeEventListener('resize', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [sized]);

  useEffect(() => {
    earthJourney.active = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const about = document.getElementById('about');
      const el = containerRef.current;
      if (!about || !el) return;
      const rect = about.getBoundingClientRect();
      const end = rect.bottom + window.scrollY - window.innerHeight;
      const p = end > 0 ? MathUtils.clamp(window.scrollY / end, 0, 1.05) : 0;
      earthJourney.p = reduce ? 0 : p;

      // fade the canvas just before it hands over to the DOM orb
      el.style.opacity = p < 0.94 ? '1' : String(Math.max(0, (1 - p) / 0.06));
      // While the Earth is the hero/About backdrop it sits under all content;
      // for the dock flight it lifts above the opaque section backgrounds
      // (which would otherwise paint over the fixed canvas and hide it).
      el.style.zIndex = p > 0.72 ? '30' : '0';

      if (p >= 1.02 && !doneRef.current) {
        doneRef.current = true;
        setJourneyDone(true);
      } else if (p <= 0.98 && doneRef.current) {
        doneRef.current = false;
        setJourneyDone(false);
      }
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      earthJourney.active = false;
      earthJourney.p = 0;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // Explicit viewport sizing: R3F measures this box for the canvas, and a
    // fixed element with only inset can measure 0 in some layouts (seen live
    // as a 300x150 default canvas — an invisible Earth).
    <div
      ref={containerRef}
      className="pointer-events-none fixed left-0 top-0 z-0 h-[100dvh] w-screen"
      style={{ opacity: 1 }}
    >
      {sized && !journeyDone && (
        <Canvas
          gl={{ alpha: true, antialias: !small }}
          dpr={small ? [1, 1.25] : [1, 1.5]}
          camera={{ position: [0, 0, 8], fov: 42 }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 2, 5]} intensity={2.6} />
          <Suspense fallback={null}>
            <EarthModel small={small} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

useGLTF.preload('/earth.opt.glb');
