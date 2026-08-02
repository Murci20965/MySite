import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';

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
    const subject = encodeURIComponent(`Portfolio contact from ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\nFrom ${formData.name} (${formData.email})`);
    window.location.href = `mailto:nhlanhla18mokoena@gmail.com?subject=${subject}&body=${body}`;
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
    { label: 'Email', value: 'nhlanhla18mokoena@gmail.com', link: 'mailto:nhlanhla18mokoena@gmail.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/nhlanhla-mokoena-32b22b174', link: 'https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/' },
    { label: 'GitHub', value: 'github.com/Murci20965', link: 'https://github.com/Murci20965' },
  ];

  const preferences = [
    { label: 'Role', value: 'Junior AI Engineer, Nudle' },
    { label: 'Location', value: 'Johannesburg, South Africa' },
    { label: 'Working', value: 'Remote-friendly' },
    { label: 'Timezone', value: 'SAST (UTC+2)' },
  ];

  const fieldClass =
    't-input w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 font-sans text-sm text-white placeholder-white/30 transition-colors focus:border-white/40 focus:outline-none';
  const labelClass = 'mb-2 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/40';

  return (
    <section id="contact" className="relative bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/50">
              Contact
            </span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="t-drift font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">10</span>
          </div>

          <RevealHeading
            text="Let’s work together"
            className="mb-6 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl"
          />
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-white/70">
            A role, a collaboration, or a question about my work: my inbox is open, and I typically reply within 24 hours.
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
                <div className="font-display text-2xl font-medium text-white">Draft ready to send</div>
                <p className="mt-2 font-sans text-white/60">
                  Your email app just opened with the message pre-filled &mdash; hit send and
                  I&rsquo;ll reply within 24 hours. Nothing opened? Email me directly at
                  nhlanhla18mokoena@gmail.com.
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
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className={`${fieldClass} resize-none`} placeholder="What would you like to talk about?" />
                </div>

                <button type="submit" className="rounded-full bg-white px-8 py-3.5 font-sans text-sm font-medium text-black transition duration-300 hover:bg-white/85 active:scale-[0.98]">
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
                      target={link.link.startsWith('http') ? '_blank' : undefined}
                      rel={link.link.startsWith('http') ? 'noopener noreferrer' : undefined}
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
                Currently
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
