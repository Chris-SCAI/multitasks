import { test, expect } from "@playwright/test";
import { waitForRateLimitBudget } from "./helpers/rate-limit-aware";

test.describe("Analyse IA flow", () => {
  test.beforeEach(async ({ page }) => {
    await waitForRateLimitBudget(page);
  });

  test("page analyse IA affiche le launcher avec quota", async ({ page }) => {
    await page.goto("/dashboard/analysis");
    await page.waitForLoadState("networkidle");

    // Le heading Analyse IA est visible
    await expect(
      page.getByRole("heading", { name: /analyse ia/i })
    ).toBeVisible({ timeout: 15000 });

    // Le quota indicator doit etre visible
    await expect(page.getByText(/analyses? restantes?/i)).toBeVisible();

    // Le bouton analyser doit etre desactive sans selection
    const analyzeButton = page.getByRole("button", {
      name: /analyser avec l'ia/i,
    });
    await expect(analyzeButton).toBeDisabled();
  });

  test("creation de tache puis selection dans analyse IA", async ({ page }) => {
    // Naviguer vers l'app et nettoyer IndexedDB
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) indexedDB.deleteDatabase(db.name);
      }
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    // Creer une tache
    const fab = page.locator('button[aria-label="Ajouter une tâche"]');
    await expect(fab).toBeVisible({ timeout: 15000 });
    await fab.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await page.getByLabel("Titre").fill("Tache pour analyse");

    // Selectionner un domaine
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

    await dialog.getByRole("button", { name: "Ajouter" }).click();
    await expect(dialog).not.toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Tache pour analyse")).toBeVisible({ timeout: 10000 });

    // Naviguer vers la page analyse
    await page.goto("/dashboard/analysis");
    await page.waitForLoadState("networkidle");

    // La tache doit etre listee
    await expect(page.getByText("Tache pour analyse")).toBeVisible({ timeout: 15000 });

    // Selectionner la tache
    await page
      .locator("label", { hasText: "Tache pour analyse" })
      .locator("input[type='checkbox']")
      .click();

    // Le bouton analyser doit etre active
    const analyzeButton = page.getByRole("button", {
      name: /analyser avec l'ia/i,
    });
    await expect(analyzeButton).toBeEnabled();
  });

  test("tout selectionner / tout deselectionner", async ({ page }) => {
    await page.goto("/dashboard/analysis");
    await page.waitForLoadState("networkidle");

    // Attendre que les taches se chargent
    const taskList = page.locator("label input[type='checkbox']");
    const hasCheckboxes = await taskList.first().isVisible({ timeout: 5000 }).catch(() => false);

    if (hasCheckboxes) {
      // Tout selectionner
      await page.getByRole("button", { name: /tout sélectionner/i }).click();
      await expect(page.getByText(/tâches? sélectionnées?/i)).toBeVisible();

      // Tout deselectionner
      await page.getByRole("button", { name: /tout désélectionner/i }).click();
      await expect(page.getByText(/0\/20 tâches sélectionnées/)).toBeVisible();
    } else {
      // Pas de taches - verifier l'empty state
      await expect(page.getByText(/aucune tâche à analyser/i)).toBeVisible();
    }
  });
});
