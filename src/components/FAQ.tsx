import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
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

  return (
    <section id="faq" className="relative bg-bg py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg/50">
              FAQ
            </span>
            <span className="h-px flex-1 bg-fg/15" />
            <span className="t-drift font-mono text-[11px] uppercase tracking-[0.28em] text-fg/30">07</span>
          </div>
        </AnimatedSection>

        {/* Two columns so the answers keep a readable measure while the
            section still spans the page. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-24">
          <AnimatedSection animation="fade-in">
            <div className="lg:sticky lg:top-32">
              <RevealHeading
                text="Common questions"
                className="mb-6 font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-fg sm:text-5xl"
              />
              <p className="max-w-md font-sans text-lg leading-relaxed text-fg/70">
                How I work, and what to expect from a project.
              </p>
            </div>
          </AnimatedSection>

          <div className="border-t border-fg/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-fg/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-medium text-fg">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-fg/50 transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* Accordion (transitions.dev 21). Height is the one property
                    here that must animate layout: there is no transform that
                    grows a box without distorting its text. It stays cheap:
                    one short grid-rows tween on a small list. Padding lives on
                    the inner block, never the 0fr track, or the panel cannot
                    fully close; the answer itself only fades and rises. */}
                <div
                  id={`faq-panel-${index}`}
                  className={`grid transition-[grid-template-rows] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`max-w-2xl pb-6 font-sans leading-relaxed text-fg/60 transition-[opacity,transform,visibility] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                      }`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
