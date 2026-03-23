import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('should display all three pricing tiers', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.getByRole('heading', { name: 'Choose Your Plan' })).toBeVisible();
    await expect(page.getByTestId('pricing-free')).toBeVisible();
    await expect(page.getByTestId('pricing-pro')).toBeVisible();
    await expect(page.getByTestId('pricing-collector')).toBeVisible();
  });

  test('should show correct prices', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.getByText('$0')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
  });

  test('should mark Pro plan as most popular', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.getByText('Most Popular')).toBeVisible();
  });

  test('should display features for each tier', async ({ page }) => {
    await page.goto('/pricing');

    // Free tier features
    await expect(page.getByText('Browse car listings')).toBeVisible();

    // Pro tier features
    await expect(page.getByText('Premium car reviews')).toBeVisible();

    // Collector tier features
    await expect(page.getByText('Market predictions & analytics')).toBeVisible();
  });

  test('should have CTA buttons for each tier', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.getByRole('link', { name: 'Get Started Free' })).toBeVisible();
    const subscribeButtons = page.getByRole('link', { name: 'Subscribe Now' });
    await expect(subscribeButtons.first()).toBeVisible();
  });

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/pricing');

    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
    await expect(page.getByText('Can I change my plan later?')).toBeVisible();
    await expect(page.getByText('Is there a free trial?')).toBeVisible();
    await expect(page.getByText('What payment methods do you accept?')).toBeVisible();
    await expect(page.getByText('Can I cancel at any time?')).toBeVisible();
  });

  test('should link CTA buttons to registration', async ({ page }) => {
    await page.goto('/pricing');

    const freeButton = page.getByRole('link', { name: 'Get Started Free' });
    await expect(freeButton).toHaveAttribute('href', '/auth/register');
  });
});
