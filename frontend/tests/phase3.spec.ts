import { test, expect } from '@playwright/test';

test.describe('Phase 3 Features', () => {
  test('navigates to Education Hub', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'networkidle' });
    
    // Click on Explore in the Education Hub section
    await page.getByRole('link', { name: 'Explore' }).click();
    
    // Should be on education page
    await expect(page).toHaveURL(/\/education/);
    await expect(page.getByRole('heading', { name: 'Learn.' })).toBeVisible();
  });

  test('renders Community Challenges leaderboard', async ({ page }) => {
    await page.route('http://127.0.0.1:8000/goals', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    await page.route('http://127.0.0.1:8000/goals/*', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto('/goals', { waitUntil: 'networkidle' });
    
    // Click on Community tab
    await page.getByRole('tab', { name: 'Community' }).click();
    
    // Expect Community Leaderboard to be visible
    await expect(page.getByRole('heading', { name: 'Community Leaderboard' })).toBeVisible();
  });

  test('renders PWA offline fallback', async ({ page }) => {
    await page.goto('/offline', { waitUntil: 'networkidle' });
    await expect(page.getByText('You\'re Offline')).toBeVisible();
  });

  test('opens share/export card drawer on dashboard', async ({ page }) => {
    // Mock activities for dashboard
    await page.route('**/activities', async route => {
      await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Click Share button
    await page.getByRole('button', { name: 'Share' }).click();
    
    // Expect Share Drawer to open
    await expect(page.getByText('Share Your Progress')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save or Share Image' })).toBeVisible();
  });

  test('handles OpenStreetMap transport suggestion flow', async ({ page }) => {
    // Mock the suggest-transport endpoint
    await page.route('**/activities/suggest-transport*', async route => {
      await route.fulfill({ 
        status: 200, 
        body: JSON.stringify({ distance_km: 123.4, vehicle_type: 'Train', co2e_kg: 5.0 }) 
      });
    });

    await page.goto('/log?category=transport', { waitUntil: 'networkidle' });

    // Click Auto-calculate
    await page.getByRole('button', { name: 'Auto-calculate' }).click();

    // Fill origin and destination
    await page.getByPlaceholder('Origin (e.g. London)').fill('London');
    await page.getByPlaceholder('Destination (e.g. Paris)').fill('Paris');

    // Click Suggest Distance
    await page.getByRole('button', { name: 'Suggest Distance' }).click();

    // Expect the fallback to manual input with the calculated distance
    await expect(page.locator('input#transport-dist')).toHaveValue('123.4');
  });
});
