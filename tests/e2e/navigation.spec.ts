import { test, expect } from "@playwright/test";
import { waitForRateLimitBudget } from "./helpers/rate-limit-aware";

test.describe("Navigation entre les routes", () => {
  test.beforeEach(async ({ page }) => {
    await waitForRateLimitBudget(page);
  });

  test("naviguer entre les routes principales", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("load");

    // Page taches (dashboard)
    await expect(page).toHaveURL("/dashboard");

    // Le sidebar est visible
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // Naviguer vers Calendrier
    await sidebar.getByText("Calendrier").click();
    await expect(page).toHaveURL("/dashboard/calendar", { timeout: 10000 });
    await page.waitForLoadState("load");

    // Naviguer vers Domaines
    await sidebar.getByText("Domaines").click();
    await expect(page).toHaveURL("/dashboard/domains", { timeout: 10000 });
    await page.waitForLoadState("load");

    // Naviguer vers Parametres
    await sidebar.getByText("Paramètres").click();
    await expect(page).toHaveURL("/dashboard/settings", { timeout: 10000 });
    await page.waitForLoadState("load");

    // Retour aux taches
    await sidebar.getByText("Tâches").click();
    await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
  });

  test("la page analyse IA est accessible", async ({ page }) => {
    await page.goto("/dashboard/analysis");
    await page.waitForLoadState("load");
    await expect(
      page.getByRole("heading", { name: /analyse ia/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("les pages auth sont accessibles", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("load");
    await expect(page.getByText(/connectez-vous/i)).toBeVisible({ timeout: 10000 });

    await page.goto("/register");
    await page.waitForLoadState("load");
    await expect(page.getByText(/créez votre compte/i)).toBeVisible({ timeout: 10000 });
  });
});
