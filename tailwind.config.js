/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // `dark:` utilities follow <html data-theme>, set before first paint.
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Off-black instead of pure #000. Still used for text on lime buttons,
        // which stays black in both themes (13.1:1 on lime-400).
        black: '#0a0a0a',
        // Theme tokens (src/index.css sets the RGB triplets per data-theme), so
        // opacity modifiers keep working: text-fg/60, border-fg/10, bg-bg/80.
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        // "Screens" (diagrams, the film) stay dark in both themes.
        screen: '#0e0e0e',
        sand: '#F0E7D6',
        ink: '#17130E',
        marigold: '#E0952A',
        umber: '#6B5B47',
        bead: {
          red: '#C0392B',
          green: '#1E8A6E',
          cobalt: '#2456A6',
        },
        'ink-deep': '#0C0F17',
        'slate-panel': '#141926',
        bone: '#ECE6D8',
        'slate-muted': '#8A93A6',
        hairline: '#232A3B',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
