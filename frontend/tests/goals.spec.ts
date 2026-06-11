import { test, expect } from '@playwright/test';

test.describe('Goals Page', () => {
  test('renders goals page and can open new goal modal', async ({ page }) => {
    // Navigate directly to goals
    await page.goto('/goals');

    // Wait for page to load
    await expect(page.locator('h1', { hasText: /^Goals$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Set New Goal' })).toBeVisible();

    // Click the Set New Goal button
    await page.getByRole('button', { name: 'Set New Goal' }).click();

    // Validate the modal opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Target (kg CO₂e)')).toBeVisible();
    await expect(page.getByText('Category')).toBeVisible();
    await expect(page.getByText('Deadline')).toBeVisible();

    // Close the modal
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
