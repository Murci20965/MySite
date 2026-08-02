import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // NOTE: lucide-react used to be in optimizeDeps.exclude (a starter-template
  // default). Excluding it makes the dev server serve every one of the
  // library's ~1500 icon modules as a separate request, which exhausted this
  // machine (ERR_INSUFFICIENT_RESOURCES) and left the page blank. Letting Vite
  // pre-bundle it collapses those into one dependency chunk. Production
  // builds were always fine: Rollup tree-shakes to the handful of icons used.
});
