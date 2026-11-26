import { expect, test } from '@playwright/test';

test('data table demos support client and server side paging', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'AteraDemo2026!');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/data-table/client');
    await expect(page.getByRole('heading', { name: 'Data table (client)' })).toBeVisible();
    await expect(page.getByText('48 results').first()).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('11-20 of 48').first()).toBeVisible();
    await page.getByPlaceholder('Search people...').fill('Olivia');
    await expect(page.getByText('6 results').first()).toBeVisible();

    await page.goto('/data-table/server');
    await expect(page.getByRole('heading', { name: 'Data table (server)' })).toBeVisible();
    await expect(page.getByText('48 results').first()).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('11-20 of 48').first()).toBeVisible();
    await page.getByPlaceholder('Search people...').fill('Emma');
    await expect(page.getByText('6 results').first()).toBeVisible();
});
