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

    test('should display category descriptions and thread counts', async ({ page }) => {
      await page.goto('/forums');

      await expect(page.getByText(/threads$/)).toBeVisible();
      await expect(page.getByText('Talk about anything car-related')).toBeVisible();
    });

    test('should navigate to category page on click', async ({ page }) => {
      await page.goto('/forums');

      await page.getByTestId('forum-category-general').click();
      await expect(page).toHaveURL('/forums/general');
    });
  });

  test.describe('Forum Category Thread List', () => {
    test('should display threads in a category', async ({ page }) => {
      await page.goto('/forums/general');

      await expect(page.getByRole('heading', { name: 'General Discussion' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Forums' })).toBeVisible();
    });

    test('should show New Thread button', async ({ page }) => {
      await page.goto('/forums/general');

      await expect(page.getByRole('link', { name: 'New Thread' })).toBeVisible();
    });

    test('should display thread titles and reply counts', async ({ page }) => {
      await page.goto('/forums/general');

      // Check that thread items exist
      const threads = page.locator('[data-testid^="thread-"]');
      const count = await threads.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Thread Detail Page', () => {
    test('should display thread content and replies', async ({ page }) => {
      await page.goto('/forums/general');

      // Click the first thread
      const firstThread = page.locator('[data-testid^="thread-"]').first();
      await firstThread.click();

      await expect(page.getByTestId('thread-title')).toBeVisible();
    });

    test('should show breadcrumb navigation', async ({ page }) => {
      await page.goto('/forums/general');
      const firstThread = page.locator('[data-testid^="thread-"]').first();
      await firstThread.click();

      await expect(page.getByRole('link', { name: 'Forums' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'General Discussion' })).toBeVisible();
    });

    test('should display reply form', async ({ page }) => {
      await page.goto('/forums/general');
      const firstThread = page.locator('[data-testid^="thread-"]').first();
      await firstThread.click();

      await expect(page.getByTestId('reply-textarea')).toBeVisible();
      await expect(page.getByTestId('reply-submit')).toBeVisible();
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
