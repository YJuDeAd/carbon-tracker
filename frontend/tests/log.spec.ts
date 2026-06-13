import { test, expect } from '@playwright/test';

test.describe('Log Activity Flow', () => {
  test('logs an activity and returns to dashboard', async ({ page }) => {
    // Mock the backend API response for logging an activity
    await page.route('**/activities', async route => {
      await route.fulfill({ status: 201, body: JSON.stringify({ success: true }) });
    });

    // Navigate to log page
    await page.goto('/log', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Electric Car', exact: true }).click();

    // Enter distance
    await page.locator('input[placeholder="0"]').fill('45');

    // Wait slightly to ensure react state bound
    await page.waitForTimeout(500);

    // Submit form
    await page.getByRole('button', { name: 'Log Activity' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Overview')).toBeVisible();
  });
});
