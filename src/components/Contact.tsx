import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

// Shake an invalid field (transitions.dev 12) with an auto-reverting red border.
function shakeInvalid(el: HTMLElement) {
  el.classList.add('is-error');
  el.classList.remove('is-shaking');
  void el.offsetWidth;
  el.classList.add('is-shaking');
  window.setTimeout(() => el.classList.remove('is-shaking'), 300);
  const holder = el as HTMLElement & { _revert?: number };
  if (holder._revert) window.clearTimeout(holder._revert);
  holder._revert = window.setTimeout(() => el.classList.remove('is-error'), 3300);
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const checkRef = useRef<HTMLSpanElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Play the success-check animation once the confirmation mounts.
  useEffect(() => {
    if (!submitted) return;
    const el = checkRef.current;
    if (!el) return;
    void el.offsetWidth;
    el.setAttribute('data-state', 'in');
  }, [submitted]);

  // Shake invalid fields instead of the native bubble. `invalid` doesn't
  // bubble, so listen in the capture phase on the form.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onInvalid = (e: Event) => {
      e.preventDefault();
      if (e.target instanceof HTMLElement) shakeInvalid(e.target);
    };
    form.addEventListener('invalid', onInvalid, true);
    return () => form.removeEventListener('invalid', onInvalid, true);
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const el = e.target as HTMLElement & { _revert?: number };
    el.classList.remove('is-error');
    if (el._revert) {
      window.clearTimeout(el._revert);
      el._revert = undefined;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const directLinks = [
    { label: 'Email', value: 'nhlanhla.mokoena@email.com', link: 'mailto:nhlanhla.mokoena@email.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/nhlanhla-mokoena', link: 'https://linkedin.com' },
    { label: 'GitHub', value: 'github.com/nhlanhla-mokoena', link: 'https://github.com' },
  ];

  const preferences = [
    { label: 'Open to', value: 'Full-time, contract, consulting' },
    { label: 'Location', value: 'Remote / hybrid' },
    { label: 'Rate', value: 'From $150 / hour' },
    { label: 'Availability', value: 'Immediate' },
  ];

  const projectTypes = [
    'Machine Learning Model Development',
    'Computer Vision Application',
    'NLP/Text Analysis System',
    'Recommendation System',
    'Time Series Forecasting',
    'MLOps & Deployment',
    'Data Pipeline & Engineering',
    'AI Consulting',
    'Other',
  ];
  const budgetRanges = ['$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000 - $100,000', '$100,000+'];
  const timelines = ['1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months', '3-6 months', '6+ months'];

  const fieldClass =
    't-input w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 font-sans text-sm text-white placeholder-white/30 transition-colors focus:border-white/40 focus:outline-none';
  const labelClass = 'mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/40';

  return (
    <section id="contact" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Contact
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">10</span>
          </div>

          <h2 className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
            Let&rsquo;s work together
          </h2>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            Open to full-time, contract, and consulting work. I typically reply within 24 hours.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-12 border-t border-white/10 pt-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            {submitted ? (
              <div className="rounded-2xl border border-white/15 p-10 text-center">
                <span
                  ref={checkRef}
                  className="t-success-check mb-4 inline-block"
                  data-state="out"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 48 48" fill="none" width="60" height="60">
                    <circle cx="24" cy="24" r="21" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                    <path
                      d="M14 24.5 l6.5 6.5 L34 16"
                      stroke="#a3e635"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="font-display text-2xl font-medium text-white">Message on its way</div>
                <p className="mt-2 font-sans text-white/60">
                  Thanks for reaching out &mdash; I&rsquo;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>Full name</label>
                    <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className={fieldClass} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className={fieldClass} placeholder="jane@company.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className={labelClass}>Company / organization</label>
                  <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} className={fieldClass} placeholder="Acme Inc." />
                </div>

                <div>
                  <label htmlFor="projectType" className={labelClass}>Project type</label>
                  <select id="projectType" name="projectType" required value={formData.projectType} onChange={handleChange} className={fieldClass}>
                    <option value="" className="bg-black">Select a project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="bg-black">{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="budget" className={labelClass}>Budget range</label>
                    <select id="budget" name="budget" required value={formData.budget} onChange={handleChange} className={fieldClass}>
                      <option value="" className="bg-black">Select budget</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range} className="bg-black">{range}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className={labelClass}>Timeline</label>
                    <select id="timeline" name="timeline" required value={formData.timeline} onChange={handleChange} className={fieldClass}>
                      <option value="" className="bg-black">Select timeline</option>
                      {timelines.map((time) => (
                        <option key={time} value={time} className="bg-black">{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>Project details</label>
                  <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className={`${fieldClass} resize-none`} placeholder="Tell me about your project, goals, and any specific requirements." />
                </div>

                <button type="submit" className="rounded-full bg-white px-8 py-3.5 font-sans text-sm font-medium text-black transition-colors hover:bg-white/85">
                  Send message
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-10">
            <div>
              <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
                Direct
              </div>
              <ul className="space-y-4">
                {directLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                        {link.label}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 font-sans text-sm text-white/80 transition-colors group-hover:text-white">
                        {link.value}
                        <ArrowUpRight className="h-3.5 w-3.5 text-white/40" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
                Preferences
              </div>
              <ul className="space-y-3">
                {preferences.map((pref) => (
                  <li key={pref.label} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                      {pref.label}
                    </span>
                    <span className="text-right font-sans text-sm text-white/80">{pref.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
