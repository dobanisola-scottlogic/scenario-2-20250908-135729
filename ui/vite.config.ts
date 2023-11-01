/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/dist/config.js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './setupTests.ts',
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    onConsoleLog(log) {
      if (log.includes('Download the React DevTools')) {return false;}
    },
  },
  ...(mode === 'production' && { base: '/application/ui/' }),
}));
