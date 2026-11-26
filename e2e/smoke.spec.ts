import { expect, test } from '@playwright/test';

test('home page renders', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Atera/i);
});

test('protected route redirects guests to login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login/);
});

test('demo login reaches the dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.locator('form button[data-slot="button"]').click();

    await expect(page).toHaveURL(/\/dashboard/);
});

test('route metadata updates per page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Atera/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /60\+ ready routes/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /\/dashboard-preview\.png$/,
    );

    await page.goto('/login');
    await expect(page).toHaveTitle(/Log in/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
    );
});

test('app routes are marked noindex', async ({ page }) => {
    await page.goto('/login');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await expect(page).toHaveTitle(/Dashboard/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
    );
});

test('robots and sitemap are served', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain('Sitemap:');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain('<urlset');
});
