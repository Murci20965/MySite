import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in" delay>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-white/50">
              Profile
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="t-drift font-mono text-[11px] tracking-[0.28em] uppercase text-white/30">01</span>
          </div>

          <RevealHeading
            text="Who am I?"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-[-0.01em] mb-10 max-w-3xl"
          />

          <p className="font-sans text-xl lg:text-2xl text-white/80 leading-relaxed max-w-3xl mb-10">
            I'm a production-focused AI engineer who owns systems end to end: from{' '}
            <span className="text-white">data pipeline</span> through{' '}
            <span className="text-white">model training and inference</span> to deployment,
            translating mathematical concepts into production-grade systems. I also believe
            learning real skills shouldn't depend on where you were born.
          </p>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl font-sans text-white/60">
            <p className="text-base lg:text-lg leading-relaxed">
              I design <span className="text-white/90">agentic workflows</span> with LangChain,
              LangGraph and n8n, <span className="text-white/90">RAG architectures</span> over vector
              databases, and the <span className="text-white/90">end-to-end MLOps</span> that keeps
              them honest: Python and FastAPI backends, Dockerised deployments, CI/CD and automated
              model evaluation. At Nudle I'm engineering XR simulation platforms with that stack.
            </p>
            <p className="text-base lg:text-lg leading-relaxed">
              What drives me: traditional education gates real skills behind resources and rigid
              methods. I'm building toward seamless XR learning, where anyone, from any background,
              can practise real skills interactively. From Johannesburg, working with teams anywhere.
            </p>
          </div>

          <div className="h-px bg-white/10 my-10 max-w-4xl" />

          <div className="flex flex-wrap items-center justify-between gap-6 max-w-4xl">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-emerald-400/90">
                Open to conversations
              </span>
            </div>

            <div className="flex items-center gap-5">
              <a
                href="https://github.com/Murci20965"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/960918mokoena"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
