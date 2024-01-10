/// <reference types="vitest" />
import alias from '@rollup/plugin-alias';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/dist/config.js';

const projectRootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    alias({
      entries: [
        {
          find: '~',
          replacement: resolve(projectRootDir, 'src'),
        },
      ],
    }),
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './setupTests.ts',
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    onConsoleLog(log) {
      if (log.includes('Download the React DevTools')) {
        return false;
      }
    },
    coverage: {
      reporter: ['text', 'json', 'html', 'cobertura'],
      statements: 98,
      branches: 97,
      functions: 90,
      lines: 98,
    },
  },
  ...(mode === 'production' && { base: '/application/ui/' }),
}));
