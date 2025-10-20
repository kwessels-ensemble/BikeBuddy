import { defineConfig } from 'vitest/config'
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node', // or 'jsdom' for components
    globals: true,
    setupFiles: ['./src/__tests__/setup.js']
  },
  resolve: {
    alias: {
        '@': path.resolve(__dirname, 'src'),
    },
  },

})