import { test, expect } from '@playwright/test';

test.describe('Dashboard Rendering', () => {
  test('renders Hero Metric, Quick Log Grid, and Chart', async ({ page }) => {
    // Navigate directly to dashboard
    await page.goto('/');

    // Validate Hero Metric
    await expect(page.getByText('Overview')).toBeVisible();
    await expect(page.getByText("This Week's Footprint")).toBeVisible();
    await expect(page.getByText('kg CO₂e')).toBeVisible();

    // Validate Quick Log Grid
    await expect(page.getByText('Quick Log')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Food' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Drive' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Energy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Shop' })).toBeVisible();

    // Validate Recharts container
    await expect(page.getByText('Weekly Trend')).toBeVisible();
    const chartContainer = page.locator('.recharts-responsive-container');
    await expect(chartContainer).toBeVisible();

    // Validate Gamification (Streaks & Badges)
    await expect(page.getByText('Current Streak')).toBeVisible();
    await expect(page.getByText('Achievements')).toBeVisible();
  });
});
