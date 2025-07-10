import { test, expect } from '@playwright/test';

test.describe('User Profile Display', () => {
  test('Profile avatar is visible after login', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="user_name"]', '0to1e');
    await page.fill('input[name="password"]', 'Rohan123@');
    await page.click('button[type="submit"]');

    // Locate the avatar image within the profile link
    await expect(page.locator('a[href="/uprofile"] img')).toBeVisible();
  });
});
