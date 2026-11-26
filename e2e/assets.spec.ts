import { expect, test } from '@playwright/test';

test('assets filter, inspect, create, edit, and delete', async ({ page }) => {
    await page.goto('/login');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto('/assets');
    await expect(page.getByRole('heading', { name: 'Assets', exact: true })).toBeVisible();
    await expect(page.getByText('12 results').first()).toBeVisible();

    await page.getByRole('button', { name: /^In maintenance/ }).click();
    await expect(page.getByText('2 results').first()).toBeVisible();

    await page.getByRole('button', { name: /^All/ }).click();
    await expect(page.getByText('12 results').first()).toBeVisible();

    await page
        .getByRole('row')
        .filter({ hasText: 'LT-0231' })
        .getByRole('button', { name: 'View' })
        .click();
    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(page.getByRole('heading', { name: /LT-0231/ })).toBeVisible();
    await expect(sheet).toHaveCSS('max-width', '576px');
    await expect(page.getByText('Active', { exact: true }).first()).toBeVisible();

    const statusBadge = sheet.locator('[data-slot="badge"]').first();
    const closeButton = sheet.getByRole('button', { name: 'Close' });
    const [statusBox, closeBox] = await Promise.all([
        statusBadge.boundingBox(),
        closeButton.boundingBox(),
    ]);
    expect(statusBox).not.toBeNull();
    expect(closeBox).not.toBeNull();
    expect(closeBox!.x).toBeGreaterThanOrEqual(statusBox!.x + statusBox!.width);

    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Add asset' }).first().click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Add asset' }).click();
    await expect(dialog.getByText('Tag is required')).toBeVisible();
    await expect(dialog.getByText('Name is required')).toBeVisible();

    await page.locator('#asset-tag').fill('QA-1000');
    await page.locator('#asset-name').fill('QA Laptop');
    await page.locator('#asset-value').fill('1500');
    await dialog.getByRole('button', { name: 'Add asset' }).click();

    await expect(page.getByText('Asset saved')).toBeVisible();
    await expect(page.getByText('13 results').first()).toBeVisible();

    const row = page.getByRole('row').filter({ hasText: 'QA-1000' }).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Edit' }).click();
    await page.locator('#asset-name').fill('QA Laptop Updated');
    await page.getByRole('dialog').getByRole('button', { name: 'Save changes' }).click();
    await expect(row).toContainText('QA Laptop Updated');

    const updatedRow = page.getByRole('row').filter({ hasText: 'QA-1000' }).first();
    await updatedRow.getByRole('button', { name: 'Delete' }).click();
    const confirm = page.getByRole('dialog');
    await confirm.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText('Asset deleted')).toBeVisible();
    await expect(page.getByText('12 results').first()).toBeVisible();
});
