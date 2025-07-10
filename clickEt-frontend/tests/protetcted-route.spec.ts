import { test, expect } from '@playwright/test';

// ================================================
// 5. Protected Route Tests
// ================================================
test.describe('Protected Routes', () => {
    test('Unauthenticated users are redirected', async ({ page }) => {
      await page.goto('http://localhost:3000/admin/halls');// must logout once before running because of cookies
      await expect(page).toHaveURL(/login/);
    });
  });