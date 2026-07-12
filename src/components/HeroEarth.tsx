import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { Group } from 'three';

function EarthModel() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF('/earth.opt.glb');
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame((_, delta) => {
    if (group.current && !reduce) {
      group.current.rotation.y += delta * 0.05; // gentle spin
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={0.003} />
    </group>
  );
}

export default function HeroEarth() {
  return (
    <div className="absolute inset-x-0 top-0 h-[100dvh]">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 42 }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 2, 5]} intensity={2.6} />
        <Suspense fallback={null}>
          <EarthModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/earth.opt.glb');
