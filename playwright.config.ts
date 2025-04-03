import { defineConfig } from '@playwright/test';

export default defineConfig({
    reporter: [
        ['html', { outputFolder: 'test-report', open: 'always' }],
      ],
    use: {
    video: 'off', 
    screenshot: 'only-on-failure',
    viewport: { width: 1920, height: 1080 }
  },
});