import { expect, test } from '@playwright/test';

test('home loads the real dashboard inside the preview frame', async ({ page }) => {
    await page.goto('/');

    const live = page.getByRole('region', { name: 'Live dashboard preview', exact: true });
    await expect(live).toBeVisible();

    const frame = page.frameLocator('iframe[title="Atera live dashboard preview"]');
    await expect(frame.getByText('Total revenue').first()).toBeVisible({ timeout: 15000 });

    await expect
        .poll(() => page.frames().some((item) => item.url().includes('/dashboard')))
        .toBe(true);

    const nav = frame.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();
    await nav.getByRole('link', { name: 'Orders', exact: true }).click();

    await expect
        .poll(() => page.frames().some((item) => item.url().includes('/orders')))
        .toBe(true);
    await expect(frame.getByRole('heading', { name: 'Orders' }).first()).toBeVisible();
});

test('browse the demo scrolls to the live preview without a login step', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Browse the demo' }).first().click();

    await expect(page).toHaveURL(/#live-preview$/);
    await expect(
        page.getByRole('region', { name: 'Live dashboard preview', exact: true }),
    ).toBeInViewport();
    await expect(page).not.toHaveURL(/\/login$/);
});

test('in-page navigation scrolls smoothly to the matching section', async ({ page }) => {
    await page.goto('/');

    await page
        .getByRole('navigation', { name: 'Main' })
        .getByRole('link', { name: 'Pricing' })
        .click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(
        page.getByRole('heading', { name: 'One purchase, every page included' }),
    ).toBeInViewport();

    await page
        .getByRole('navigation', { name: 'Template' })
        .getByRole('link', { name: 'Features' })
        .click();
    await expect(page).toHaveURL(/#features$/);
    await expect(
        page.getByRole('heading', { name: 'Every page your admin panel needs, already built' }),
    ).toBeInViewport();
});

test('showcase preview switches pages without a login step', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('region', { name: 'Analytics page preview', exact: true }),
    ).toBeVisible();

    const analyticsFrame = page.frameLocator('iframe[title="Atera Analytics page preview"]');
    await expect(analyticsFrame.getByRole('heading', { name: 'Analytics' }).first()).toBeVisible({
        timeout: 15000,
    });

    await page.getByRole('button', { name: 'Orders', exact: true }).click();

    const ordersFrame = page.frameLocator('iframe[title="Atera Orders page preview"]');
    await expect(ordersFrame.getByRole('heading', { name: 'Orders' }).first()).toBeVisible({
        timeout: 15000,
    });
    await expect
        .poll(() => page.frames().some((item) => item.url().includes('/orders')))
        .toBe(true);
    await expect(page).not.toHaveURL(/\/login$/);
});

test('preview route opens a page without a login step', async ({ page }) => {
    await page.goto('/preview?to=/analytics');

    await expect(page).toHaveURL(/\/analytics$/);
    await expect(page.getByRole('heading', { name: 'Analytics' }).first()).toBeVisible();
    await expect(page).not.toHaveURL(/\/login$/);
});

test.describe('mobile', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('shows the compact preview instead of the live frame', async ({ page }) => {
        await page.goto('/');

        await expect(
            page.getByRole('region', { name: 'Dashboard preview', exact: true }).first(),
        ).toBeVisible();
        await expect(
            page.getByRole('region', { name: 'Live dashboard preview', exact: true }),
        ).toBeHidden();
    });
});
