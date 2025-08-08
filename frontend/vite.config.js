import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
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
  build: {
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu'],
      output: {
        format: 'es',
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'clsx', 'tailwind-merge']
        }
      }
    },
    target: 'es2020',
    minify: 'terser',
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});
