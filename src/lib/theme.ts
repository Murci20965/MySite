/* Theme state lives on <html data-theme>. index.html sets it before first
 * paint (stored choice, else the OS preference); this module changes it at
 * runtime and tells canvases, which cannot read CSS variables per pixel, that
 * the foreground colour changed.
 */

export type Theme = 'light' | 'dark';

export const THEME_EVENT = 'themechange';
const STORAGE_KEY = 'theme';
const META_COLOR: Record<Theme, string> = { dark: '#0a0a0a', light: '#f4efe6' };

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** The stored choice, or null when the visitor has not picked one (follow the OS). */
export function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null; // private mode or blocked storage
  }
}

export function applyTheme(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme]);
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* the choice still applies for this visit */
    }
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}

/** The theme foreground as a canvas colour with the given alpha. */
export function fgColor(alpha: number): string {
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--c-fg').trim() || '255 255 255';
  return `rgba(${rgb.split(/\s+/).join(',')},${alpha})`;
}
