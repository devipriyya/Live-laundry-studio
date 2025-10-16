import { test, expect } from '@playwright/test';

test.describe('Authentication and Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5185/');
  });

  test('should remove admin option from registration form', async ({ page }) => {
    // Navigate to registration page from landing page
    await page.getByRole('link', { name: 'Explore More' }).click();
    await expect(page).toHaveURL('/register');

    // Verify page loads correctly
    await expect(page.getByRole('heading', { name: 'Register Here' })).toBeVisible();

    // Check role selection dropdown
    const roleSelect = page.getByRole('combobox');
    await expect(roleSelect).toBeVisible();
    
    // Get all options in the dropdown
    const options = await roleSelect.locator('option').allInnerTexts();
    
    // Verify admin option is not present
    expect(options).not.toContain('Admin');
    
    // Verify only customer and delivery options are present
    expect(options).toContain('Customer');
    expect(options).toContain('Delivery Person');
    expect(options).toHaveLength(2);
  });

  test('should display improved error message for disabled email/password auth', async ({ page }) => {
    // Navigate to registration page
    await page.getByRole('link', { name: 'Explore More' }).click();
    
    // Fill out the registration form
    await page.getByRole('textbox', { name: 'Name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('TestPassword123!');
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('TestPassword123!');
    await page.getByRole('combobox').selectOption('Customer');

    // Submit the form
    await page.getByRole('button', { name: 'Register' }).click();

    // Wait for the error message to appear
    await expect(page.getByText('Email/password registration is currently disabled. Please contact support or try signing up with Google.')).toBeVisible();
    
    // Verify the form is still accessible after error
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up with Google' })).toBeVisible();
  });

  test('should allow navigation to login page for admin access', async ({ page }) => {
    // Navigate to login page from landing page
    await page.getByRole('link', { name: 'Log In / Sign Up' }).click();
    await expect(page).toHaveURL('/login');

    // Verify login page elements are present
    await expect(page.getByRole('heading', { name: 'Login Here' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🎭 Demo Login (Try Dashboard)' })).toBeVisible();
  });

  test('should navigate between registration and login pages correctly', async ({ page }) => {
    // Start from registration page
    await page.getByRole('link', { name: 'Explore More' }).click();
    await expect(page).toHaveURL('/register');

    // Navigate to login page
    await page.getByRole('link', { name: 'Sign in here' }).click();
    await expect(page).toHaveURL('/login');

    // Navigate back to registration page
    await page.getByRole('link', { name: 'Sign up here' }).click();
    await expect(page).toHaveURL('/register');

    // Verify role selection still doesn't have admin option
    const options = await page.getByRole('combobox').locator('option').allInnerTexts();
    expect(options).not.toContain('Admin');
  });

  test('should have proper form validation on registration page', async ({ page }) => {
    await page.getByRole('link', { name: 'Explore More' }).click();

    // Test empty form submission
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Should show validation errors for required fields
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();

    // Test password strength indicator
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('weak');
    await expect(page.getByText('Weak')).toBeVisible();

    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('StrongPassword123!');
    await expect(page.getByText('Strong')).toBeVisible();
  });
});