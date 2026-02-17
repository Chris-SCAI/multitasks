import { test, expect } from "@playwright/test";

test.describe("Admin VIP", () => {
  test("ajouter un email VIP et vérifier la persistance localStorage", async ({
    page,
  }) => {
    await page.goto("/dashboard/admin");

    // Attendre que les onglets soient chargés (le texte "VIP" est masqué sur mobile, cibler le 3e onglet)
    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toBeVisible({ timeout: 15000 });
    await tabs.nth(2).click();

    // Remplir le formulaire
    await page.getByPlaceholder("vip@example.com").fill("test@multitasks.fr");
    await page.getByPlaceholder("Raison du VIP...").fill("Test E2E");

    // Cliquer sur Ajouter
    await page.getByRole("button", { name: /Ajouter/i }).click();

    // Vérifier que l'email apparaît dans le tableau
    await expect(page.getByText("test@multitasks.fr")).toBeVisible();

    // Vérifier le badge compteur
    await expect(page.getByText(/1 actif/)).toBeVisible();

    // Vérifier la persistance dans localStorage
    const stored = await page.evaluate(() =>
      localStorage.getItem("multitasks-admin-vip")
    );
    const parsed = JSON.parse(stored!);
    expect(parsed.state.vipEmails).toHaveLength(1);
    expect(parsed.state.vipEmails[0].email).toBe("test@multitasks.fr");
    expect(parsed.state.vipEmails[0].note).toBe("Test E2E");

    // Recharger la page et vérifier la persistance
    await page.reload();
    const tabsAfterReload = page.getByRole("tab");
    await expect(tabsAfterReload.first()).toBeVisible({ timeout: 15000 });
    await tabsAfterReload.nth(2).click();
    await expect(page.getByText("test@multitasks.fr")).toBeVisible();

    // Supprimer l'email VIP
    await page
      .getByRole("row", { name: /test@multitasks.fr/ })
      .getByRole("button")
      .click();

    // Vérifier la suppression
    await expect(page.getByText("Aucun compte VIP")).toBeVisible();
  });
});
