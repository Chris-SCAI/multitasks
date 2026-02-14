import { test, expect } from "@playwright/test";

test("create a task via FAB button", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");

  // Vérifier l'empty state
  await expect(page.getByText("Aucune tâche")).toBeVisible();

  // Cliquer sur le FAB
  await page.getByLabel("Ajouter une tâche").click();

  // Vérifier que le dialog s'ouvre
  await expect(page.getByText("Nouvelle tâche")).toBeVisible();

  // Remplir le titre et la description
  await page.getByLabel("Titre").fill("Ma première tâche de test");
  await page.getByLabel("Description").fill("Créée via Playwright");

  // Sélectionner un domaine via le select "Choisir un domaine"
  await page.getByRole("combobox").filter({ hasText: "Choisir un domaine" }).click();
  await page.getByRole("option").first().click();

  // Soumettre
  await page.getByRole("button", { name: "Ajouter" }).click();

  // Attendre que le dialog se ferme
  await expect(page.getByText("Nouvelle tâche")).not.toBeVisible({ timeout: 10000 });

  // Vérifier que la tâche apparaît dans la liste
  await expect(page.getByText("Ma première tâche de test")).toBeVisible({ timeout: 10000 });

  // Vérifier que l'empty state a disparu
  await expect(page.getByText("Aucune tâche")).not.toBeVisible();
});
