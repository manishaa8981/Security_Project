import { test, expect } from '@playwright/test';

// ================================================
// 3. Responsive Layout Tests
// ================================================
test.describe('Responsive Layout', () => {
    test('Adjusts on mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000');
      
      // Ensure key elements remain visible
      await expect(page.locator('header')).toBeVisible();
    });
  });
  

  