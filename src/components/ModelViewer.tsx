import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei';

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

type Props = {
  path: string;
};

/**
 * Real-time GLB viewer for project cards. Loaded lazily (three.js is heavy),
 * one instance open at a time (WebGL contexts are scarce on low-end devices).
 * Bounds+Center frame any model regardless of its authored scale.
 */
export default function ModelViewer({ path }: Props) {
  return (
    <div className="relative h-full w-full bg-[#0b0b0b]">
      <Canvas camera={{ position: [2.4, 1.6, 2.4], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 2]} intensity={1.4} />
        <directionalLight position={[-3, -2, -2]} intensity={0.4} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.15}>
            <Center>
              <Model path={path} />
            </Center>
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
      <span className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
        Drag to orbit &middot; scroll to zoom
      </span>
    </div>
  );
}
