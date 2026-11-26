import { expect, test } from '@playwright/test';

test('docs page stacks sections with a persistent section nav', async ({ page, context }) => {
    await page.goto('/docs');

    await expect(page.getByRole('heading', { name: 'Atera documentation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Getting started', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Architecture', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Troubleshooting', exact: true })).toHaveCount(
        1,
    );
    await expect(page.getByRole('link', { name: 'Link to Run the app' })).toHaveAttribute(
        'href',
        '#getting-started-run-the-app',
    );

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: 'Copy code' }).first().click();
    await expect(page.getByRole('button', { name: 'Copied code' }).first()).toBeVisible();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('bun install');

    const sectionNav = page
        .locator('aside')
        .getByRole('navigation', { name: 'Documentation sections' });
    const dependencies = sectionNav.getByRole('link', { name: 'Dependencies', exact: true });
    const theming = sectionNav.getByRole('link', { name: 'Theming', exact: true });

    await dependencies.click();
    await expect(page).toHaveURL(/#dependencies$/);
    await expect(dependencies).toHaveAttribute('aria-current', 'location');
    await expect(
        page.getByRole('heading', { name: 'Runtime packages', exact: true }),
    ).toBeInViewport();

    await theming.click();

    await expect(page).toHaveURL(/#theming$/);
    await expect(theming).toHaveAttribute('aria-current', 'location');
    await expect(page.getByRole('heading', { name: 'Theming', exact: true })).toBeInViewport();
    await expect(page.getByRole('heading', { name: 'Adding a page', exact: true })).toHaveCount(1);
});
