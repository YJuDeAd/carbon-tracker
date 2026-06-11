import { test, expect } from '@playwright/test';

test.describe('Log Activity Flow', () => {
  test('logs an activity and returns to dashboard', async ({ page }) => {
    // Mock the backend API response for logging an activity
    await page.route('**/activities', async route => {
      await route.fulfill({ status: 201, body: JSON.stringify({ success: true }) });
    });

    // Navigate to log page
    await page.goto('/log', { waitUntil: 'networkidle' });

    // Transport tab should be active/visible
    await expect(page.getByText('Vehicle Type')).toBeVisible();

    await page.locator('select#transport-type').selectOption({ label: 'Electric Car' });

    // Enter distance
    await page.fill('input#transport-dist', '45');

    // Wait slightly to ensure react state bound
    await page.waitForTimeout(500);

    // Submit form
    await page.getByRole('button', { name: 'Log Activity' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Overview')).toBeVisible();
  });
});
