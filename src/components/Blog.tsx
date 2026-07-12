import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import TiltCard from './TiltCard';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const tabsRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const blogPosts = [
    {
      title: 'Building Scalable Machine Learning Pipelines: Lessons from Production',
      excerpt:
        'A deep dive into the challenges and solutions I encountered while building and deploying ML pipelines that handle millions of predictions daily.',
      date: 'October 5, 2024',
      readTime: '8 min read',
      category: 'MLOps',
      tags: ['Machine Learning', 'DevOps', 'Python'],
      image:
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'The Art of Feature Engineering: Turning Raw Data into Gold',
      excerpt:
        'Explore advanced feature engineering techniques that dramatically improved model performance in my recent projects, with practical examples and code snippets.',
      date: 'September 28, 2024',
      readTime: '12 min read',
      category: 'Data Science',
      tags: ['Feature Engineering', 'Analytics', 'Best Practices'],
      image:
        'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Real-Time AI: Building a Low-Latency Recommendation System',
      excerpt:
        'How I architected a recommendation system that serves personalized results in under 50ms, handling thousands of concurrent users without breaking a sweat.',
      date: 'September 15, 2024',
      readTime: '10 min read',
      category: 'AI Engineering',
      tags: ['Real-Time AI', 'Scalability', 'Architecture'],
      image:
        'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Understanding Transformer Models: A Practical Guide',
      excerpt:
        'Breaking down the complexities of transformer architectures with clear explanations and hands-on examples that you can implement today.',
      date: 'August 30, 2024',
      readTime: '15 min read',
      category: 'Deep Learning',
      tags: ['NLP', 'Transformers', 'PyTorch'],
      image:
        'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Data Quality: The Foundation of Successful ML Projects',
      excerpt:
        'Why data quality matters more than fancy algorithms, and practical strategies for ensuring your training data is reliable and representative.',
      date: 'August 12, 2024',
      readTime: '7 min read',
      category: 'Data Science',
      tags: ['Data Quality', 'Best Practices', 'SQL'],
      image:
        'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'From Jupyter Notebook to Production: A Survival Guide',
      excerpt:
        'The practical steps and tools I use to transform experimental notebooks into production-ready code that other engineers can work with.',
      date: 'July 25, 2024',
      readTime: '9 min read',
      category: 'AI Engineering',
      tags: ['Python', 'CI/CD', 'Testing'],
      image:
        'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const categories = ['All', 'MLOps', 'Data Science', 'AI Engineering', 'Deep Learning'];

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
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Writing
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">05</span>
          </div>

          <h2 className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Notes on the work
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Thoughts, tutorials, and lessons from building machine learning in production.
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

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {filteredPosts.map((post, index) => (
            <AnimatedSection key={post.title} animation="fade-in" delay={index % 2 === 1}>
              <article className="group flex cursor-pointer flex-col">
                <TiltCard className="aspect-[16/10] border border-white/10">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
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
              </article>
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
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
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
