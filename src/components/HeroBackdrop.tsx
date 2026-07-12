import { Suspense, lazy, useEffect, useState } from 'react';

const HeroEarth = lazy(() => import('./HeroEarth'));

function Moon() {
  return (
    <div className="absolute inset-0 flex items-start justify-end pr-0 sm:pr-4 lg:pr-8 xl:pr-12 pt-24 lg:pt-28">
      <img
        src="/moon.jpg"
        alt=""
        className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[650px] xl:max-w-[750px] h-auto object-contain opacity-50"
        style={{
          mixBlendMode: 'screen',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
        }}
      />
    </div>
  );
}

export default function HeroBackdrop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mobile / low-end: the lightweight moon image (no WebGL, no 3D bundle).
  if (!isDesktop) return <Moon />;

  // Desktop: the 3D Earth, with the moon as the loading poster.
  return (
    <Suspense fallback={<Moon />}>
      <HeroEarth />
    </Suspense>
  );
}
