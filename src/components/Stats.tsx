import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

/* Chapter 05, By the numbers: one giant figure at a time, in the top right, clear of the film's
 * warm glow (9.2-10.2 s, storyboard v1). Every number is countable on the page or the CV: the
 * seven projects shown, the CV's three AI roles, the two deployed demos, and the certifications
 * (6 on the CV; "6+" is Murci's word, 2026-10-09, see content-truth-map.md).
 */
const FIGURES = [
  { value: '7', label: 'Open-source projects', note: 'Public from the first commit' },
  { value: '3', label: 'AI roles', note: 'Nudle · Alignerr · Artintel' },
  { value: '2', label: 'Live AI demos', note: 'Try them in the browser' },
  { value: '6+', label: 'Certifications', note: 'Azure · DataCamp · Udacity' },
];

const PLACE: Place = { wide: { x: 0.93, y: 0.13, w: 0.26, align: 'right' }, tall: { y: 0.1 } };

export default function Stats() {
  return (
    <Scene id="stats" n="05" name="By the numbers" stepVh={70}>
      {FIGURES.map((f, i) => (
        <Step key={f.label} place={PLACE}>
          <div className="lg:flex lg:flex-col lg:items-end lg:text-right">
            <StepLabel n="05" name="By the numbers" i={i} of={FIGURES.length} />
            <div className="mt-4 font-display text-[clamp(6rem,24vw,8rem)] font-medium leading-[0.85] tracking-[-0.04em] text-fg lg:text-[clamp(8rem,11vw,10.5rem)]">
              {f.value}
            </div>
            <div className="mt-4 font-sans text-xl font-medium text-fg">{f.label}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-fg">{f.note}</div>
          </div>
        </Step>
      ))}
    </Scene>
  );
}
