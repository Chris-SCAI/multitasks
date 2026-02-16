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

    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;

    if (isMobile) {
      // Mobile : utiliser la bottom nav
      // Note : force: true nécessaire car le nextjs-portal (dev overlay) intercepte les clics
      const bottomNav = page.locator("nav.fixed.inset-x-0.bottom-0");
      await expect(bottomNav).toBeVisible({ timeout: 10000 });

      // Naviguer via les liens de la bottom nav
      // JS click contourne le nextjs dev overlay qui intercepte les clics sur WebKit mobile
      async function clickNavLink(href: string) {
        // Attendre que le lien soit dans le DOM et la page hydratée
        await page.waitForSelector(`nav.fixed a[href="${href}"]`, { timeout: 10000 });
        await page.evaluate(
          (h) => document.querySelector<HTMLAnchorElement>(`nav.fixed a[href="${h}"]`)?.click(),
          href
        );
        await page.waitForURL(`**${href}`, { timeout: 10000 });
        await page.waitForLoadState("load");
      }

      // Naviguer vers Calendrier
      await clickNavLink("/dashboard/calendar");

      // Naviguer vers Domaines
      await clickNavLink("/dashboard/domains");

      // Naviguer vers Paramètres
      await clickNavLink("/dashboard/settings");

      // Retour aux tâches
      await clickNavLink("/dashboard");
    } else {
      // Desktop : utiliser la sidebar
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

      // Naviguer vers Paramètres
      await sidebar.getByText("Paramètres").click();
      await expect(page).toHaveURL("/dashboard/settings", { timeout: 10000 });
      await page.waitForLoadState("load");

      // Retour aux tâches
      await sidebar.getByText("Tâches").click();
      await expect(page).toHaveURL("/dashboard", { timeout: 10000 });
    }
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
