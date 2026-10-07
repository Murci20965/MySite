import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import Kicker from './Kicker';

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
    // Chapter 10. Behind it the camera rises over the city at dusk; the right
    // edge measured darkest, so the heading and the questions share one column
    // there and the film keeps the rest of the frame.
    <section id="faq" className="t-ink relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="lg:ml-auto lg:w-[min(42rem,52%)]">
          <AnimatedSection animation="fade-in">
            <Kicker n="10" name="Questions" />
            <RevealHeading
              text="Common questions"
              className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] text-fg lg:text-7xl"
            />
            <p className="mt-6 font-sans text-lg leading-relaxed text-fg">
              How I work, and what to expect from a project.
            </p>
          </AnimatedSection>

          <div className="mt-10 border-t border-fg/20">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="border-b border-fg/20">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-xl font-medium text-fg">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-accent transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
                        className={`pb-6 font-sans text-base leading-relaxed text-fg transition-[opacity,transform,visibility] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:text-lg ${
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
