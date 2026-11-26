import { expect, test } from '@playwright/test';

test('theme controls drive density, shape, layout, header, container, and sidebar', async ({
    page,
}) => {
    await page.goto('/login');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/dashboard/);

    const html = page.locator('html');
    const group = (name: string) => page.getByRole('group', { name });
    const openStudio = async () => {
        await page.getByRole('button', { name: 'Customize theme' }).first().click();
        await expect(page.getByRole('dialog')).toBeVisible();
    };
    const cssVar = (name: string) =>
        page.evaluate(
            (token) => getComputedStyle(document.documentElement).getPropertyValue(token).trim(),
            name,
        );

    await openStudio();

    await group('Density').getByRole('button', { name: 'Compact' }).click();
    await expect(html).toHaveAttribute('data-density', 'compact');
    expect(await cssVar('--control-h')).toBe('2rem');
    expect(await cssVar('--card-p')).toBe('1rem');
    expect(await cssVar('--page-gap')).toBe('1rem');

    await group('Corner radius').getByRole('button', { name: '1rem' }).click();
    await expect(html).toHaveAttribute('data-radius', 'lg');
    expect(await cssVar('--radius')).toBe('1rem');

    await group('Typeface').getByRole('button', { name: 'Serif' }).click();
    await expect(html).toHaveAttribute('data-font', 'serif');
    expect(await cssVar('--font-sans')).toContain('ui-serif');

    await group('Layout').getByRole('button', { name: 'Top nav' }).click();
    await expect(html).toHaveAttribute('data-layout', 'top-nav');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await openStudio();

    await group('Header').getByRole('button', { name: 'Static' }).click();
    await expect(html).toHaveAttribute('data-header', 'static');
    await expect(page.locator('[data-app-header]')).toHaveCSS('position', 'static');

    await group('Container').getByRole('button', { name: 'Boxed' }).click();
    await expect(html).toHaveAttribute('data-container', 'boxed');
    await expect(page.locator('main#main-content')).toHaveCSS('max-width', '1280px');

    await group('Layout').getByRole('button', { name: 'Sidebar' }).click();
    await expect(html).toHaveAttribute('data-layout', 'sidebar');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await openStudio();

    await group('Sidebar style').getByRole('button', { name: 'Floating' }).click();
    await expect(html).toHaveAttribute('data-sidebar', 'floating');

    await group('Sidebar width').getByRole('button', { name: 'Wide' }).click();
    await expect(html).toHaveAttribute('data-sidebar-width', 'wide');
    expect(await cssVar('--app-sidebar-width')).toBe('296px');

    const cardPadding = await page
        .locator('[data-slot="card"]')
        .first()
        .evaluate((element) => getComputedStyle(element).paddingTop);
    expect(cardPadding).toBe('16px');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-layout', 'sidebar');
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact');
    await expect(page.locator('html')).toHaveAttribute('data-sidebar', 'floating');
    await expect(page.locator('html')).toHaveAttribute('data-radius', 'lg');
});
