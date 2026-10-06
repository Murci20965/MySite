import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

// Real in-page links: the browser scrolls (smoothly, via `scroll-behavior` on
// <html>, which the reduced-motion rule turns off), the URL hash updates so a
// section can be shared, and Back works. No JS scrolling needed.
const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#opensource' },
  { name: 'Skills', href: '#skills' },
  { name: 'Principles', href: '#reviews' },
  { name: 'Contact', href: '#contact' },
];

const RESUME = { href: '/resume.pdf', filename: 'Nhlanhla_Mokoena_Resume.pdf' };

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Scroll-spy: mark the nav link for whichever section sits near mid-viewport.
  // Every section is observed, not just linked ones, so scrolling back to the
  // hero (or Stats, Vision, FAQ) clears the underline instead of leaving the
  // last linked section highlighted.
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

  // Mobile menu: Escape closes it and hands focus back to the toggle; the page
  // behind stops scrolling while the full-screen menu is up.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
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

  return (
    <>
      <nav aria-label="Primary" className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between h-20">
            <a
              href="#hero"
              onClick={closeMenu}
              className="font-display text-2xl font-medium text-fg hover:opacity-80 transition-opacity duration-300"
              aria-label="Murci, back to top"
            >
              Murci
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={`t-navlink font-sans text-sm transition-colors ${
                      isActive ? 'text-fg' : 'text-fg/60 hover:text-fg'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <ThemeToggle />
              <a
                href={RESUME.href}
                download={RESUME.filename}
                className="font-sans px-6 py-2.5 bg-lime-400 hover:bg-lime-500 text-black font-medium rounded-full transition duration-300 active:scale-[0.98] text-sm"
              >
                Resume
              </a>
            </div>

            <div className="flex items-center gap-4 lg:hidden">
              <ThemeToggle />
              <button
                ref={toggleRef}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="text-fg hover:text-fg/70 transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* `invisible` (visibility: hidden) when closed takes the off-screen links
          out of the tab order and the accessibility tree; visibility is in the
          transition list so it only flips after the slide-out finishes.
          z-[45]: above the floating chat launcher (z-40), below the nav bar
          (z-50) so the close button stays on top. The list starts below the
          80px bar and is sized so all eight items fit a 702px-tall phone. */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        className={`fixed inset-0 bg-bg z-[45] transition-[transform,visibility] duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0 visible' : 'translate-x-full invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-5 pt-20 pb-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="font-display text-3xl sm:text-4xl font-medium text-fg hover:text-fg/70 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href={RESUME.href}
            download={RESUME.filename}
            onClick={closeMenu}
            className="mt-2 font-sans px-10 py-3.5 bg-lime-400 hover:bg-lime-500 text-black font-medium rounded-full transition duration-300 active:scale-[0.98] text-xl"
          >
            Resume
          </a>
        </div>
      </nav>
    </>
  );
}
