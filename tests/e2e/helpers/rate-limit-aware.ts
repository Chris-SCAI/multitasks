import { Page } from "@playwright/test";

/**
 * Compteur global de navigations depuis la derniere pause.
 * Persiste entre fichiers de test avec workers: 1.
 * Chaque page.goto/reload consomme ~12-15 requetes HTTP.
 * Rate limit : 100 req/min (fenetre glissante 60s).
 * Seuil : apres 5 navigations (~75 req), on attend 65s pour reinitialiser.
 */
let navigationCount = 0;
let lastPauseTime = Date.now();

export async function waitForRateLimitBudget(page: Page): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastPauseTime;

  // Si 65+ secondes se sont ecoulees depuis la derniere pause,
  // le budget s'est reinitialise naturellement
  if (elapsed >= 65000) {
    navigationCount = 0;
    lastPauseTime = now;
    return;
  }

  // Si on a fait assez de navigations pour epuiser le budget
  if (navigationCount >= 5) {
    const waitMs = Math.max(0, 65000 - elapsed);
    if (waitMs > 0) {
      await page.waitForTimeout(waitMs);
    }
    navigationCount = 0;
    lastPauseTime = Date.now();
  }

  // Compter les navigations que ce test va faire (~2 en moyenne)
  navigationCount += 2;
}
