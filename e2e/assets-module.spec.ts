import { expect, test } from '@playwright/test';

test('assets module pages group assignments and filter maintenance and warranties', async ({
    page,
}) => {
    await page.goto('/login');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto('/assets/assignments');
    await expect(page.getByRole('heading', { name: 'Assignments', exact: true })).toBeVisible();
    await expect(page.getByRole('table').getByText('Olivia Martin')).toBeVisible();
    await expect(page.getByText('Unassigned').first()).toBeVisible();

    await page.goto('/assets/maintenance');
    await expect(page.getByRole('heading', { name: 'Maintenance', exact: true })).toBeVisible();
    await expect(page.getByText('2 results').first()).toBeVisible();
    await expect(page.getByRole('table').getByText('LT-0119')).toBeVisible();

    await page.goto('/assets/warranties');
    await expect(page.getByRole('heading', { name: 'Warranties', exact: true })).toBeVisible();
    await expect(page.getByText('12 results').first()).toBeVisible();
    await page.getByRole('button', { name: /^Expired/ }).click();
    await expect(page.getByText('5 results').first()).toBeVisible();
});
