import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('completes baseline wizard and redirects to dashboard', async ({ page }) => {
    // 1. Navigate to onboarding
    await page.goto('/onboarding', { waitUntil: 'networkidle' });
    
    // Step 1: Diet
    await expect(page.getByText("What's your typical diet?")).toBeVisible();
    
    // Wait slightly for react state
    await page.waitForTimeout(500);

    await page.getByText('Vegetarian', { exact: true }).click();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2: Commute
    await expect(page.getByText('Weekly driving distance?')).toBeVisible();
    // Verify the slider thumb exists and is adjustable (simulated by checking visibility, adjusting via keyboard if needed)
    const sliderThumb = page.locator('[data-slot="slider-thumb"]');
    await expect(sliderThumb).toBeVisible();
    
    // We can simulate slider change using keyboard arrows
    await sliderThumb.focus();
    await page.keyboard.press('ArrowRight');
    
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3: Energy
    await expect(page.getByText('Home energy source?')).toBeVisible();
    await page.getByText('Solar Panels').click();
    
    // Finish wizard
    await page.getByRole('button', { name: 'Complete Profile' }).click();

    // Validate redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Overview')).toBeVisible();
  });
});
