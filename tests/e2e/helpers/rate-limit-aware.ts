import { Page } from "@playwright/test";

/**
 * Verifie le budget rate limit et attend si necessaire.
 * Fait UNE seule requete de verification, puis attend si le budget est bas.
 * Ne boucle pas pour eviter de consommer plus de budget.
 */
export async function waitForRateLimitBudget(page: Page, minRemaining = 40): Promise<void> {
  let response;
  try {
    response = await page.request.get("/dashboard");
  } catch {
    // Network error (ECONNRESET, etc.) — skip rate-limit check silently
    return;
  }

  // Si 429, attendre le Retry-After
  if (response.status() === 429) {
    const retryAfter = parseInt(response.headers()["retry-after"] || "60", 10);
    await page.waitForTimeout((retryAfter + 3) * 1000);
    return;
  }

  // Verifier le budget restant
  const remaining = parseInt(response.headers()["x-ratelimit-remaining"] || "100", 10);
  if (remaining < minRemaining) {
    const resetAt = parseInt(response.headers()["x-ratelimit-reset"] || "0", 10);
    const now = Math.ceil(Date.now() / 1000);
    const waitSeconds = Math.max(5, Math.min(65, resetAt - now + 3));
    await page.waitForTimeout(waitSeconds * 1000);
  }
}
