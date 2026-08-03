import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Self-hosted type. Previously eleven faces came from Google Fonts across two
 * extra origins, render-blocking and repeatedly slow. These are the six faces
 * the site actually renders (audited: only font-medium and font-semibold are
 * ever set, and nothing is italic), latin subset only, served from our own
 * domain so there is no third-party request and no privacy question. */
import '@fontsource/fraunces/latin-400.css';
import '@fontsource/fraunces/latin-500.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/hanken-grotesk/latin-400.css';
import '@fontsource/hanken-grotesk/latin-500.css';
import '@fontsource/space-mono/latin-400.css';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
