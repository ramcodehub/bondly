import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Minimal configuration for Netlify
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared-ui': path.resolve(__dirname, 'shared-ui/src')
    }
  },
  server: {
    port: 5174
  },
  // Disable sourcemaps for production
  build: {
    sourcemap: false,
    // Use esbuild for minification instead of terser
    minify: 'esbuild',
    // Target modern browsers
    target: 'es2020'
  }
});
