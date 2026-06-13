import { test, expect } from '@playwright/test';
test('debug goals', async ({ page }) => {
  await page.route('**/goals', async route => {
    await route.fulfill({ status: 200, body: JSON.stringify([]) });
  });
  await page.goto('/goals', { waitUntil: 'networkidle' });
  const html = await page.content();
  console.log(html);
});
