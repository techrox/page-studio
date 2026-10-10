// Shared Vitest config — each package extends this so test setup stays consistent.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['../../vitest.setup.js'],
    css: false,
    // `pnpm test:coverage` enforces each package's floor (set in its own
    // vitest.config.js). Raise a floor when coverage goes up; never lower it.
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      reporter: ['text-summary', 'lcov'],
    },
  },
});

// Per-package coverage floor, merged over the shared config.
export function coverageFloor(thresholds) {
  return { test: { coverage: { thresholds } } };
}
