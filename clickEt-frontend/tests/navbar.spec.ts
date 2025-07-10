import { test, expect } from '@playwright/test';

// ================================================
// 2. Navigation Tests
// ================================================
test.describe('Navigation Tests', () => {
    test('Navigation links route correctly', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Test "About Us" link
      await page.click('text=About Us');
      await expect(page).toHaveURL(/about/);
      
      // Test "Home" link
      await page.goto('http://localhost:3000');
      
      // Test "Support" link
      await page.click('text=Support');
      await expect(page).toHaveURL(/support/);
      
      
    });
  });
  