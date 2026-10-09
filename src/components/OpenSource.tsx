import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

type Work = {
  repo: string;
  title: string;
  metric: string;
  summary: string;
  code: string;
  live?: string;
};

// Every project is public on GitHub. Facts are checked against each repo's
// code and README (record in .claude/docs/content-truth-map.md).
const WORK: Work[] = [
  {
    repo: 'avatar-pipeline',
    title: 'Avatar-3D Pipeline',
    metric: '14 states · 0.5s crossfade',
    summary:
      'Natural language to 14 deterministic 3D animation states: Groq Llama-3.3-70b under strict Pydantic validation, rendered in Next.js 16 and React Three Fiber.',
    code: 'https://github.com/Murci20965/avatar-pipeline',
    live: 'https://avatar-pipeline.vercel.app',
  },
  {
    repo: 'orbit-3d-pipeline',
    title: 'Orbit-3D Asset Pipeline',
    metric: 'Text + image · Draco GLB',
    summary:
      'Text or image to web-ready 3D: Tripo3D generation, Llama-4 Vision context, and a Dockerised headless Blender engine that centres, scales and Draco-compresses each mesh.',
    code: 'https://github.com/Murci20965/orbit-3d-pipeline',
    live: 'https://orbit-3d-pipeline.vercel.app',
  },
  {
    repo: 'real_estate_price_predictor',
    title: 'Real Estate Price Predictor',
    metric: 'R² 0.9037 · RMSE 0.1341',
    summary:
      'XGBoost house-price model behind a FastAPI service, with a GitHub Actions pipeline that tests, builds to Amazon ECR and deploys to Elastic Beanstalk.',
    code: 'https://github.com/Murci20965/real_estate_price_predictor',
  },
  {
    repo: 'medical_image_classifier',
    title: 'Medical Image Classifier',
    metric: '82.85% acc · 0.96 recall',
    summary:
      'Pneumonia detection on chest X-rays with ResNet50 transfer learning, served by FastAPI with a Gradio UI, fully Dockerised.',
    code: 'https://github.com/Murci20965/medical_image_classifier',
  },
  {
    repo: 'cat-dog-classifier',
    title: 'Cat vs Dog Classifier',
    metric: 'FastAI CNN · Oxford-IIIT Pet',
    summary:
      'The full MLOps lifecycle on a vision model: a CNN trained with FastAI, served by FastAPI with a Gradio UI, and containerised with Docker.',
    code: 'https://github.com/Murci20965/cat-dog-classifier',
  },
  {
    repo: 'resume-match-ai',
    title: 'Resume-Match AI',
    metric: 'LLM fit scoring',
    summary: 'Scores how well a resume matches a job posting, turning structured LLM analysis into actionable fit feedback.',
    code: 'https://github.com/Murci20965/resume-match-ai',
  },
  {
    repo: 'smart-spend',
    title: 'Smart-Spend',
    metric: 'AI auto-categorisation',
    summary:
      'Personal finance manager that categorises bank transactions, learns from user corrections and gives personalised advice.',
    code: 'https://github.com/Murci20965/smart-spend',
  },
];

// Film 7.6-9.2 s: threads of light stream in from the left, the right half stays open (storyboard
// v1). Phones: the threads converge through the middle of the slice, so the bottom band.
const place = (i: number): Place => ({
  wide: { x: 0.58, y: i % 2 ? 0.34 : 0.28, w: 0.34 },
  tall: { y: 0.07, from: 'bottom' },
});

// Small lime text on a moving film can land on one of its bright light orbs (measured 1.87:1 on
// "Code"), so the links sit on the same dark glass as the "Ask Murci" button. Also a 36 px target.
const link =
  'inline-flex min-h-9 items-center rounded-full border border-fg/25 bg-[rgb(10_10_10/0.72)] px-4 transition-colors hover:border-accent/60 hover:text-fg';

/** Chapter 04, Open source: one project at a time, the two live demos first. */
export default function OpenSource() {
  return (
    <Scene id="opensource" n="04" name="Open source">
      {WORK.map((w, i) => (
        <Step key={w.repo} place={place(i)}>
          <StepLabel n="04" name="Open source" i={i} of={WORK.length} />
          {w.live && (
            <div className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Live demo
            </div>
          )}
          <h3 className={`${w.live ? 'mt-3' : 'mt-5'} font-display text-4xl font-medium leading-[1.04] tracking-[-0.02em] text-fg lg:text-5xl`}>
            {w.title}
          </h3>
          <div className="mt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-fg">{w.metric}</div>
          <p className="mt-4 font-sans text-base leading-relaxed text-fg lg:text-lg">{w.summary}</p>
          <div className="mt-5 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {w.live && (
              <a href={w.live} target="_blank" rel="noopener noreferrer" className={link}>
                Live demo ↗
              </a>
            )}
            <a href={w.code} target="_blank" rel="noopener noreferrer" className={link}>
              Code ↗
            </a>
          </div>
        </Step>
      ))}
    </Scene>
  );
}
