import { test, expect } from "@playwright/test";

test.describe("Hero h1 overflow on iPhone", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hero title is fully visible without clipping", async ({ page }) => {
    await page.goto("/");

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 10000 });

    // Verify the full text is present
    await expect(h1).toContainText("Priorités nulle part.");

    // Check that the h1 is not clipped: scrollWidth should equal clientWidth
    const isClipped = await h1.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(isClipped).toBe(false);

    // Screenshot for visual verification
    await h1.screenshot({ path: "test-results/hero-h1-375px.png" });
  });
});
