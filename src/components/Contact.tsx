import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import RevealHeading from './RevealHeading';
import Kicker from './Kicker';

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

const TO = 'nhlanhla18mokoena@gmail.com';
const ERRORS: Record<string, string> = {
  name: 'Add your name so I know who to reply to.',
  email: 'Add an email address I can reply to, like name@company.com.',
  message: 'Write a short message: a role, a project or a question.',
};

/**
 * Chapter 11, Contact: the film's finale (the camera rises into orbit and lime
 * arcs fan out across the globe). The heading is set large in the dark space
 * above the globe and lands on the arcs; the form and the direct links sit in
 * plain type, no panels.
 *
 * The form is honest about what it can know. It opens the visitor's email app
 * with the message drafted (there is no mail backend), says so, and keeps the
 * message on screen with Copy and Open buttons, because in-app browsers
 * (LinkedIn's, for one) often have no email app to open.
 */
export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [drafted, setDrafted] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  const subject = `Portfolio contact from ${formData.name}`;
  const fullText = `${formData.message}\n\nFrom ${formData.name} (${formData.email})`;
  const mailto = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullText)}`;

  // Invalid fields: shake, and say what is missing in words (not only a red
  // border). `invalid` doesn't bubble, so listen in the capture phase.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onInvalid = (e: Event) => {
      e.preventDefault();
      const el = e.target as HTMLInputElement;
      shakeInvalid(el);
      setErrors((prev) => ({ ...prev, [el.name]: ERRORS[el.name] ?? 'Check this field.' }));
    };
    form.addEventListener('invalid', onInvalid, true);
    return () => form.removeEventListener('invalid', onInvalid, true);
  }, [drafted]);

  // Move focus to the result so screen readers and keyboards land on it.
  useEffect(() => {
    if (drafted) draftRef.current?.focus();
  }, [drafted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setCopied(false);
    window.location.href = mailto;
    setDrafted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const el = e.target as HTMLElement & { _revert?: number };
    el.classList.remove('is-error');
    if (el._revert) {
      window.clearTimeout(el._revert);
      el._revert = undefined;
    }
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${TO}\nSubject: ${subject}\n\n${fullText}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const directLinks = [
    { label: 'Email', value: TO, link: `mailto:${TO}` },
    { label: 'LinkedIn', value: 'linkedin.com/in/nhlanhla-mokoena-32b22b174', link: 'https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/' },
    { label: 'GitHub', value: 'github.com/Murci20965', link: 'https://github.com/Murci20965' },
  ];

  const preferences = [
    { label: 'Role', value: 'AI Engineer, Nudle' },
    { label: 'Location', value: 'Johannesburg, South Africa' },
    { label: 'Working', value: 'Remote-friendly' },
    { label: 'Timezone', value: 'SAST (UTC+2)' },
  ];

  // 16 px text: iOS zooms into any field smaller than that.
  const fieldClass =
    't-input w-full rounded-lg border border-fg/30 bg-black/45 px-4 py-3 font-sans text-base text-fg placeholder-fg/50 transition-colors focus:border-accent focus:outline-none';
  const labelClass = 'mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-fg';
  const field = (name: 'name' | 'email' | 'message') => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });
  const errorText = (name: string) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-2 font-sans text-sm text-[#ffb4a3]">
        {errors[name]}
      </p>
    ) : null;

  return (
    <section id="contact" className="t-ink relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <AnimatedSection animation="fade-in">
          <Kicker n="11" name="Contact" />
          {/* Film cue: the arcs fan out across the globe (M6, 7.6 s). */}
          <div data-beat="m6:0.76" className="mt-6">
            <RevealHeading
              text="Let’s work together"
              className="max-w-5xl font-display text-[clamp(3.2rem,12vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.03em] text-fg lg:text-[clamp(5rem,8vw,8rem)]"
            />
          </div>
          {/* Full cream, not /90: on phones this crosses the arcs' bright hub. */}
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-fg lg:text-xl">
            A role, a collaboration, or a question about my work: my inbox is open, and I typically reply within 24
            hours.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            {drafted ? (
              <div ref={draftRef} tabIndex={-1} className="focus:outline-none" aria-live="polite">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Draft created</div>
                <h3 className="mt-3 font-display text-3xl font-medium text-fg">
                  Your email app should open with this message
                </h3>
                <p className="mt-3 font-sans text-base leading-relaxed text-fg/90">
                  Hit send there and I&rsquo;ll reply within 24 hours. If nothing opened (some in-app browsers can&rsquo;t),
                  copy it and send it to {TO}.
                </p>
                <pre className="mt-6 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-fg/30 bg-black/45 p-4 font-sans text-sm leading-relaxed text-fg">
                  {fullText}
                </pre>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={copy}
                    className="rounded-full bg-fg px-7 py-3 font-sans text-sm font-semibold text-bg transition-opacity hover:opacity-90"
                  >
                    {copied ? 'Copied' : 'Copy message'}
                  </button>
                  <a
                    href={mailto}
                    className="rounded-full border border-fg/50 px-7 py-3 font-sans text-sm font-semibold text-fg transition-colors hover:border-fg hover:bg-fg/10"
                  >
                    Open email app
                  </a>
                  <button
                    type="button"
                    onClick={() => setDrafted(false)}
                    className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/80 underline-offset-4 hover:text-fg hover:underline"
                  >
                    Edit message
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="Jane Doe"
                      {...field('name')}
                    />
                    {errorText('name')}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={fieldClass}
                      placeholder="jane@company.com"
                      {...field('email')}
                    />
                    {errorText('email')}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${fieldClass} resize-none`}
                    placeholder="What would you like to talk about?"
                    {...field('message')}
                  />
                  {errorText('message')}
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-fg px-8 py-3.5 font-sans text-sm font-semibold text-bg transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  Draft my email
                </button>
              </form>
            )}
          </div>

          <aside className="relative space-y-12">
            {/* A soft pool under the link list (desktop): the globe's lime arcs cross it, and
                lime headings on lime arcs lose their edge. Phones take the section's veil. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-12 -bottom-10 -top-20 -z-10 hidden bg-[radial-gradient(farthest-side,rgb(0_0_0/0.5),rgb(0_0_0/0.4)_60%,transparent)] lg:block"
            />
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Direct</div>
              <ul className="mt-6 space-y-5">
                {directLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.link}
                      target={link.link.startsWith('http') ? '_blank' : undefined}
                      rel={link.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group block"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg">{link.label}</span>
                      <span className="mt-1 flex items-center gap-1.5 break-all font-sans text-base text-fg transition-colors group-hover:text-accent">
                        {link.value}
                        <ArrowUpRight className="t-nudge h-4 w-4 shrink-0" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Currently</div>
              <ul className="mt-6 space-y-3">
                {preferences.map((pref) => (
                  <li key={pref.label} className="flex justify-between gap-4 border-b border-fg/20 pb-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg">{pref.label}</span>
                    <span className="text-right font-sans text-base text-fg">{pref.value}</span>
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
