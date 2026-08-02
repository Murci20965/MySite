import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import TiltCard from './TiltCard';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const tabsRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const blogPosts = [
    {
      title: 'One LLM, Fourteen Animations: Structured Outputs as an API Contract',
      excerpt:
        'How the Avatar-3D Pipeline turns a probabilistic language model into a deterministic animation director — strict Pydantic schemas, structured tool calling, and why LLM output should be treated as untrusted user input.',
      date: 'August 2026',
      readTime: '6 min read',
      category: 'AI Engineering',
      tags: ['LLM Agents', 'Pydantic', 'FastAPI'],
      link: 'https://github.com/Murci20965/MySite/blob/main/content/blog/one-llm-fourteen-animations.md',
    },
    {
      title: 'Taming AI-Generated 3D: A Headless Blender Pipeline for the Web',
      excerpt:
        'Text-to-3D output arrives off-centre, mis-scaled and heavy. Inside Orbit-3D: a Dockerised headless Blender engine that normalises every generated mesh into a web-ready asset, and asyncio orchestration that keeps the wait bearable.',
      date: 'August 2026',
      readTime: '6 min read',
      category: '3D & XR',
      tags: ['Text-to-3D', 'Blender', 'WebGL'],
      link: 'https://github.com/Murci20965/MySite/blob/main/content/blog/taming-ai-generated-3d.md',
    },
    {
      title: 'R² Isn’t the Finish Line: Shipping an XGBoost Model with CI/CD',
      excerpt:
        'My price model scores R² 0.9037 — and that’s the least interesting part. On the gap between a good metric and a dependable system: API contracts, Docker reproducibility, and CI that catches the embarrassing failure first.',
      date: 'August 2026',
      readTime: '5 min read',
      category: 'MLOps',
      tags: ['XGBoost', 'CI/CD', 'Docker'],
      link: 'https://github.com/Murci20965/MySite/blob/main/content/blog/r2-is-not-the-finish-line.md',
    },
    {
      title: 'Transfer Learning on a Budget: Pneumonia Detection with ResNet50',
      excerpt:
        'Why start from zero when ImageNet already taught the network to see? Fine-tuning ResNet50 for chest X-rays, and why I deliberately tuned for 0.96 recall — choosing which way to be wrong is a product decision.',
      date: 'August 2026',
      readTime: '6 min read',
      category: 'Machine Learning',
      tags: ['Transfer Learning', 'PyTorch', 'Medical Imaging'],
      link: 'https://github.com/Murci20965/MySite/blob/main/content/blog/transfer-learning-on-a-budget.md',
    },
  ];

  const categories = ['All', 'AI Engineering', '3D & XR', 'MLOps', 'Machine Learning'];

  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter((p) => p.category === selectedCategory);

  const positionUnderline = useCallback((animate: boolean) => {
    const container = tabsRef.current;
    const underline = underlineRef.current;
    if (!container || !underline) return;
    const active = container.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    const apply = () => {
      underline.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop + active.offsetHeight}px)`;
      underline.style.width = `${active.offsetWidth}px`;
    };
    if (animate) {
      apply();
    } else {
      const prev = underline.style.transition;
      underline.style.transition = 'none';
      apply();
      void underline.offsetWidth;
      underline.style.transition = prev;
    }
  }, []);

  useEffect(() => {
    positionUnderline(false);
    const onResize = () => positionUnderline(false);
    window.addEventListener('resize', onResize);
    if (document.fonts) {
      document.fonts.ready.then(() => positionUnderline(false));
    }
    return () => window.removeEventListener('resize', onResize);
  }, [positionUnderline]);

  useEffect(() => {
    positionUnderline(true);
  }, [selectedCategory, positionUnderline]);

  return (
    <section id="blog" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Writing
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="t-drift font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">05</span>
          </div>

          <RevealHeading
            text="Notes on the work"
            className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl"
          />
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Field notes from my own projects — what actually broke, what actually worked, and why.
          </p>

          <div ref={tabsRef} className="relative mt-10 flex flex-wrap gap-x-6 gap-y-3 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                data-active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  selectedCategory === category ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {category}
              </button>
            ))}
            <span ref={underlineRef} className="t-underline" aria-hidden="true" />
          </div>
        </AnimatedSection>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-4">
          {filteredPosts.map((post, index) => (
            <AnimatedSection key={post.title} animation="fade-in" delay={index % 2 === 1}>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-pointer flex-col"
              >
                <TiltCard className="aspect-[16/10] border border-white/10">
                  {/* Typographic cover — no stock imagery, no repeated art. */}
                  <div className="flex h-full w-full flex-col justify-between bg-[#0e0e0e] p-6">
                    <span className="h-px w-10 bg-lime-400/50" />
                    <span className="self-end font-display text-7xl leading-none text-white/[0.07]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
                    {post.category}
                  </span>
                </TiltCard>

                <div className="mt-5">
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                    {post.date} &middot; {post.readTime}
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-medium leading-tight text-white transition-colors group-hover:text-white/70">
                    {post.title}
                  </h3>
                  <p className="mb-5 font-sans text-sm leading-relaxed text-white/60">
                    {post.excerpt}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] tracking-wide text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 transition-colors group-hover:text-white">
                    Read more <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-in">
          <div className="mt-16 flex flex-col gap-8 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-md">
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                Newsletter
              </div>
              <p className="font-sans text-lg text-white/80">
                Get notified when I publish new articles and tutorials.
              </p>
            </div>
            <form
              className="flex w-full max-w-sm items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem('subscriber') as HTMLInputElement)?.value ?? '';
                window.location.href = `mailto:nhlanhla18mokoena@gmail.com?subject=${encodeURIComponent('Notify me about new articles')}&body=${encodeURIComponent(`Please add ${email} to your article updates.`)}`;
              }}
            >
              <input
                type="email"
                name="subscriber"
                required
                placeholder="name@email.com"
                className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-sans text-sm text-white placeholder-white/40 transition-colors focus:border-white/50 focus:outline-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-full bg-white px-6 py-2.5 font-sans text-sm font-medium text-black transition duration-300 hover:bg-white/85 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
