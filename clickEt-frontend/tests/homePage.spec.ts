import { test, expect } from "@playwright/test";

// ================================================
// 1. Homepage Tests
// ================================================
test.describe("Homepage Tests", () => {
  test("Loads with header, footer, and logo", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Verify header and footer visibility
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Check logo image (alt text: "ClickEt")
    await expect(page.locator('img[alt="ClickEt"]')).toBeVisible();
  });

  test("should render all main components", async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");

    // Check if HeroCarousel exists
    await expect(page.locator('[data-testid="hero-carousel"]')).toBeVisible();

    // Check if both NowShowingSection components exist
    await expect(
      page.locator('[data-testid="now-showing-section"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="upcoming-movies-section"]')
    ).toBeVisible();
  });

});

// NowShowingSection tests - "showing" variant
test.describe("NowShowingSection - Now Showing variant", () => {
  test("should display correct title and movie grid", async ({ page }) => {
    await page.goto("/");

    // Check if the section title is correct
    await expect(
      page.locator('[data-testid="now-showing-section"] >> text="Now Showing"')
    ).toBeVisible();

    // Movie cards count
    await expect(
      page.locator(
        '[data-testid="now-showing-section"] [data-testid="movie-card"]'
      )
    ).toHaveCount(4);
  });

  test("should display movie cards with images", async ({ page }) => {
    await page.goto("/");

    // Check if there are movie cards in the "now showing" section
    await expect(
      page.locator(
        '[data-testid="now-showing-section"] [data-testid="movie-card"]'
      )
    ).toHaveCount(4);
  });
});

// NowShowingSection tests - "upcoming" variant
test.describe("NowShowingSection - Upcoming variant", () => {
  test("should display correct title and movie grid", async ({ page }) => {
    await page.goto("/");

    // Check if the section title is correct
    await expect(
      page.locator(
        '[data-testid="upcoming-movies-section"] >> text="Upcoming Movies"'
      )
    ).toBeVisible();

    // Check if the movie grid is present
    await expect(
      page.locator(
        '[data-testid="upcoming-movies-section"] [data-testid="movies-grid"]'
      )
    ).toBeVisible();
  });

  test("should display movie cards with images", async ({ page }) => {
    await page.goto("/");

    // Check if there are movie cards in the "upcoming" section
    await expect(
      page.locator(
        '[data-testid="upcoming-movies-section"] [data-testid="movie-card"]'
      )
    ).toHaveCount(5);
  });
});

// ExpandingMovieCard tests
test.describe("ExpandingMovieCard component", () => {
  test("should display basic movie information when not hovered", async ({
    page,
  }) => {
    await page.goto("/");

    // Check if the movie card is visible
    await expect(
      page.locator('[data-testid="movie-card"]').first()
    ).toBeVisible();
  });

  test("should expand and show additional details on hover", async ({
    page,
  }) => {
    await page.goto("/");

    // Hover over the first movie card
    await page.locator('[data-testid="movie-card"]').first().hover();

    // Wait for the expansion animation to complete
    await page.waitForTimeout(300); // Animation takes 250ms

    // Check if the expanded content is visible
    await expect(
      page.locator('[data-testid="movie-card-expanded-content"]').first()
    ).toBeVisible();

    // Check if the movie details are visible in the expanded content
    await expect(
      page
        .locator(
          '[data-testid="movie-card-expanded-content"] .text-secondary-foreground'
        )
        .first()
    ).toBeVisible();

    // Check if the "Get Your ticket" button is visible in the expanded content
    await expect(
      page
        .locator(
          '[data-testid="movie-card-expanded-content"] button:has-text("Get Your ticket")'
        )
        .first()
    ).toBeVisible();
  });
});
