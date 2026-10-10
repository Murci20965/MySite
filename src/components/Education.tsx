import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

/* Chapter 08, Education: the globe, the arcs starting to fan out (16.2-17.6 s). The steps sit in
 * the open space above the Earth's edge, top left (storyboard v1).
 * Source of truth: the CV, word for word.
 */
const EDUCATION = [
  { institution: 'ALX / ExploreAI Academy', years: 'Jun 2023 - Sep 2024', programmes: ['Data Science'] },
  { institution: 'DynamicDNA ICT Academy', years: 'May 2023 - Aug 2024', programmes: ['Systems Development, NQF Level 4'] },
  {
    institution: 'University of the Witwatersrand',
    years: '2015 - 2019',
    programmes: ['BSc in Biological Science (incomplete)', 'BSc in Mechanical Engineering (incomplete)'],
  },
];

// The CV's certification list, in its order.
const CERTIFICATIONS = [
  { issuer: 'DataCamp', title: 'Associate AI Engineer for Developers' },
  { issuer: 'Microsoft', title: 'Azure Fundamentals (AZ-900)' },
  { issuer: 'Microsoft', title: 'Microsoft 365 Certified' },
  { issuer: 'Udacity', title: 'Introducing Generative AI with AWS' },
  { issuer: 'ALX / ExploreAI', title: 'AI Career Essentials' },
  { issuer: '365 Data Science', title: 'Credit Risk Modelling in Python & Machine Learning' },
];

const CURRENTLY_LEARNING = [
  { topic: 'XR & WebXR', focus: 'Interactive 3D learning experiences with React Three Fiber and WebXR' },
  { topic: 'Agentic AI systems', focus: 'Multi-agent orchestration, tool use and evaluation for production reliability' },
  { topic: 'Local model serving', focus: 'Self-hosted LLMs and image models for cost-free, offline-tolerant inference' },
];

const PLACE: Place = { wide: { x: 0.05, y: 0.06, w: 0.44 }, tall: { y: 0.09 } };
const WIDE_PLACE: Place = { wide: { x: 0.05, y: 0.06, w: 0.52 }, tall: { y: 0.09 } };
const STEPS = EDUCATION.length + 2;

export default function Education() {
  return (
    <Scene id="education" n="08" name="Education" stepVh={75} pool>
      {EDUCATION.map((edu, i) => (
        <Step key={edu.institution} place={PLACE}>
          <StepLabel n="08" name="Education" i={i} of={STEPS} />
          <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{edu.years}</div>
          <h3 className="mt-2 font-display text-3xl font-medium leading-[1.06] tracking-[-0.02em] text-fg lg:text-4xl">
            {edu.institution}
          </h3>
          {edu.programmes.map((p) => (
            <p key={p} className="mt-2 font-sans text-base text-fg lg:text-lg">
              {p}
            </p>
          ))}
        </Step>
      ))}
      <Step place={WIDE_PLACE}>
        <StepLabel n="08" name="Certifications" i={EDUCATION.length} of={STEPS} />
        <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {CERTIFICATIONS.map((c) => (
            <li key={c.title}>
              <div className="font-display text-lg font-medium leading-snug text-fg">{c.title}</div>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-fg">{c.issuer}</div>
            </li>
          ))}
        </ul>
      </Step>
      <Step place={WIDE_PLACE}>
        <StepLabel n="08" name="Currently learning" i={EDUCATION.length + 1} of={STEPS} />
        <ul className="mt-4 space-y-3">
          {CURRENTLY_LEARNING.map((item) => (
            <li key={item.topic}>
              <span className="font-display text-xl font-medium text-fg">{item.topic}</span>
              <span className="font-sans text-base text-fg"> · {item.focus}</span>
            </li>
          ))}
        </ul>
      </Step>
    </Scene>
  );
}
