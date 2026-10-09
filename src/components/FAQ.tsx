import { Scene, Step, StepLabel } from './Scene';
import type { Place } from '../lib/stage';

const FAQS = [
  {
    question: 'What technologies do you specialize in?',
    answer:
      'Agentic AI, RAG and MLOps. I build agentic workflows with LangChain, LangGraph and n8n, RAG pipelines over vector databases, and Python/FastAPI backends, with PyTorch and scikit-learn for machine learning. On the frontend I work with Next.js and React, including React Three Fiber and WebXR for interactive 3D. Everything ships containerised with Docker through GitHub Actions CI/CD.',
  },
  {
    question: 'What kind of work are you doing right now?',
    answer:
      'I engineer the AI layer of an XR simulation-training platform at Nudle: a headless Blender agent framework that builds 3D lesson environments, multimodal text/image-to-3D generation, text-to-video lesson animation, and the containerised GPU serving underneath. Before that I red-teamed and evaluated LLM responses for dialogue safety and alignment at Alignerr.',
  },
  {
    question: 'What is your experience with cloud platforms?',
    answer:
      'Hands-on serverless deployment across HuggingFace Spaces, Render and Vercel, where my live demos run today. On AWS I have coursework covering IAM, networking, CloudFormation and cost management, plus hands-on Terraform provisioning, and I hold the Microsoft Azure Fundamentals certification. I favour portable, container-first setups over lock-in.',
  },
  {
    question: 'How do you approach quality and documentation?',
    answer:
      'Documentation ships in the same change as the code, because stale docs are a defect. I make atomic, well-scoped commits, keep API contracts and data schemas written down, and treat error handling, logging and security as part of the build rather than an afterthought.',
  },
  {
    question: 'What domains have you applied AI in?',
    answer:
      'XR education and simulation training at Nudle; LLM safety and alignment evaluation at Alignerr; LLM training data, RAG and automated model evaluation at Artintel; and in my own projects: real-estate price prediction, medical image classification, resume-to-job matching and personal finance.',
  },
  {
    question: 'Where are you based, and how do you work?',
    answer:
      'Johannesburg, South Africa. I work on-site with the Nudle team and have worked remotely with distributed teams, so collaborating across time zones is familiar. isiZulu is my first language, English is my working language, and I communicate progress honestly: if something failed or slipped, you hear it from me first.',
  },
];

/** The answer's first sentence, shown with the question; the full answer is behind "Read more". */
const lead = (answer: string) => {
  const m = /^(.+?[.!?])(\s|$)/.exec(answer);
  return m ? m[1] : answer;
};

// Film 19.0-20.4 s: the arcs over the globe; the open space above the Earth's edge, top left.
const PLACE: Place = { wide: { x: 0.05, y: 0.06, w: 0.46 }, tall: { y: 0.09 } };

/** Chapter 10, Questions: one question at a time, its answer's first sentence, the rest on tap. */
export default function FAQ() {
  return (
    <Scene id="faq" n="10" name="Questions" stepVh={75} pool>
      {FAQS.map((f, i) => (
        <Step key={f.question} place={PLACE}>
          <StepLabel n="10" name="Questions" i={i} of={FAQS.length} />
          <h3 className="mt-4 font-display text-2xl font-medium leading-[1.15] tracking-[-0.01em] text-fg lg:text-3xl">
            {f.question}
          </h3>
          <p className="mt-3 font-sans text-base leading-relaxed text-fg lg:text-lg">{lead(f.answer)}</p>
          {lead(f.answer) !== f.answer && (
            <details className="step-more mt-4">
              <summary>Read more</summary>
              <div className="step-more-body mt-3 pr-2">
                <p className="font-sans text-base leading-relaxed text-fg">{f.answer}</p>
              </div>
            </details>
          )}
        </Step>
      ))}
    </Scene>
  );
}
