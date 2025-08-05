import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        browser: {
          enabled: true,
          headless: true,
          instances: [{ browser: 'chromium' }],
          provider: 'playwright',
        },
        exclude: ['src/**/*.node.{spec,test}.ts'],
        extends: true,
        include: ['src/**/*.{spec,test}.ts'],
        name: 'unit',
      },
      {
        environment: 'node',
        extends: true,
        include: ['src/**/*.node.{spec,test}.ts'],
        name: 'unit:node',
      },
    ],
    watch: false,
  },
});
