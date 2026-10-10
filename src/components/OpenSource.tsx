import { Scene, Step, StepLabel } from './Scene';
import ProjectDiagram from './ProjectDiagram';
import type { DiagramVariant } from './ProjectDiagram';
import type { Place } from '../lib/stage';

type Work = {
  repo: string;
  /** the system diagram the card opens with (ProjectDiagram) */
  diagram: DiagramVariant;
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
    diagram: 'avatar',
    title: 'Avatar-3D Pipeline',
    metric: '14 states · 0.5s crossfade',
    summary:
      'Natural language to 14 deterministic 3D animation states: Groq Llama-3.3-70b under strict Pydantic validation, rendered in Next.js 16 and React Three Fiber.',
    code: 'https://github.com/Murci20965/avatar-pipeline',
    live: 'https://avatar-pipeline.vercel.app',
  },
  {
    repo: 'orbit-3d-pipeline',
    diagram: 'orbit',
    title: 'Orbit-3D Asset Pipeline',
    metric: 'Text + image · Draco GLB',
    summary:
      'Text or image to web-ready 3D: Tripo3D generation, Llama-4 Vision context, and a Dockerised headless Blender engine that centres, scales and Draco-compresses each mesh.',
    code: 'https://github.com/Murci20965/orbit-3d-pipeline',
    live: 'https://orbit-3d-pipeline.vercel.app',
  },
  {
    repo: 'real_estate_price_predictor',
    diagram: 'regression',
    title: 'Real Estate Price Predictor',
    metric: 'R² 0.9037 · RMSE 0.1341',
    summary:
      'XGBoost house-price model behind a FastAPI service, with a GitHub Actions pipeline that tests, builds to Amazon ECR and deploys to Elastic Beanstalk.',
    code: 'https://github.com/Murci20965/real_estate_price_predictor',
  },
  {
    repo: 'medical_image_classifier',
    diagram: 'transfer',
    title: 'Medical Image Classifier',
    metric: '82.85% acc · 0.96 recall',
    summary:
      'Pneumonia detection on chest X-rays with ResNet50 transfer learning, served by FastAPI with a Gradio UI, fully Dockerised.',
    code: 'https://github.com/Murci20965/medical_image_classifier',
  },
  {
    repo: 'cat-dog-classifier',
    diagram: 'vision',
    title: 'Cat vs Dog Classifier',
    metric: 'FastAI CNN · Oxford-IIIT Pet',
    summary:
      'The full MLOps lifecycle on a vision model: a CNN trained with FastAI, served by FastAPI with a Gradio UI, and containerised with Docker.',
    code: 'https://github.com/Murci20965/cat-dog-classifier',
  },
  {
    repo: 'resume-match-ai',
    diagram: 'match',
    title: 'Resume-Match AI',
    metric: 'LLM fit scoring',
    summary: 'Scores how well a resume matches a job posting, turning structured LLM analysis into actionable fit feedback.',
    code: 'https://github.com/Murci20965/resume-match-ai',
  },
  {
    repo: 'smart-spend',
    diagram: 'spend',
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
  tall: { y: 0.12, from: 'bottom' }, // ends above the "Ask Murci" button (its links ran under it)
});

// The links are soft pills on the card (no borders, Murci 2026-10-10): a light tint marks them as
// buttons on the dark glass, and they are 36 px tap targets.
const link =
  'inline-flex min-h-9 items-center rounded-full bg-fg/[0.08] px-4 transition-colors hover:bg-fg/[0.14] hover:text-fg';

/**
 * Chapter 04, Open source: one project at a time, the two live demos first. Each is a card that
 * opens with its system drawn as a diagram, a lime pulse running the pipeline while the card is on
 * screen (Murci's pick, option C of three, 2026-10-09): the idea of each project, no screenshots.
 * The card is dark glass, so its text reads over any frame. Phones keep the description behind
 * "Read more" so the card fits the bottom band.
 */
export default function OpenSource() {
  return (
    <Scene id="opensource" n="04" name="Open source">
      {WORK.map((w, i) => (
        <Step key={w.repo} place={place(i)}>
          <article className="overflow-hidden rounded-[20px] bg-[rgb(10_10_10/0.8)]">
            <div className="relative bg-fg/[0.03] px-3 py-2">
              <ProjectDiagram variant={w.diagram} className="h-[120px] w-full lg:h-[140px]" />
              {w.live && (
                <span className="absolute right-4 top-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Live
                </span>
              )}
            </div>
            <div className="px-5 pb-5 pt-4 lg:px-6">
              <StepLabel n="04" name="Open source" i={i} of={WORK.length} />
              <h3 className="mt-3 font-display text-3xl font-medium leading-[1.06] tracking-[-0.02em] text-fg lg:text-4xl">
                {w.title}
              </h3>
              <div className="mt-2 font-mono text-[12px] uppercase tracking-[0.16em] text-fg">{w.metric}</div>
              <p className="mt-3 hidden font-sans text-base leading-relaxed text-fg sm:block">{w.summary}</p>
              <details className="step-more mt-3 sm:hidden">
                <summary>Read more</summary>
                <div className="step-more-body mt-2 pr-2">
                  <p className="font-sans text-base leading-relaxed text-fg">{w.summary}</p>
                </div>
              </details>
              <div className="mt-4 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {w.live && (
              <a href={w.live} target="_blank" rel="noopener noreferrer" className={link}>
                Live demo ↗
              </a>
            )}
            <a href={w.code} target="_blank" rel="noopener noreferrer" className={link}>
              Code ↗
            </a>
              </div>
            </div>
          </article>
        </Step>
      ))}
    </Scene>
  );
}
