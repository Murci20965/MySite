import { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import Kicker from './Kicker';

/* Chapter 07, Stack: "from model to classroom". The skills are the CV's own
 * categories, word for word (plus XR & 3D, which the CV lists under its
 * Nudle and project work), drawn as layers that echo the film's glass cubes.
 * Pick a layer (hover, tap or keyboard) and the projects built on it are named
 * underneath. Still by design: the film is the motion here, so the stack only
 * moves when you touch it. It sits on the frame's dark right edge (measured).
 */
type Layer = { name: string; tools: string; projects: string[] };

// Bottom (foundations) to top (the classroom). Projects come from each
// open-source card's real tags.
const LAYERS: Layer[] = [
  { name: 'Data & Libraries', tools: 'Pandas · NumPy · Matplotlib · SQL · ETL pipelines', projects: ['Real Estate Price Predictor', 'Smart-Spend'] },
  {
    name: 'ML & Deep Learning',
    tools: 'PyTorch · Scikit-Learn · Weights & Biases · fine-tuning · inference & evaluation',
    projects: ['Medical Image Classifier', 'Cat vs Dog Classifier', 'Real Estate Price Predictor'],
  },
  {
    name: 'Agentic AI & GenAI',
    tools: 'LangChain · LangGraph · n8n · RAG pipelines · vector databases · multi-agent workflows · Claude & OpenAI APIs',
    projects: ['Avatar-3D Pipeline', 'Orbit-3D Asset Pipeline', 'Resume-Match AI'],
  },
  {
    name: 'Frameworks & Languages',
    tools: 'Python · FastAPI · Next.js · React · Node.js',
    projects: ['Avatar-3D Pipeline', 'Real Estate Price Predictor', 'Medical Image Classifier', 'Smart-Spend'],
  },
  {
    name: 'MLOps & Delivery',
    tools: 'Docker · Git · GitHub Actions CI/CD · end-to-end MLOps pipelines · serverless',
    projects: ['Avatar-3D Pipeline', 'Real Estate Price Predictor', 'Cat vs Dog Classifier', 'Resume-Match AI'],
  },
  {
    name: 'Cloud & Tools',
    tools: 'AWS · Microsoft Azure · Hugging Face Spaces · Render · Vercel',
    projects: ['Avatar-3D Pipeline', 'Orbit-3D Asset Pipeline', 'Real Estate Price Predictor', 'Smart-Spend'],
  },
  {
    name: 'Architecture & Systems',
    tools: 'System design · scalable architecture · microservices',
    projects: ['Orbit-3D Asset Pipeline', 'Avatar-3D Pipeline'],
  },
  { name: 'XR & 3D', tools: 'WebXR · React Three Fiber · headless Blender · TRELLIS', projects: ['Avatar-3D Pipeline', 'Orbit-3D Asset Pipeline'] },
];

export default function Skills() {
  const [active, setActive] = useState<number | null>(null);
  const shown = active === null ? null : LAYERS[active];
  const top = [...LAYERS].reverse(); // drawn classroom-first, foundations last

  return (
    <section id="skills" className="t-ink relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="lg:ml-auto lg:w-[min(42rem,52%)]">
          <AnimatedSection animation="fade-in">
            <Kicker n="07" name="Stack" />
            <RevealHeading
              text="From model to classroom"
              className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-fg lg:text-7xl"
            />
            <p className="mt-6 font-sans text-lg leading-relaxed text-fg/90">
              The stack I own end to end, layer by layer. Pick one to see the projects built on it.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in">
            <ul className="mt-10 space-y-2.5" onMouseLeave={() => setActive(null)}>
              {top.map((layer, i) => {
                const index = LAYERS.length - 1 - i;
                const on = active === index;
                return (
                  <li key={layer.name} style={{ marginLeft: `${Math.min(i, 7) * 0.9}rem` }}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => setActive(on ? null : index)}
                      className="group relative block w-full py-3 pl-6 pr-4 text-left"
                    >
                      {/* The layer itself: a skewed glass slab, lit when picked. */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 -skew-x-[16deg] border transition-[opacity,background-color,border-color] duration-200 ${
                          on ? 'border-accent bg-accent/15' : 'border-accent/40 bg-accent/[0.04] group-hover:border-accent/70'
                        }`}
                      />
                      <span className="relative flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-display text-xl font-medium text-fg lg:text-2xl">{layer.name}</span>
                        <span className="font-sans text-sm leading-snug text-fg/90">{layer.tools}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p aria-live="polite" className="mt-6 min-h-[3.5rem] font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-fg/80">
              {shown ? (
                <>
                  <span className="text-accent">Built on {shown.name}:</span> {shown.projects.join(' · ')}{' '}
                  <a href="#opensource" className="text-fg underline-offset-4 hover:underline">
                    See the work ↑
                  </a>
                </>
              ) : (
                'Hover, tap or tab through the layers'
              )}
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in">
            <div className="mt-10 border-t border-fg/20 pt-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Currently exploring</div>
              <p className="mt-3 font-sans text-lg leading-relaxed text-fg/90">
                Multi-agent orchestration, WebXR interaction patterns, and self-hosted model serving.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
