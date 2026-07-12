/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Off-black instead of pure #000 — softer, more premium, one place to tune.
        black: '#0a0a0a',
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
