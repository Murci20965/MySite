import { Github, Linkedin, Twitter } from 'lucide-react';
import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

// Film 3.0-5.0 s: the monitor fills the frame and the camera passes through the screen. The code
// sits on the left of the editor; its empty right side is the calm space (storyboard v1). Phones:
// the code fills the slice, so the steps sit in the bottom band.
const PLACES: Place[] = [
  { wide: { x: 0.55, y: 0.3, w: 0.36 }, tall: { y: 0.07, from: 'bottom' } },
  { wide: { x: 0.56, y: 0.34, w: 0.35 }, tall: { y: 0.07, from: 'bottom' } },
  { wide: { x: 0.55, y: 0.3, w: 0.36 }, tall: { y: 0.07, from: 'bottom' } },
];

const short = 'font-display text-3xl font-medium leading-[1.12] tracking-[-0.02em] text-fg lg:text-4xl';
const body = 'font-sans text-base leading-relaxed text-fg lg:text-lg';

/**
 * Chapter 02, About: three steps, one short line each in Murci's words (the storyboard's lines),
 * with his full paragraphs, verbatim, behind "Read more".
 */
export default function About() {
  return (
    <Scene id="about" n="02" name="About">
      <Step place={PLACES[0]}>
        <StepLabel n="02" name="Who am I?" i={0} of={3} />
        <p className={`mt-5 ${short}`}>
          I own AI systems end to end, from the <span className="text-accent">data pipeline</span> to deployment.
        </p>
        <details className="step-more mt-6">
          <summary>Read more</summary>
          <div className="step-more-body mt-4 pr-2">
            <p className={body}>
              I&rsquo;m a production-focused AI engineer who owns systems end to end: from{' '}
              <span className="text-accent">data pipeline</span> through{' '}
              <span className="text-accent">model training and inference</span> to deployment, translating
              mathematical concepts into production-grade systems. I also believe learning real skills
              shouldn&rsquo;t depend on where you were born.
            </p>
          </div>
        </details>
      </Step>

      <Step place={PLACES[1]}>
        <StepLabel n="02" name="What I build" i={1} of={3} />
        <p className={`mt-5 ${short}`}>Agentic workflows, RAG, and the MLOps that keeps them honest.</p>
        <details className="step-more mt-6">
          <summary>Read more</summary>
          <div className="step-more-body mt-4 pr-2">
            <p className={body}>
              I design agentic workflows with LangChain, LangGraph and n8n, RAG architectures over vector
              databases, and the end-to-end MLOps that keeps them honest: Python and FastAPI backends,
              Dockerised deployments, CI/CD and automated model evaluation. At Nudle I&rsquo;m engineering XR
              simulation platforms with that stack.
            </p>
          </div>
        </details>
      </Step>

      <Step place={PLACES[2]}>
        <StepLabel n="02" name="What drives me" i={2} of={3} />
        <p className={`mt-5 ${short}`}>
          Learning real skills shouldn&rsquo;t depend on where you were born.
        </p>
        <details className="step-more mt-6">
          <summary>Read more</summary>
          <div className="step-more-body mt-4 pr-2">
            <p className={body}>
              What drives me: traditional education gates real skills behind resources and rigid methods.
              I&rsquo;m building toward seamless XR learning, where anyone, from any background, can practise
              real skills interactively. From Johannesburg, working with teams anywhere.
            </p>
          </div>
        </details>
        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Open to conversations</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/Murci20965"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg transition-colors hover:text-accent"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/960918mokoena"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg transition-colors hover:text-accent"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg transition-colors hover:text-accent"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </Step>
    </Scene>
  );
}
