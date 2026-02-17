import { test, expect } from "@playwright/test";

test("notification panel shows reminder for task with deadline", async ({ page }) => {
  test.setTimeout(90000);

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

  // Créer une tâche avec deadline demain
  await page.getByRole("button", { name: "Ajouter ma première tâche" }).click();
  await expect(page.getByText("Nouvelle tâche")).toBeVisible({ timeout: 5000 });

  await page.getByLabel("Titre").fill("Tâche test notifications");

  // Remplir la date d'échéance = demain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD
  await page.getByLabel("Échéance").fill(dateStr);

  // Sélectionner un domaine si disponible
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
  await expect(page.getByText("Nouvelle tâche")).not.toBeVisible({ timeout: 15000 });

  // Vérifier que la tâche est créée
  await expect(page.getByText("Tâche test notifications")).toBeVisible({ timeout: 10000 });

  // Attendre la synchronisation des rappels (useReminders sync)
  await page.waitForTimeout(2000);

  // Cliquer sur la cloche pour ouvrir le panneau
  await page.getByRole("button", { name: /rappel/i }).click();

  // Le panneau doit s'ouvrir avec le titre "Notifications"
  await expect(page.getByRole("heading", { name: "Notifications" })).toBeVisible({ timeout: 5000 });

  // Le rappel pour la tâche doit être visible
  await expect(page.getByText("Tâche test notifications").last()).toBeVisible({ timeout: 5000 });

  // Le compteur "en attente" doit être visible
  await expect(page.getByText(/en attente/i)).toBeVisible();

  // Cliquer en dehors pour fermer le panneau
  await page.click("body", { position: { x: 10, y: 10 } });
  await expect(page.getByRole("heading", { name: "Notifications" })).not.toBeVisible({ timeout: 3000 });
});
