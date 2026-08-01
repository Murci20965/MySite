import { Component, Suspense, lazy, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const HeroEarth = lazy(() => import('./HeroEarth'));

// WebGL can fail or lose its context under memory pressure — the backdrop
// then simply yields to the starfield instead of crashing the hero.
class EarthBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroBackdrop() {
  // The Earth chunk is ~877KB of three.js — hold it back until the browser is
  // idle so the hero text always paints first, on every device.
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setIdle(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (!idle) return null;

  return (
    <EarthBoundary>
      <Suspense fallback={null}>
        <HeroEarth />
      </Suspense>
    </EarthBoundary>
  );
}
