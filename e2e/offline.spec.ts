import { expect, test } from '@playwright/test';

test('shows an offline banner when the connection drops', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'AteraDemo2026!');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();

    await page.context().setOffline(true);
    await expect(
        page.getByText('You are offline. Changes are saved on this device.'),
    ).toBeVisible();

    await page.context().setOffline(false);
    await expect(page.getByText('You are offline. Changes are saved on this device.')).toBeHidden();
});
