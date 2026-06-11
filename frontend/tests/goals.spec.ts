import { test, expect } from '@playwright/test';

test.describe('Goals Page', () => {
  test('renders goals page and can open new goal modal', async ({ page }) => {
    // Navigate directly to goals
    await page.goto('/goals');

    // Wait for page to load
    await expect(page.locator('h1', { hasText: /^Goals$/ })).toBeVisible();
    
    // Validate the inline form renders
    await expect(page.getByRole('heading', { name: 'New Goal' })).toBeVisible();
    await expect(page.getByPlaceholder('Target (kg CO₂e)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Goal' })).toBeVisible();

    // Fill out the form
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Food' }).click();
    await page.getByPlaceholder('Target (kg CO₂e)').fill('100');

    // Click the Add Goal button
    await page.getByRole('button', { name: 'Add Goal' }).click();

    // Validate that the goals list exists (could be empty or not, but it shouldn't crash)
    await expect(page.getByText('Your Challenges')).toBeVisible();
  });
});
