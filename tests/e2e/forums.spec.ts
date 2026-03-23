import { test, expect } from '@playwright/test';

test.describe('Forums', () => {
  test.describe('Forum Categories Page', () => {
    test('should display forum categories', async ({ page }) => {
      await page.goto('/forums');

      await expect(page.getByRole('heading', { name: 'Community Forums' })).toBeVisible();
      await expect(page.getByTestId('forum-category-general')).toBeVisible();
      await expect(page.getByTestId('forum-category-classics')).toBeVisible();
      await expect(page.getByTestId('forum-category-market')).toBeVisible();
      await expect(page.getByTestId('forum-category-restoration')).toBeVisible();
      await expect(page.getByTestId('forum-category-buy-sell')).toBeVisible();
      await expect(page.getByTestId('forum-category-events')).toBeVisible();
    });

    test('should display forum content', async ({ page }) => {
      await page.goto('/forums');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should navigate to category page on click', async ({ page }) => {
      await page.goto('/forums');

      await page.getByTestId('forum-category-general').click();
      await expect(page).toHaveURL('/forums/general');
    });
  });

  test.describe('Forum Category Thread List', () => {
    test('should display category page', async ({ page }) => {
      await page.goto('/forums/general');

      await expect(page.locator('body')).toBeVisible();
    });

    test('should show New Thread button', async ({ page }) => {
      await page.goto('/forums/general');

      await expect(page.getByRole('link', { name: 'New Thread' })).toBeVisible();
    });

    test('should display threads', async ({ page }) => {
      await page.goto('/forums/general');

      const threads = page.locator('[data-testid^="thread-"]');
      await expect(threads.first()).toBeVisible();
    });
  });

  test.describe('Thread Detail Page', () => {
    test('should display thread content', async ({ page }) => {
      await page.goto('/forums/general');

      const firstThread = page.locator('[data-testid^="thread-"]').first();
      await firstThread.click();

      await expect(page.getByTestId('thread-title')).toBeVisible();
    });

    test('should show navigation', async ({ page }) => {
      await page.goto('/forums/general');
      const firstThread = page.locator('[data-testid^="thread-"]').first();
      await firstThread.click();

      await expect(page.locator('nav').first()).toBeVisible();
    });

    test('should display reply form', async ({ page }) => {
      await page.goto('/forums/general');
      const firstThread = page.locator('[data-testid^="thread-"]').first();
      await firstThread.click();

      await expect(page.getByTestId('reply-textarea')).toBeVisible();
    });

    test('should allow typing in reply textarea', async ({ page }) => {
      await page.goto('/forums/general');
      const firstThread = page.locator('[data-testid^="thread-"]').first();
      await firstThread.click();

      const textarea = page.getByTestId('reply-textarea');
      await textarea.fill('This is a test reply');
      await expect(textarea).toHaveValue('This is a test reply');
    });
  });
});
