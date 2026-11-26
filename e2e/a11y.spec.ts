import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const criticalViolations = async (page: Page) => {
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    return results.violations
        .filter((violation) => violation.impact === 'critical')
        .map((violation) => {
            const targets = violation.nodes.flatMap((node) => node.target).join(', ');
            return `${violation.id}: ${violation.help} [${targets}]`;
        });
};

const signInAsDemo = async (page: Page) => {
    await page.goto('/login');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard$/);
};

test.describe('accessibility', () => {
    test('home has no critical violations', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1').first()).toBeVisible();
        expect(await criticalViolations(page)).toEqual([]);
    });

    test('login has no critical violations', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('form')).toBeVisible();
        expect(await criticalViolations(page)).toEqual([]);
    });

    test('dashboard has no critical violations', async ({ page }) => {
        await signInAsDemo(page);
        await expect(page.locator('#main-content')).toBeVisible();
        expect(await criticalViolations(page)).toEqual([]);
    });
});
