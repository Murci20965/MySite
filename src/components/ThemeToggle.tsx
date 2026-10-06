import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyTheme, currentTheme, storedTheme } from '../lib/theme';
import type { Theme } from '../lib/theme';

/**
 * Light/dark switch. The icon shows where a click takes you (sun in dark
 * mode) and morphs with transform + opacity only. Until the visitor picks a
 * theme it keeps following the OS setting; a pick is remembered.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(() => currentTheme());

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onSystemChange = () => {
      if (storedTheme()) return; // an explicit choice wins
      const next: Theme = mq.matches ? 'light' : 'dark';
      applyTheme(next, false);
      setTheme(next);
    };
    mq.addEventListener('change', onSystemChange);
    return () => mq.removeEventListener('change', onSystemChange);
  }, []);

  const next: Theme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next, true);
        setTheme(next);
      }}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      data-current={theme}
      className={`t-theme relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fg/15 text-fg/70 transition-colors hover:border-fg/40 hover:text-fg ${className}`}
    >
      <Sun className="t-theme-sun absolute h-4 w-4" aria-hidden="true" />
      <Moon className="t-theme-moon absolute h-4 w-4" aria-hidden="true" />
    </button>
  );
}
