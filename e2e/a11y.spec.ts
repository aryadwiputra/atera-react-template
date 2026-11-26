import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const wcagViolations = async (page: Page, selector?: string) => {
    const builder = new AxeBuilder({ page });
    if (selector) builder.include(selector);
    const results = await builder
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
    return results.violations
        .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
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

// Entrance animations fade elements in; scan once they have settled so axe
// does not report transient mid-animation contrast states.
const settleAnimations = async (page: Page) => {
    await page.waitForTimeout(1000);
};

test.describe('accessibility', () => {
    test('home has no serious or critical WCAG violations', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1').first()).toBeVisible();
        await settleAnimations(page);
        expect(await wcagViolations(page)).toEqual([]);
    });

    test('login has no serious or critical WCAG violations', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('form')).toBeVisible();
        await settleAnimations(page);
        expect(await wcagViolations(page)).toEqual([]);
    });

    test('dashboard has no serious or critical WCAG violations', async ({ page }) => {
        await signInAsDemo(page);
        await expect(page.locator('#main-content')).toBeVisible();
        await settleAnimations(page);
        expect(await wcagViolations(page)).toEqual([]);
    });

    test('orders has no serious or critical WCAG violations', async ({ page }) => {
        await signInAsDemo(page);
        await page.goto('/orders');
        await expect(page.locator('#main-content')).toBeVisible();
        await settleAnimations(page);
        expect(await wcagViolations(page)).toEqual([]);
    });

    test('users page status chips meet contrast', async ({ page }) => {
        await signInAsDemo(page);
        await page.goto('/users');
        await expect(page.locator('#main-content')).toBeVisible();
        await settleAnimations(page);
        expect(await wcagViolations(page, '#main-content')).toEqual([]);
    });

    test('users row menu keeps destructive actions readable', async ({ page }) => {
        await signInAsDemo(page);
        await page.goto('/users');
        await page.getByRole('button', { name: 'Edit' }).first().click();
        await expect(page.getByRole('menuitem', { name: 'Delete' }).first()).toBeVisible();
        await settleAnimations(page);
        expect(await wcagViolations(page, '[data-slot="dropdown-menu-content"]')).toEqual([]);
    });
});
