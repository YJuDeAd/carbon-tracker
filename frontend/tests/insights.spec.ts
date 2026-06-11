import { test, expect } from '@playwright/test';

test.describe('Insights Page', () => {
  test('renders AI insights section and tips', async ({ page }) => {
    // Navigate directly to insights
    await page.goto('/insights');

    // Wait for page to load
    await expect(page.getByText('AI Insights')).toBeVisible();
    await expect(page.getByText('Powered by llama-3')).toBeVisible();

    // Check if loading state or tips show up
    const loadingState = page.locator('.animate-pulse');
    const tipCards = page.locator('.text-lg.font-bold');

    // Either we see loading skeletons or the actual tips
    await Promise.any([
      expect(loadingState.first()).toBeVisible(),
      expect(tipCards.first()).toBeVisible()
    ]);
  });
});
