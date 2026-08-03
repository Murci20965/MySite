import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, MathUtils, Vector3 } from 'three';
import type { Group, Mesh } from 'three';
import { AFRICA_Y, earthJourney, STATIONS, STATIONS_SM } from '../lib/earthJourney';
import type { EarthStation } from '../lib/earthJourney';

/* The Earth crosses the whole page. Where it sits per section lives in
 * lib/earthJourney (the station timeline); this component reads scroll once,
 * interpolates between the surrounding stations, and damps toward the result.
 * Texture-seam longitude offset for surface markers, tuned with AFRICA_Y.
 */
const LON_OFFSET = 0;
const JOBURG_LAT = MathUtils.degToRad(-26.2);
const JOBURG_LON = MathUtils.degToRad(28.05);

const smooth = (t: number) => t * t * (3 - 2 * t);
const seg = (p: number, a: number, b: number) => smooth(MathUtils.clamp((p - a) / (b - a), 0, 1));

function EarthModel({ baseScale }: { baseScale: number }) {
  const group = useRef<Group>(null);
  const dot = useRef<Mesh>(null);
  const { scene } = useGLTF('/earth.opt.glb');
  const { viewport } = useThree();
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
    // The scroll reader keeps `pose` interpolated between stations; the frame
    // loop only damps toward it, so motion stays smooth at any scroll speed.
    const pose = reduce ? STATIONS[0] : earthJourney.pose;

    const scale = pose.s * baseScale;

    // Hold the globe's left edge clear of the copy. Its on-screen size comes
    // from viewport HEIGHT (fixed vertical fov) while nx is a fraction of
    // WIDTH, so without this a value tuned on a short window overlaps the
    // text on a tall one. Resolved per frame against the measured radius.
    let targetX = pose.nx * viewport.width;
    const clamp = pose.clampLeft ?? 0;
    if (clamp > 0) {
      const minCentre = (clamp - 0.5) * viewport.width + radius * scale;
      targetX = Math.max(targetX, minCentre);
    }

    g.position.x = MathUtils.damp(g.position.x, targetX, 5, delta);
    g.position.y = MathUtils.damp(g.position.y, pose.ny * viewport.height, 5, delta);
    g.scale.setScalar(MathUtils.damp(g.scale.x, scale, 5, delta));

    // Rotation: idle spin until a station asks for a specific facing.
    if (reduce) {
      // static under reduced motion
    } else if (pose.ry === null) {
      g.rotation.y += delta * 0.05;
    } else {
      // damp toward the nearest equivalent angle so it never spins backward
      const twoPi = Math.PI * 2;
      const target = pose.ry + twoPi * Math.round((g.rotation.y - pose.ry) / twoPi);
      g.rotation.y = MathUtils.damp(g.rotation.y, target, 3, delta);
    }

    // The Johannesburg dot is the About beat: it lands, rides, then leaves.
    if (dot.current) {
      const intro = reduce ? 0 : earthJourney.intro;
      const pop = seg(intro, 0.45, 0.62) * (1 - seg(intro, 0.9, 1));
      dot.current.scale.setScalar(Math.max(0.0001, pop));
    }
  });

  return (
    // Starts facing Africa so the first impression is always land, then the
    // hero's idle spin drifts on from there.
    <group ref={group} rotation={[0, AFRICA_Y, 0]}>
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
    const stations = small ? STATIONS_SM : STATIONS;
    let raf = 0;

    // Each station's page offset, measured once per layout change rather than
    // per scroll event, so scrolling never reads layout.
    let anchors: Array<{ st: EarthStation; top: number }> = [];
    const measure = () => {
      anchors = stations
        .map((st) => {
          const el = document.getElementById(st.at);
          return el ? { st, top: el.getBoundingClientRect().top + window.scrollY } : null;
        })
        .filter((a): a is { st: EarthStation; top: number } => a !== null);
    };

    const update = () => {
      raf = 0;
      const el = containerRef.current;
      // Measured every frame we actually run (rAF-throttled): section offsets
      // move as fonts land, images decode and sticky sections resize, and a
      // cached list silently desyncs the whole timeline. One batched read.
      measure();
      if (!el || anchors.length === 0) return;
      // Aim at the viewport's middle so a station takes effect as its section
      // occupies the screen, not when its top edge grazes the fold.
      const focus = window.scrollY + window.innerHeight * 0.5;

      let i = 0;
      while (i < anchors.length - 1 && focus >= anchors[i + 1].top) i++;
      const a = anchors[i];
      const b = anchors[Math.min(i + 1, anchors.length - 1)];
      const span = Math.max(1, b.top - a.top);
      const raw = MathUtils.clamp((focus - a.top) / span, 0, 1);
      const hold = a.st.hold ?? 0;
      const t = reduce ? 0 : smooth(hold >= 1 ? 0 : MathUtils.clamp((raw - hold) / (1 - hold), 0, 1));

      const pose = earthJourney.pose;
      pose.nx = MathUtils.lerp(a.st.nx, b.st.nx, t);
      pose.ny = MathUtils.lerp(a.st.ny, b.st.ny, t);
      pose.s = MathUtils.lerp(a.st.s, b.st.s, t);
      pose.o = MathUtils.lerp(a.st.o, b.st.o, t);
      // 0 means "no clamp", so interpolating in and out of it is safe.
      pose.clampLeft = MathUtils.lerp(a.st.clampLeft ?? 0, b.st.clampLeft ?? 0, t);
      pose.ry = a.st.ry === null && t < 0.5 ? null : (b.st.ry ?? a.st.ry);

      // The About beat (the Johannesburg dot) runs on its own local progress.
      const about = document.getElementById('about');
      if (about) {
        const end = about.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        earthJourney.intro = end > 0 ? MathUtils.clamp(window.scrollY / end, 0, 1) : 0;
      }

      el.style.opacity = String(reduce ? stations[0].o : pose.o);
      // Opaque section backgrounds would paint over a fixed canvas, so the
      // layer lifts above them exactly when a station wants to be seen past
      // the hero, and drops back underneath for the hero/About stretch.
      el.style.zIndex = i >= 2 && pose.o > 0.05 ? '30' : '0';

      // Unmount the WebGL work only while fully hidden, with hysteresis.
      const hidden = pose.o < 0.02;
      if (hidden && !doneRef.current) {
        doneRef.current = true;
        setJourneyDone(true);
      } else if (!hidden && doneRef.current) {
        doneRef.current = false;
        setJourneyDone(false);
      }
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    // Section offsets shift as fonts land and lazy content settles.
    const settle = window.setTimeout(onResize, 1200);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      earthJourney.active = false;
      window.clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [small]);

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
          {/* Lit from near the camera with a slight offset: at the larger hero
              scale a side light left most of the visible hemisphere in night,
              so the planet read as a dark blob. This keeps a terminator for
              depth while the face we actually see stays lit. */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 2.5, 9]} intensity={3} />
          <Suspense fallback={null}>
            <EarthModel baseScale={small ? 0.7 : 1} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

useGLTF.preload('/earth.opt.glb');
