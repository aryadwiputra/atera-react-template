import { expect, test } from '@playwright/test';

const customerName = 'Persistence Tester';

test('orders persist across reloads and reset to seeds', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'AteraDemo2026!');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/orders');
    await expect(page.getByRole('table')).toBeVisible();

    await page.getByRole('link', { name: 'New order' }).first().click();
    await expect(page).toHaveURL(/\/orders\/new/);

    await page.getByPlaceholder('Customer name').fill(customerName);
    await page.getByPlaceholder('customer@example.com').fill('persistence@example.com');
    await page.getByPlaceholder('Product or plan').fill('Pro subscription');
    await page.locator('input[type="number"]').fill('199');
    await page.getByRole('button', { name: 'Save order' }).click();

    await expect(page).toHaveURL(/\/orders$/);
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText(customerName).first()).toBeVisible();

    await page.reload();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText(customerName).first()).toBeVisible();

    const workspace = page.getByRole('region', { name: 'Local workspace' }).first();
    await workspace.getByRole('button', { name: 'Reset' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Reset workspace' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Reset workspace' }).click();

    await expect(page.getByText(customerName)).toHaveCount(0);
    await expect(page.getByText('Olivia Martin').first()).toBeVisible();
});
