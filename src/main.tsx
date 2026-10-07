import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Self-hosted type, latin subset, from our own domain (no third-party
 * request). Audited 2026-10-07: Fraunces is set at 500 and 400 italic, Hanken
 * at 400, 500 and 600, Space Mono at 400. The three faces the first screen
 * needs (Fraunces 500, Fraunces 400 italic, Hanken 400) live in public/fonts
 * under stable names so index.html can preload them; see index.css. The rest
 * come from @fontsource here. */
import '@fontsource/hanken-grotesk/latin-500.css';
import '@fontsource/hanken-grotesk/latin-600.css';
import '@fontsource/space-mono/latin-400.css';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
