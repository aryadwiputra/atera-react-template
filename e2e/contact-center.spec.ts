import { expect, test } from '@playwright/test';

async function signIn(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.locator('form button[data-slot="button"]').click();
    await expect(page).toHaveURL(/\/dashboard$/);
}

test('contact center overview surfaces the live queue', async ({ page }) => {
    await signIn(page);
    await page.goto('/contact-center');

    await expect(page.getByRole('heading', { name: 'Overview', exact: true })).toBeVisible();
    await expect(page.getByText('Needs attention', { exact: true })).toBeVisible();
    await expect(page.getByText('Channels', { exact: true })).toBeVisible();
    await expect(page.getByText('Agent workload', { exact: true })).toBeVisible();
    await expect(page.getByText('Latest emails', { exact: true })).toBeVisible();
    await expect(page.getByText('Social queue', { exact: true })).toBeVisible();

    await expect(
        page.locator('[data-slot="card"]').filter({ hasText: 'Open conversations' }),
    ).toContainText('5');
    await expect(
        page.locator('[data-slot="card"]').filter({ hasText: 'Unread conversations' }),
    ).toContainText('3');
    await expect(
        page.locator('[data-slot="card"]').filter({ hasText: 'Unread emails' }),
    ).toContainText('4');
    await expect(
        page.locator('[data-slot="card"]').filter({ hasText: 'New comments' }),
    ).toContainText('6');
});

test('live chat filters conversations by priority', async ({ page }) => {
    await signIn(page);
    await page.goto('/contact-center/live-chat');

    await page.getByRole('combobox', { name: 'Priority' }).click();
    await page.getByRole('option', { name: 'High', exact: true }).click();

    await expect(page.getByText('3/10', { exact: true })).toBeVisible();
    await expect(page.getByText('Amelia Hart', { exact: true })).toBeVisible();
    await expect(page.getByText('Sofia Reyes', { exact: true })).toBeVisible();
    await expect(page.getByText('Ethan Brooks', { exact: true })).toBeVisible();
    await expect(page.getByText('Noah Patel', { exact: true })).toHaveCount(0);
});

test('email list archives several messages at once', async ({ page }) => {
    await signIn(page);
    await page.goto('/contact-center/emails');

    await page.getByRole('checkbox', { name: 'Order #4821 delivery delay' }).click();
    await page.getByRole('checkbox', { name: 'Team billing question' }).click();
    await expect(page.getByText(/2 selected/i)).toBeVisible();

    await page.getByRole('button', { name: 'Archive', exact: true }).click();

    await expect(page.getByText(/2 selected/i)).toBeHidden();
    await expect(page.getByText('Order #4821 delivery delay')).toHaveCount(0);
    await expect(page.getByText('Team billing question')).toHaveCount(0);
});

test('social comments hide several comments at once', async ({ page }) => {
    await signIn(page);
    await page.goto('/contact-center/social-comments');

    const hiddenBefore = await page.getByText('Hidden', { exact: true }).count();
    await page.getByRole('checkbox', { name: /^luna\.creates:/ }).click();
    await page.getByRole('checkbox', { name: /^Marcus T\.:/ }).click();
    await expect(page.getByText(/2 selected/i)).toBeVisible();

    await page.getByRole('button', { name: 'Hide', exact: true }).click();

    await expect(page.getByText(/2 selected/i)).toBeHidden();
    await expect
        .poll(async () => page.getByText('Hidden', { exact: true }).count())
        .toBeGreaterThan(hiddenBefore);
});

test('email and social sections keep their own scrollbars', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await signIn(page);

    await page.goto('/contact-center/emails');
    await expect(page.locator('[data-section-scroll="email-folders"]')).toHaveCSS(
        'scrollbar-width',
        'thin',
    );
    for (const id of ['email-list']) {
        const pane = page.locator(`[data-section-scroll="${id}"]`);
        await expect(pane).toBeVisible();
        const metrics = await pane.evaluate((element) => ({
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            scrollbar: getComputedStyle(element).scrollbarWidth,
        }));
        expect(metrics.scrollHeight, id).toBeGreaterThan(metrics.clientHeight);
        expect(metrics.scrollbar).not.toBe('none');
        await pane.hover();
        await page.mouse.wheel(0, 300);
        await expect
            .poll(async () => pane.evaluate((element) => element.scrollTop))
            .toBeGreaterThan(0);
    }

    await page.goto('/contact-center/social-comments');
    await expect(page.locator('[data-section-scroll="social-filters"]')).toHaveCSS(
        'scrollbar-width',
        'thin',
    );
    for (const id of ['social-list']) {
        const pane = page.locator(`[data-section-scroll="${id}"]`);
        await expect(pane).toBeVisible();
        const metrics = await pane.evaluate((element) => ({
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            scrollbar: getComputedStyle(element).scrollbarWidth,
        }));
        expect(metrics.scrollHeight, id).toBeGreaterThan(metrics.clientHeight);
        expect(metrics.scrollbar).not.toBe('none');
        await pane.hover();
        await page.mouse.wheel(0, 300);
        await expect
            .poll(async () => pane.evaluate((element) => element.scrollTop))
            .toBeGreaterThan(0);
    }
});
