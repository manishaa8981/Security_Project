// tests/homePage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('HeroCarousel component', () => {

  test.beforeEach(async ({ page }) => {
    // Ensure mocked movies data is loaded
    await page.goto('/');
  });

  test('should render navigation controls and multiple slides', async ({ page }) => {
    // Check navigation buttons visibility
    const prevButton = page.locator('button[aria-label="Previous slide"]');
    const nextButton = page.locator('button[aria-label="Next slide"]');
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Check multiple slides are rendered
    const slides = page.locator('[data-testid="hero-carousel"] div.absolute');
    await expect(slides).toHaveCount(9);
  });

  test("should display movies and navigation controls", async ({ page }) => {
    await page.goto("/");

    // Check if carousel slides are loaded
    await expect(
      page.locator('[data-testid="hero-carousel"] img').first()
    ).toBeVisible();

    // Check if navigation buttons are present
    await expect(
      page.locator(
        '[data-testid="hero-carousel"] [aria-label="Previous slide"]'
      )
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="hero-carousel"] [aria-label="Next slide"]')
    ).toBeVisible();
  });
});