import { expect, test } from '@playwright/test';

test('login page matches visual baseline', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();

    await expect(page).toHaveScreenshot('login.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
    });
});
