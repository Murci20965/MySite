import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Principles', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/Murci20965', label: 'GitHub' },
    { icon: Mail, href: 'mailto:nhlanhla18mokoena@gmail.com', label: 'Email' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="site-footer" className="border-t border-white/10 bg-black py-16">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl font-medium text-white">
              Nhlanhla Mokoena
            </div>
            <p className="mt-4 max-w-md font-sans leading-relaxed text-white/50">
              AI engineer building production AI systems, and working toward XR education that
              lets anyone, anywhere, practise real skills.
            </p>
          </div>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              Navigation
            </div>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="font-sans text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              Connect
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-white/30 hover:text-white"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs tracking-wide text-white/40">
            &copy; {new Date().getFullYear()} Nhlanhla Mokoena
          </p>
          <p className="font-mono text-xs tracking-wide text-white/40">
            Johannesburg, South Africa
          </p>
        </div>
      </div>
    </footer>
  );
}
