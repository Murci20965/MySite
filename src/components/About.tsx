import RevealHeading from './RevealHeading';
import Kicker from './Kicker';
import { Github, Linkedin, Twitter } from 'lucide-react';

/**
 * Chapter 02, About. Behind it the camera reaches the laptop screen and the
 * code becomes a glyph waterfall, bright in the centre of the frame and dark
 * at the edges (measured), so the copy is one column on the left. The film
 * cues land on its moments: glyphs start, the screen fills, a point of light.
 */
export default function About() {
  return (
    <section id="about" className="t-ink relative overflow-hidden pb-16 pt-32 lg:pb-24 lg:pt-44">
      <div className="relative z-10 mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="max-w-[38rem]">
          <Kicker n="02" name="About" />

          <div data-beat="m1:0.55" className="mt-6">
            <RevealHeading
              text="Who am I?"
              className="max-w-3xl font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-fg lg:text-7xl"
            />
          </div>

          <p data-beat="m1:0.7" className="mt-8 font-sans text-xl leading-relaxed text-fg lg:text-2xl">
            I&rsquo;m a production-focused AI engineer who owns systems end to end: from{' '}
            <span className="text-accent">data pipeline</span> through{' '}
            <span className="text-accent">model training and inference</span> to deployment, translating
            mathematical concepts into production-grade systems. I also believe learning real skills
            shouldn&rsquo;t depend on where you were born.
          </p>

          <div data-beat="m1:0.92" className="mt-8 space-y-6 font-sans text-base leading-relaxed text-fg/90 lg:text-lg">
            <p>
              I design agentic workflows with LangChain, LangGraph and n8n, RAG architectures over vector
              databases, and the end-to-end MLOps that keeps them honest: Python and FastAPI backends,
              Dockerised deployments, CI/CD and automated model evaluation. At Nudle I&rsquo;m engineering
              XR simulation platforms with that stack.
            </p>
            <p>
              What drives me: traditional education gates real skills behind resources and rigid methods.
              I&rsquo;m building toward seamless XR learning, where anyone, from any background, can
              practise real skills interactively. From Johannesburg, working with teams anywhere.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Open to conversations
              </span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="https://github.com/Murci20965"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg/80 transition-colors hover:text-fg"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/960918mokoena"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg/80 transition-colors hover:text-fg"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg/80 transition-colors hover:text-fg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
