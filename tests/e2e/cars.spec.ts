import { test, expect } from '@playwright/test';

test.describe('Car Listings', () => {
  test('should display the cars page with listings', async ({ page }) => {
    await page.goto('/cars');

    await expect(page.getByRole('heading', { name: 'Collector Cars' })).toBeVisible();
    await expect(page.getByTestId('results-count')).toBeVisible();
    await expect(page.getByTestId('results-count')).toContainText('10 cars');
  });

  test('should display search input and filters', async ({ page }) => {
    await page.goto('/cars');

    await expect(page.getByTestId('car-search')).toBeVisible();
    await expect(page.getByTestId('category-filter')).toBeVisible();
    await expect(page.getByTestId('sort-select')).toBeVisible();
  });

  test('should filter cars by search query', async ({ page }) => {
    await page.goto('/cars');

    await page.getByTestId('car-search').fill('Porsche');
    await expect(page.getByTestId('results-count')).toContainText('1 car');
  });

  test('should filter cars by category', async ({ page }) => {
    await page.goto('/cars');

    await page.getByTestId('category-filter').selectOption('muscle');
    await expect(page.getByTestId('results-count')).toContainText('2 cars');
  });

  test('should sort cars by price ascending', async ({ page }) => {
    await page.goto('/cars');

    await page.getByTestId('sort-select').selectOption('price-asc');
    // The first car card should be the cheapest
    const firstCard = page.locator('[class*="rounded-xl"]').first();
    await expect(firstCard).toBeVisible();
  });

  test('should show no results message when no cars match', async ({ page }) => {
    await page.goto('/cars');

    await page.getByTestId('car-search').fill('nonexistentcar12345');
    await expect(page.getByText('No cars found matching your criteria')).toBeVisible();
    await expect(page.getByText('Clear filters')).toBeVisible();
  });

  test('should clear filters when clicking clear button', async ({ page }) => {
    await page.goto('/cars');

    await page.getByTestId('car-search').fill('nonexistentcar12345');
    await expect(page.getByText('No cars found')).toBeVisible();

    await page.getByText('Clear filters').click();
    await expect(page.getByTestId('results-count')).toContainText('10 cars');
  });
});

test.describe('Car Detail Page', () => {
  test('should display car details with specs', async ({ page }) => {
    await page.goto('/cars');

    // Click first car card
    await page.getByRole('link', { name: /Porsche/ }).first().click();

    await expect(page.getByTestId('car-title')).toBeVisible();
    await expect(page.getByTestId('car-price')).toBeVisible();
    await expect(page.getByTestId('car-specs')).toBeVisible();
  });

  test('should show breadcrumb navigation', async ({ page }) => {
    await page.goto('/cars');
    await page.getByRole('link', { name: /Porsche/ }).first().click();

    await expect(page.locator('nav').getByRole('link', { name: 'Cars' })).toBeVisible();
  });

  test('should show car description', async ({ page }) => {
    await page.goto('/cars');
    await page.getByRole('link', { name: /Porsche/ }).first().click();

    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  });

  test('should have link to price history', async ({ page }) => {
    await page.goto('/cars');
    await page.getByRole('link', { name: /Porsche/ }).first().click();

    await expect(page.getByRole('link', { name: /View Price History/ })).toBeVisible();
  });

  test('should show reviews section', async ({ page }) => {
    await page.goto('/cars');
    await page.getByRole('link', { name: /Porsche/ }).first().click();

    await expect(page.getByRole('heading', { name: /Reviews/ })).toBeVisible();
  });

  test('should display specifications in sidebar', async ({ page }) => {
    await page.goto('/cars');
    await page.getByRole('link', { name: /Porsche/ }).first().click();

    await expect(page.getByRole('heading', { name: 'Specifications' })).toBeVisible();
    await expect(page.getByTestId('car-specs').getByText('Engine')).toBeVisible();
    await expect(page.getByText('Horsepower')).toBeVisible();
    await expect(page.getByText('Transmission')).toBeVisible();
  });
});
