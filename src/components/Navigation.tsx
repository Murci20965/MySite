import { useState } from 'react';
import { Menu, X, Brain } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About Me', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Blog', href: '#blog' },
    { name: 'Testimonials', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToHero = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Nhlanhla_Mokoena_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={scrollToHero}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              aria-label="Go to hero section"
            >
              <Brain className="w-7 h-7 text-white" />
              <span className="font-display text-2xl font-medium text-white">Murci</span>
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="font-sans text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={handleResumeDownload}
                className="font-sans px-6 py-2.5 bg-lime-400 hover:bg-lime-500 text-black font-medium rounded-full transition-colors text-sm"
              >
                Resume
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-gray-300 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black z-40 transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="font-display text-4xl font-medium text-white hover:text-white/70 transition-colors"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={handleResumeDownload}
            className="font-sans px-10 py-4 bg-lime-400 hover:bg-lime-500 text-black font-medium rounded-full transition-colors text-2xl"
          >
            Resume
          </button>
        </div>
      </div>
    </>
  );
}
