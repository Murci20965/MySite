import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#opensource' },
    { name: 'Skills', href: '#skills' },
    { name: 'Principles', href: '#principles' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/nhlanhla-mokoena-32b22b174/', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/Murci20965', label: 'GitHub' },
    { icon: Mail, href: 'mailto:nhlanhla18mokoena@gmail.com', label: 'Email' },
  ];

  return (
    <footer id="site-footer" className="t-ink border-t border-fg/20 py-16">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl font-medium text-fg">
              Nhlanhla Mokoena
            </div>
            <p className="mt-4 max-w-md font-sans leading-relaxed text-fg">
              AI engineer building production AI systems, and working toward XR education that
              lets anyone, anywhere, practise real skills.
            </p>
          </div>

          <nav aria-label="Footer">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Navigation
            </div>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-fg transition-colors hover:text-accent"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-fg/30 text-fg transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-fg/20 pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs tracking-wide text-fg">
            &copy; {new Date().getFullYear()} Nhlanhla Mokoena
          </p>
          <p className="font-mono text-xs tracking-wide text-fg">
            Johannesburg, South Africa
          </p>
        </div>
      </div>
    </footer>
  );
}
