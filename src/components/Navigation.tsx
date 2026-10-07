import { useEffect, useRef, useState } from 'react';

// Real in-page links: the browser scrolls (smoothly, via `scroll-behavior` on
// <html>, which the reduced-motion rule turns off), the URL hash updates so a
// section can be shared, and Back works. No JS scrolling needed.
const NAV_LINKS = [
  { n: '02', name: 'About', href: '#about' },
  { n: '03', name: 'Experience', href: '#experience' },
  { n: '04', name: 'Work', href: '#opensource' },
  { n: '07', name: 'Stack', href: '#skills' },
  { n: '09', name: 'Principles', href: '#principles' },
  { n: '11', name: 'Contact', href: '#contact' },
];

const RESUME = { href: '/resume.pdf', filename: 'Nhlanhla_Mokoena_Resume.pdf' };

/**
 * No bar (Murci, 2026-10-07): the wordmark and small mono links sit straight
 * on the film, with a soft fade at the very top so they read over bright
 * frames. It steps out of the way while you read (hides on scroll down) and
 * comes back the moment you scroll up. No backdrop blur: over a canvas that
 * changes every frame, a blur is recomputed every frame.
 */
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  // Scroll-spy: mark the nav link for whichever section sits near mid-viewport.
  // Every section is observed, so scrolling back to the hero (or Stats, Vision,
  // FAQ) clears the mark instead of leaving the last linked section lit.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Hide on scroll down, show on scroll up (6 px of intent either way).
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y < 120) setHidden(false);
      else if (y > last + 6) setHidden(true);
      else if (y < last - 6) setHidden(false);
      if (Math.abs(y - last) > 6) last = y;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Mobile menu: focus moves in, Tab stays inside, Escape closes it and hands
  // focus back to the toggle; the page behind stops scrolling.
  useEffect(() => {
    if (!isMenuOpen) return;
    const menu = menuRef.current;
    const focusables = () => Array.from(menu?.querySelectorAll<HTMLElement>('a, button') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next]?.focus();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const tucked = hidden && !isMenuOpen;

  return (
    <>
      <nav
        aria-label="Primary"
        className={`t-ink fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out ${
          tucked ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* The fade that lets the links read over bright frames; not a bar. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="relative mx-auto flex h-20 max-w-[1760px] items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24">
          <a
            href="#hero"
            onClick={closeMenu}
            className="font-display text-[22px] font-medium text-fg transition-opacity hover:opacity-80"
            aria-label="Murci, back to top"
          >
            Murci
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors ${
                    isActive ? 'text-fg' : 'text-fg/80 hover:text-fg'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1 w-1 rounded-full bg-accent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {link.name}
                </a>
              );
            })}
            <a
              href={RESUME.href}
              download={RESUME.filename}
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent transition-opacity hover:opacity-80"
            >
              Resume ↓
            </a>
          </div>

          <button
            ref={toggleRef}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* `invisible` (visibility: hidden) when closed takes the off-screen links
          out of the tab order and the accessibility tree; visibility is in the
          transition list so it only flips after the slide-out finishes.
          z-[45]: above the floating assistant (z-40), below the nav (z-50) so
          the close button stays on top. */}
      <nav
        ref={menuRef}
        id="mobile-menu"
        aria-label="Mobile"
        className={`fixed inset-0 z-[45] bg-bg/95 transition-[opacity,visibility] duration-300 ease-out lg:hidden ${
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-center gap-4 px-6 pb-8 pt-24 sm:px-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="flex items-baseline gap-4 font-display text-4xl font-medium text-fg transition-opacity hover:opacity-80"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{link.n}</span>
              {link.name}
            </a>
          ))}
          <a
            href={RESUME.href}
            download={RESUME.filename}
            onClick={closeMenu}
            className="mt-6 self-start rounded-full bg-accent px-8 py-3 font-sans text-base font-semibold text-black transition-opacity hover:opacity-90"
          >
            Download resume
          </a>
        </div>
      </nav>
    </>
  );
}
