import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

/* Chapter 09, Principles: one at a time, top right above the Earth's edge, mirrored from Education
 * (17.6-19.0 s, storyboard v1). Murci's own standards, set as type, not quotes or testimonials.
 */
const PRINCIPLES = [
  {
    title: 'Measure, don’t guess',
    area: 'How I debug',
    text: 'If a claim matters, I verify it against the source before building on it. Assumptions are where systems quietly break, so evidence comes first and action second.',
  },
  {
    title: 'Docs are part of done',
    area: 'How I ship',
    text: 'Documentation ships in the same change as the code. Stale docs are a defect, not a chore. The next engineer should never have to reverse-engineer intent.',
  },
  {
    title: 'Secure by default',
    area: 'How I build',
    text: 'Secrets out of code, least privilege, input validation from day one. Security is a property of the design, not a patch applied at the end.',
  },
  {
    title: 'Honest reporting',
    area: 'How I communicate',
    text: 'If tests fail or a step was skipped, I say so plainly. An honest status report beats a green façade every time, especially under deadline pressure.',
  },
  {
    title: 'Proven over clever',
    area: 'How I choose tools',
    text: 'For anything that must run in production, boring and well-supported beats bleeding-edge. I save the experiments for clearly-labelled experiments.',
  },
  {
    title: 'Learning in public',
    area: 'How I grow',
    text: 'Everything I build outside work is open on GitHub from the first commit. Showing the process, rough edges included, is how skills compound.',
  },
];

const PLACE: Place = { wide: { x: 0.95, y: 0.06, w: 0.4, align: 'right' }, tall: { y: 0.09 } };

export default function Principles() {
  return (
    <Scene id="principles" n="09" name="Principles" stepVh={70} pool>
      {PRINCIPLES.map((p, i) => (
        <Step key={p.title} place={PLACE}>
          <div className="lg:flex lg:flex-col lg:items-end lg:text-right">
            <StepLabel n="09" name={p.area} i={i} of={PRINCIPLES.length} />
            <h3 className="mt-4 font-display text-3xl font-medium leading-[1.06] tracking-[-0.02em] text-fg lg:text-4xl">
              {p.title}
            </h3>
            <p className="mt-3 font-sans text-base leading-relaxed text-fg lg:text-lg">{p.text}</p>
          </div>
        </Step>
      ))}
    </Scene>
  );
}
