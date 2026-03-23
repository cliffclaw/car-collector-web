import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('Header Navigation', () => {
    test('should display the header with logo', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('link', { name: /CarCollector/ }).first()).toBeVisible();
    });

    test('should have navigation links', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('link', { name: 'Cars' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Forums' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Pricing' }).first()).toBeVisible();
    });

    test('should navigate to Cars page', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'Cars' }).first().click();
      await expect(page).toHaveURL('/cars');
      await expect(page.getByRole('heading', { name: 'Collector Cars' })).toBeVisible();
    });

    test('should navigate to Forums page', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'Forums' }).first().click();
      await expect(page).toHaveURL('/forums');
      await expect(page.getByRole('heading', { name: 'Community Forums' })).toBeVisible();
    });

    test('should navigate to Pricing page', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'Pricing' }).first().click();
      await expect(page).toHaveURL('/pricing');
      await expect(page.getByRole('heading', { name: 'Choose Your Plan' })).toBeVisible();
    });

    test('should have Sign In button', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();
    });
  });

  test.describe('Home Page', () => {
    test('should display hero section', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByText('Trusted by 50,000+')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Browse Cars' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'View Plans' })).toBeVisible();
    });

    test('should display stats section', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByText('2,500+')).toBeVisible();
      await expect(page.getByText('50K+')).toBeVisible();
    });

    test('should display featured cars section', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('heading', { name: /Featured/ })).toBeVisible();
      await expect(page.getByRole('link', { name: 'View All' })).toBeVisible();
    });

    test('should navigate from hero to cars page', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'Browse Cars' }).click();
      await expect(page).toHaveURL('/cars');
    });

    test('should navigate from hero to pricing page', async ({ page }) => {
      await page.goto('/');

      await page.getByRole('link', { name: 'View Plans' }).click();
      await expect(page).toHaveURL('/pricing');
    });
  });

  test.describe('Theme Toggle', () => {
    test('should have a theme toggle button', async ({ page }) => {
      await page.goto('/');

      // The theme toggle button should be present in the header
      const themeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      await expect(themeButton).toBeVisible();
    });
  });

  test.describe('Footer', () => {
    test('should display footer with links', async ({ page }) => {
      await page.goto('/');

      await expect(page.getByText(/© \d{4} CarCollector/)).toBeVisible();
    });

    test('should have explore links in footer', async ({ page }) => {
      await page.goto('/');

      const footer = page.locator('footer');
      await expect(footer.getByRole('link', { name: 'Car Listings' })).toBeVisible();
      await expect(footer.getByRole('link', { name: 'Forums' })).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should show sign in prompt on dashboard', async ({ page }) => {
      await page.goto('/dashboard');

      await expect(page.getByText('Sign in required')).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Create Account' })).toBeVisible();
    });

    test('should show sign in prompt on profile', async ({ page }) => {
      await page.goto('/profile');

      await expect(page.getByText('Sign in required')).toBeVisible();
    });
  });
});
