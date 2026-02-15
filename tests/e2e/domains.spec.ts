import { test, expect } from "@playwright/test";
import { waitForRateLimitBudget } from "./helpers/rate-limit-aware";

test.describe("Gestion des domaines", () => {
  test.beforeEach(async ({ page }) => {
    await waitForRateLimitBudget(page);
  });

  test("page domaines charge avec contenu", async ({ page }) => {
    // Naviguer et nettoyer IndexedDB
    await page.goto("/dashboard");
    await page.waitForLoadState("load");
    await page.evaluate(async () => {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) indexedDB.deleteDatabase(db.name);
      }
    });
    await page.waitForTimeout(1000);

    // Naviguer directement vers domaines (evite le sidebar pour economiser des requetes)
    await page.goto("/dashboard/domains");
    await page.waitForLoadState("load");

    // Attendre que les domaines se chargent
    await expect(page.getByText("Mes domaines")).toBeVisible({ timeout: 15000 });

    // Au moins les domaines par defaut sont visibles
    await expect(page.getByText("Personnel").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Professionnel").first()).toBeVisible();
    await expect(page.getByText(/études/i).first()).toBeVisible();

    // Le compteur de domaines est visible
    await expect(page.getByText(/domaines \(gratuit\)/)).toBeVisible({ timeout: 10000 });
  });

  test("le bouton ajouter est desactive quand la limite est atteinte", async ({
    page,
  }) => {
    // Naviguer et nettoyer IndexedDB
    await page.goto("/dashboard");
    await page.waitForLoadState("load");
    await page.evaluate(async () => {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) indexedDB.deleteDatabase(db.name);
      }
    });
    await page.waitForTimeout(1000);

    // Naviguer directement vers domaines
    await page.goto("/dashboard/domains");
    await page.waitForLoadState("load");

    // Attendre le chargement
    await expect(page.getByText("Personnel").first()).toBeVisible({ timeout: 15000 });

    // Le bouton "Ajouter un domaine" doit etre desactive (3/3 = limite atteinte)
    const addButton = page.getByRole("button", {
      name: /ajouter un domaine/i,
    });
    await expect(addButton).toBeDisabled();
  });
});
