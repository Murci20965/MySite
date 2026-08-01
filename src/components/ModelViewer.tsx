import { Component, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei';

/**
 * WebGL can die under memory pressure (context loss) — on low-end devices
 * that must degrade to a quiet notice, never a crashed card.
 */
class ViewerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#0b0b0b] px-6 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            3D unavailable on this device &mdash; tap &ldquo;View image&rdquo;
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      <ViewerBoundary>
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
      </ViewerBoundary>
      <span className="pointer-events-none absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
        Drag to orbit &middot; scroll to zoom
      </span>
    </div>
  );
}
