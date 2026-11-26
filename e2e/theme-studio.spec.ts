import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('theme studio applies an accent, a preset, and persists', async ({ page }) => {
    await page.goto('/login');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard$/);

    const openStudio = async () => {
        await page.getByRole('button', { name: 'Customize theme' }).first().click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByText('Theme studio')).toBeVisible();
    };

    await openStudio();

    const accentGroup = page.getByRole('group', { name: 'Accent' });
    await accentGroup.getByRole('button', { name: 'Blue' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-accent', 'blue');

    await page.getByRole('button', { name: 'Close' }).first().click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-accent', 'blue');

    await openStudio();
    await page.getByRole('button', { name: /Slate Blue/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-accent', 'blue');
    await expect(page.locator('html')).toHaveAttribute('data-neutral', 'slate');
    await expect(page.locator('html')).toHaveAttribute('data-radius', 'sm');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const critical = results.violations.filter((violation) => violation.impact === 'critical');
    expect(critical).toEqual([]);
});
