import { test, expect } from "@playwright/test";
import { waitForRateLimitBudget } from "./helpers/rate-limit-aware";

test.describe("Onboarding - 3 taches en 5 min", () => {
  test.beforeEach(async ({ page }) => {
    await waitForRateLimitBudget(page);
  });

  test("affiche l'empty state au premier lancement", async ({ page }) => {
    test.setTimeout(120000);
    // Naviguer et nettoyer IndexedDB
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");
    await page.evaluate(async () => {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) indexedDB.deleteDatabase(db.name);
      }
    });
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1000);

    await expect(page.getByText("Prêt à conquérir votre journée")).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByText("Ajoutez vos premières tâches")
    ).toBeVisible();
  });

  test("creer une tache et verifier la persistance", async ({ page }) => {
    test.setTimeout(120000);

    // Naviguer et nettoyer IndexedDB
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");
    await page.evaluate(async () => {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) indexedDB.deleteDatabase(db.name);
      }
    });
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);

    // Cliquer sur le bouton de l'empty state
    const addButton = page.getByRole("button", { name: "Ajouter ma première tâche" });
    await expect(addButton).toBeVisible({ timeout: 15000 });

    // Ouvrir le formulaire
    await addButton.click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Remplir le titre
    await page.getByLabel("Titre").fill("Ma premiere tache E2E");

    // Selectionner un domaine si necessaire
    const domainPlaceholder = dialog.getByText("Choisir un domaine");
    if (await domainPlaceholder.isVisible({ timeout: 1000 }).catch(() => false)) {
      await domainPlaceholder.click();
      await page.waitForTimeout(500);
      const firstOption = page.getByRole("option").first();
      if (await firstOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await firstOption.click();
        await page.waitForTimeout(300);
      }
    }

    // Soumettre
    await dialog.getByRole("button", { name: "Ajouter" }).click();
    await expect(dialog).not.toBeVisible({ timeout: 15000 });

    // La tache doit apparaitre
    await expect(page.getByText("Ma premiere tache E2E")).toBeVisible({ timeout: 10000 });

    // Attendre avant le reload pour ne pas depasser le rate limit
    await page.waitForTimeout(3000);

    // Recharger et verifier la persistance (IndexedDB)
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
    await expect(page.getByText("Ma premiere tache E2E")).toBeVisible({ timeout: 15000 });
  });
});
