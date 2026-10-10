import { useEffect, useRef, useState } from 'react';

// Real in-page links: the URL hash updates so a chapter can be shared, and Back works. Staged, the
// jump is a cut (stage.md, "Navigation"); in flow mode the browser scrolls smoothly.
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
 * No bar and no borders. Desktop: the wordmark and the row of mono links sit straight on the film,
 * each on a soft dark shade (Murci, 2026-10-10: the row was right, only its text needed a darker
 * background). Phones and tablets: one Menu pill that opens a small dark sheet from its corner
 * (option A of three, 2026-10-09), so the film keeps playing around it. The sheet is a disclosure,
 * not a modal: the page stays live behind it, and it closes on a link, Escape, a click outside,
 * focus leaving it, or a scroll.
 * The nav steps out of the way while you read (hides on scroll down) and comes back on scroll up.
 * No backdrop blur: over a canvas that changes every frame, a blur is recomputed every frame.
 */
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Scroll-spy: mark the chapter whose section sits near mid-viewport. Every section is observed,
  // so scrolling to one without a link (Stats, Vision, FAQ) clears the mark.
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

  // Open: focus moves to the first chapter. Escape closes and hands focus back to the pill; a click
  // outside, focus leaving the menu, or a scroll of more than a few pixels closes it.
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    sheet?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    const inside = (t: EventTarget | null) =>
      t instanceof Node && (sheet?.contains(t) || toggleRef.current?.contains(t));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!inside(e.target)) setOpen(false);
    };
    const onFocus = (e: FocusEvent) => {
      if (!inside(e.target)) setOpen(false);
    };
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 24) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('focusin', onFocus);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('focusin', onFocus);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  const close = () => setOpen(false);
  const tucked = hidden && !open;

  return (
    <nav
      aria-label="Primary"
      className={`t-ink fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out ${
        tucked ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* The fade that lets the wordmark read over bright frames; not a bar. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="relative mx-auto flex h-20 max-w-[1760px] items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24">
        <a
          href="#hero"
          onClick={close}
          className="t-shade relative font-display text-[22px] font-medium text-fg transition-opacity hover:opacity-80"
          aria-label="Murci, back to top"
        >
          Murci
        </a>

        {/* Desktop: the row of links, on a soft shade (no borders). */}
        <div className="t-shade relative hidden items-center gap-8 lg:flex">
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

        {/* Phones and tablets: the Menu pill and its sheet. */}
        <div className="relative flex items-center lg:hidden">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex min-h-10 items-center rounded-full bg-[rgb(10_10_10/0.82)] px-4 font-mono text-[11px] uppercase tracking-[0.24em] text-fg transition-colors hover:text-accent"
          >
            {open ? 'Close' : 'Menu'}
          </button>

          {/* The sheet: grows from the pill's corner. `invisible` when closed takes its links out of
              the tab order and the accessibility tree; visibility flips after the fade-out. */}
          <div
            ref={sheetRef}
            id="site-menu"
            data-open={open ? '' : undefined}
            className={`t-menu-sheet absolute right-0 top-[calc(100%+10px)] w-[min(15.5rem,calc(100vw-3rem))] rounded-[18px] bg-[rgb(10_10_10/0.985)] px-5 pb-4 pt-3 ${
              open ? 'visible' : 'invisible'
            }`}
          >
            <ul>
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <li key={link.href} className="t-menu-item" style={{ ['--i' as string]: i }}>
                    <a
                      href={link.href}
                      onClick={close}
                      aria-current={isActive ? 'location' : undefined}
                      className="group flex min-h-10 items-center gap-3"
                    >
                      <span className="w-6 font-mono text-[11px] tracking-[0.12em] text-accent">{link.n}</span>
                      <span className="font-display text-lg font-medium text-fg transition-opacity group-hover:opacity-80">
                        {link.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full bg-accent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href={RESUME.href}
              download={RESUME.filename}
              onClick={close}
              className="t-menu-item mt-3 flex min-h-10 items-center font-mono text-[11px] uppercase tracking-[0.24em] text-accent"
              style={{ ['--i' as string]: NAV_LINKS.length }}
            >
              Resume ↓
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
