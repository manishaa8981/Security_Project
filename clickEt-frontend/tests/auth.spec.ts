import { test, expect } from "@playwright/test";

test.describe("Authentication Tests", () => {
  test("Invalid credentials show error message", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    // Use the correct input name for the username/email field
    await page.fill('input[name="user_name"]', "wrong@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for the toast error message containing "invalid credentials" to appear
    const toastMessage = page.locator('text="Invalid Account credentials"'); // Check actual message in code
    await toastMessage.waitFor(); // Wait for message to appear
    await expect(toastMessage).toBeVisible();
  });

  test("Valid credentials redirect to home", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('input[name="user_name"]', "0to1e");
    await page.fill('input[name="password"]', "Rohan123@");
    await page.click('button[type="submit"]');

    // Wait for navigation after a successful login
    await page.waitForNavigation({ timeout: 5000 });
    await expect(page).toHaveURL("http://localhost:3000/");
  });
});
