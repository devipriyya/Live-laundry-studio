import { test, expect } from '@playwright/test';

test('shoe care pickup address section appears and validates correctly', async ({ page }) => {
  // Navigate to the new order page
  await page.goto('/new-order');
  
  // Wait for the page to load
  await expect(page.getByText('New Order')).toBeVisible();
  
  // Find and click the Shoe Care service
  const shoeCareCard = page.locator('.border-2').filter({ hasText: 'Shoe Care' });
  await shoeCareCard.click();
  
  // Click the increment button to add one item
  const incrementButton = shoeCareCard.locator('button').nth(2);
  await incrementButton.click();
  
  // Click Continue to go to step 2
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Wait for step 2 to load
  await expect(page.getByText('Schedule Pickup & Delivery')).toBeVisible();
  
  // Fill in pickup date and time
  await page.getByLabel('Pickup Date').fill('2023-12-01');
  await page.getByLabel('Pickup Time').selectOption('10:00 AM');
  
  // Fill in delivery date and time
  await page.getByLabel('Delivery Date').fill('2023-12-03');
  await page.getByLabel('Delivery Time').selectOption('2:00 PM');
  
  // Verify that the pickup address section is visible
  await expect(page.getByText('Pickup Address')).toBeVisible();
  await expect(page.getByLabel('Street Address *')).toBeVisible();
  await expect(page.getByLabel('City *')).toBeVisible();
  await expect(page.getByLabel('State *')).toBeVisible();
  await expect(page.getByLabel('ZIP Code *')).toBeVisible();
  await expect(page.getByLabel('Special Instructions (Optional)')).toBeVisible();
  
  // Try to continue without filling address fields (should show validation errors)
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Check for validation errors
  await expect(page.getByText('Street address is required for shoe care service')).toBeVisible();
  await expect(page.getByText('City is required for shoe care service')).toBeVisible();
  await expect(page.getByText('State is required for shoe care service')).toBeVisible();
  await expect(page.getByText('ZIP code is required for shoe care service')).toBeVisible();
  
  // Fill in the required address fields
  await page.getByLabel('Street Address *').fill('123 Main Street');
  await page.getByLabel('City *').fill('New York');
  await page.getByLabel('State *').selectOption('NY');
  await page.getByLabel('ZIP Code *').fill('10001');
  
  // Now continue should work
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Should navigate to step 3
  await expect(page.getByText('Address & Contact Information')).toBeVisible();
});