import { test, expect } from "@playwright/test";
import { waitForRateLimitBudget } from "./helpers/rate-limit-aware";

test.describe("Payment flow", () => {
  test.beforeEach(async ({ page }) => {
    await waitForRateLimitBudget(page);
  });

  test("la page pricing est accessible", async ({ page }) => {
    await page.goto("/dashboard/pricing");
    await page.waitForLoadState("networkidle");

    // Les 3 plans doivent etre visibles par leur nom
    await expect(page.getByText("Gratuit").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("IA Quotidienne").first()).toBeVisible();
    await expect(page.getByText("Pro Sync").first()).toBeVisible();
  });

  test("le toggle mensuel/annuel est present", async ({ page }) => {
    await page.goto("/dashboard/pricing");
    await page.waitForLoadState("networkidle");

    // Toggle mensuel/annuel (Label elements, not tabs)
    await expect(page.getByText("Mensuel").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Annuel").first()).toBeVisible();
  });

  test("le plan Pro est visuellement dominant", async ({ page }) => {
    await page.goto("/dashboard/pricing");
    await page.waitForLoadState("networkidle");

    // Le plan Pro doit avoir un badge "Meilleur choix"
    await expect(
      page.getByText("Meilleur choix").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("cliquer sur un plan affiche un CTA de checkout", async ({ page }) => {
    await page.goto("/dashboard/pricing");
    await page.waitForLoadState("networkidle");

    // Les boutons CTA sont "Choisir"
    const ctaButtons = page.getByRole("button", {
      name: /choisir/i,
    });
    await expect(ctaButtons.first()).toBeVisible({ timeout: 10000 });
  });
});
