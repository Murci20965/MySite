import type { ReactNode } from 'react';
import type { Place } from '../lib/stage';

type SceneProps = {
  id: string;
  /** chapter number ("03") and name ("Experience"): the scene's heading for screen readers, and its
   *  visible heading when the scene renders as a normal section */
  n: string;
  name: string;
  /** scroll length of one step, in % of the viewport height */
  stepVh?: number;
  /** 'sequence': one step at a time; 'stack': steps stay and pile up until the scene ends */
  mode?: 'sequence' | 'stack';
  children: ReactNode;
};

/**
 * A chapter whose content appears one step at a time over the film (see lib/stage.ts and
 * StageDirector). The markup is a normal section: it reads top to bottom without JavaScript,
 * before the first scroll and under reduced motion; staged mode turns it into a spacer with the
 * steps on a fixed stage.
 */
export function Scene({ id, n, name, stepVh = 85, mode = 'sequence', children }: SceneProps) {
  return (
    <section id={id} className="scene t-ink" data-step-vh={stepVh} data-mode={mode} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="scene-title">
        <span aria-hidden="true" className="h-px w-8 bg-accent" />
        <span>
          {n} · {name}
        </span>
      </h2>
      <div className="scene-stage">{children}</div>
    </section>
  );
}

/** One step of a scene, placed where its film moment leaves room (storyboard v1). */
export function Step({ place, children }: { place: Place; children: ReactNode }) {
  return (
    <div className="scene-step" data-place={JSON.stringify(place)}>
      {children}
    </div>
  );
}

/** The small label that opens every step: chapter, name and position ("03 · Experience 01 / 03"). */
export function StepLabel({ n, name, i, of }: { n: string; name: string; i: number; of: number }) {
  const pad = (k: number) => String(k).padStart(2, '0');
  return (
    <div className="step-label" aria-hidden="true">
      <span className="h-px w-6 bg-accent" />
      <span>
        {n} · {name}
      </span>
      <span className="text-fg">
        {pad(i + 1)} / {pad(of)}
      </span>
    </div>
  );
}
