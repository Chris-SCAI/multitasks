import { test, expect } from "@playwright/test";
import { waitForRateLimitBudget } from "./helpers/rate-limit-aware";

test("create a task via FAB button", async ({ page }) => {
  test.setTimeout(90000);
  await waitForRateLimitBudget(page);

  // Naviguer et nettoyer IndexedDB
  await page.goto("/dashboard");
  await page.waitForLoadState("load");
  await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
      if (db.name) indexedDB.deleteDatabase(db.name);
    }
  });
  await page.waitForTimeout(2000);
  await page.reload();
  await page.waitForLoadState("load");
  await page.waitForTimeout(1000);

  // Vérifier l'empty state
  await expect(page.getByText("Prêt à conquérir votre journée")).toBeVisible({ timeout: 15000 });

  // Cliquer sur le bouton de l'empty state
  await page.getByRole("button", { name: "Ajouter ma première tâche" }).click();

  // Vérifier que le dialog s'ouvre
  await expect(page.getByText("Nouvelle tâche")).toBeVisible({ timeout: 5000 });

  // Remplir le titre et la description
  await page.getByLabel("Titre").fill("Ma première tâche de test");
  await page.getByLabel("Description").fill("Créée via Playwright");

  // Sélectionner un domaine
  const domainPlaceholder = page.locator('[role="dialog"]').getByText("Choisir un domaine");
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
  await page.getByRole("button", { name: "Ajouter" }).click();

  // Attendre que le dialog se ferme
  await expect(page.getByText("Nouvelle tâche")).not.toBeVisible({ timeout: 15000 });

  // Vérifier que la tâche apparaît dans la liste
  await expect(page.getByText("Ma première tâche de test")).toBeVisible({ timeout: 10000 });

  // Vérifier que l'empty state a disparu
  await expect(page.getByText("Prêt à conquérir votre journée")).not.toBeVisible();
});
