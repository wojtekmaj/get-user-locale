import { defineConfig } from 'vitest/config';

import type { ViteUserConfig } from 'vitest/config';

const config: ViteUserConfig = defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'browser',
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: 'playwright',
          },
          exclude: ['src/**/*.node.{spec,test}.ts'],
          include: ['src/**/*.{spec,test}.ts'],
        },
      },
      {
        test: {
          name: 'node',
          environment: 'node',
          include: ['src/**/*.node.{spec,test}.ts'],
        },
      },
    ],
    watch: false,
  },
});

export default config;
