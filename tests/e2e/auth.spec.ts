import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test('should display login form with all fields', async ({ page }) => {
      await page.goto('/auth/login');

      await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    });

    test('should have link to register page', async ({ page }) => {
      await page.goto('/auth/login');

      const signUpLink = page.getByRole('link', { name: 'Sign up' });
      await expect(signUpLink).toBeVisible();
      await expect(signUpLink).toHaveAttribute('href', '/auth/register');
    });

    test('should have remember me checkbox and forgot password link', async ({ page }) => {
      await page.goto('/auth/login');

      await expect(page.getByText('Remember me')).toBeVisible();
      await expect(page.getByText('Forgot password?')).toBeVisible();
    });

    test('should require email and password fields', async ({ page }) => {
      await page.goto('/auth/login');

      const emailInput = page.getByLabel('Email');
      const passwordInput = page.getByLabel('Password');

      await expect(emailInput).toHaveAttribute('required', '');
      await expect(passwordInput).toHaveAttribute('required', '');
    });

    test('should submit login form and show success', async ({ page }) => {
      await page.goto('/auth/login');

      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Sign In' }).click();

      await expect(page.getByText('Welcome back!')).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('link', { name: 'Go to Homepage' })).toBeVisible();
    });
  });

  test.describe('Register Page', () => {
    test('should display registration form with all fields', async ({ page }) => {
      await page.goto('/auth/register');

      await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
      await expect(page.getByLabel('Username')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    });

    test('should have link to login page', async ({ page }) => {
      await page.goto('/auth/register');

      const form = page.locator('form');
      const signInLink = form.getByRole('link', { name: 'Sign in' });
      await expect(signInLink).toBeVisible();
      await expect(signInLink).toHaveAttribute('href', '/auth/login');
    });

    test('should show password requirements', async ({ page }) => {
      await page.goto('/auth/register');

      await expect(page.getByText('Must be at least 8 characters')).toBeVisible();
    });

    test('should submit registration form and show success', async ({ page }) => {
      await page.goto('/auth/register');

      await page.getByLabel('Username').fill('testuser');
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Account created!')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Auth Navigation', () => {
    test('should navigate from login to register', async ({ page }) => {
      await page.goto('/auth/login');
      await page.getByRole('link', { name: 'Sign up' }).click();
      await expect(page).toHaveURL('/auth/register');
      await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
    });

    test('should navigate from register to login', async ({ page }) => {
      await page.goto('/auth/register');
      await page.locator('form').getByRole('link', { name: 'Sign in' }).click();
      await expect(page).toHaveURL('/auth/login');
      await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    });
  });
});
