import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

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

// Film 11.2-13.6 s: over the city grid, the camera slows; the top of the frame is open night sky.
// Every card lands in the same place: the pile grows upward from it (storyboard v1).
const PLACE: Place = { wide: { x: 0.06, y: 0.27, w: 0.36 }, tall: { y: 0.24 } };

/**
 * Chapter 07, Stack: "from model to classroom" as a deck. Each layer is a lime glass card that lands
 * on top of the last, from 01 Data at the bottom of the pile to 08 XR on top; earlier cards peek
 * out above, smaller and dimmer, and their words fade as they sink (StageDirector, stack mode).
 */
export default function Skills() {
  return (
    <Scene id="skills" n="07" name="Stack" mode="stack" stepVh={55}>
      {LAYERS.map((layer, i) => (
        <Step key={layer.name} place={PLACE}>
          <div className="relative px-7 py-5">
            {/* The glass slab: skewed, a lime edge and a faint lime tint, as the stack has always been. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -skew-x-[12deg] border border-accent/50 bg-[rgb(10_10_10/0.4)] bg-[linear-gradient(rgb(200_242_107/0.07),rgb(200_242_107/0.07))] shadow-[inset_0_1px_0_rgb(200_242_107/0.25)]"
            />
            <div className="deck-text relative">
              <StepLabel n="07" name="From model to classroom" i={i} of={LAYERS.length} />
              <h3 className="mt-3 font-display text-2xl font-medium tracking-[-0.01em] text-fg lg:text-3xl">{layer.name}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-fg lg:text-base">{layer.tools}</p>
              <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-fg">
                <span className="text-accent">Built on it:</span> {layer.projects.join(' · ')}
              </p>
            </div>
          </div>
        </Step>
      ))}
    </Scene>
  );
}
