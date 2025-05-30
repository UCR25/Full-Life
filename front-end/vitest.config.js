import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8', // or 'c8' if you prefer
      reporter: ['text', 'html'],
    },
  },
});