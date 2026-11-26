import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            testIgnore: /visual\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            testMatch: /smoke\.spec\.ts/,
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            testMatch: /smoke\.spec\.ts/,
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'visual',
            testMatch: /visual\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1280, height: 800 },
                colorScheme: 'light',
            },
        },
    ],
    webServer: {
        command: 'bun run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
