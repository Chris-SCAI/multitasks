import { test, expect } from "@playwright/test";

test.describe("Landing page — funnel complet", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("toutes les sections sont rendues", async ({ page }) => {
    // Hero — h1 visible
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 15000 });
    await expect(h1).toContainText("Priorités nulle part.");

    // TaskDemoSection, AvantApresSection, Features (#features)
    await expect(page.locator("#features")).toBeAttached();

    // HowItWorks (#how-it-works)
    await expect(page.locator("#how-it-works")).toBeAttached();

    // Pricing (#pricing)
    await expect(page.locator("#pricing")).toBeAttached();

    // FAQ (#faq)
    await expect(page.locator("#faq")).toBeAttached();

    // Footer
    await expect(page.locator("footer")).toBeAttached();
  });

  test("CTA Hero pointe vers /register", async ({ page }) => {
    const heroCTA = page.locator("a", { hasText: "Commencer gratuitement" }).first();
    await expect(heroCTA).toBeVisible({ timeout: 15000 });
    await expect(heroCTA).toHaveAttribute("href", "/register");
  });

  test("CTA Final pointe vers /register", async ({ page }) => {
    const finalCTA = page.locator("a", { hasText: "Commencer gratuitement" }).last();
    await expect(finalCTA).toHaveAttribute("href", "/register");
  });

  test("navigation desktop — liens visibles", async ({ page }) => {
    // Skip on mobile viewports
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
    }

    await expect(page.locator("button", { hasText: "Fonctionnalités" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("button", { hasText: "Tarifs" })).toBeVisible();
    await expect(page.locator("button", { hasText: "FAQ" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Connexion" }).first()).toBeVisible();
  });

  test("pricing — 3 plans visibles avec badge Meilleur choix", async ({ page }) => {
    const pricingSection = page.locator("#pricing");
    await pricingSection.scrollIntoViewIfNeeded();

    // 3 plan names (use heading role to avoid matching badge/description text)
    await expect(pricingSection.getByRole("heading", { name: "Gratuit" })).toBeVisible({ timeout: 10000 });
    await expect(pricingSection.getByRole("heading", { name: "IA Quotidienne" })).toBeVisible();
    await expect(pricingSection.getByRole("heading", { name: "Pro Sync" })).toBeVisible();

    // Badge "Meilleur choix"
    await expect(pricingSection.getByText("Meilleur choix")).toBeVisible();
  });

  test("pricing — toggle mensuel/annuel fonctionne", async ({ page }) => {
    const pricingSection = page.locator("#pricing");
    await pricingSection.scrollIntoViewIfNeeded();

    // Toggle switch to annual
    const toggle = pricingSection.locator("#billing-toggle");
    await toggle.click();

    // "~2 mois offerts" badge should appear
    await expect(pricingSection.getByText("~2 mois offerts")).toBeVisible({ timeout: 5000 });
  });

  test("FAQ — accordéon ouvrable", async ({ page }) => {
    const faqSection = page.locator("#faq");
    await faqSection.scrollIntoViewIfNeeded();

    // Click first question
    const firstTrigger = faqSection.locator("[data-state]").first();
    await firstTrigger.click();

    // Answer text should be visible
    await expect(faqSection.getByText("matrice d'Eisenhower")).toBeVisible({ timeout: 5000 });
  });

  test("OG metadata présente", async ({ page }) => {
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toBeAttached();
    const content = await ogImage.getAttribute("content");
    expect(content).toBeTruthy();
  });

  test("JSON-LD SoftwareApplication présent", async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
    const text = await jsonLd.textContent();
    expect(text).toContain("SoftwareApplication");
    expect(text).toContain("Multitasks");
  });
});

test.describe("Landing page — responsive 375px", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hero h1 visible sur mobile", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 15000 });
  });

  test("hamburger menu fonctionne", async ({ page }) => {
    await page.goto("/");

    // Hamburger button visible
    const hamburger = page.locator('button[aria-label="Menu"]');
    await expect(hamburger).toBeVisible({ timeout: 10000 });

    // Click to open
    await hamburger.click();

    // Mobile menu links visible
    await expect(page.locator("text=Fonctionnalités").last()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Tarifs").last()).toBeVisible();
    await expect(page.locator("text=Connexion").last()).toBeVisible();
  });

  test("pas de débordement horizontal", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Attendre que le contenu soit rendu
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });

    const overflowDelta = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    // Allow up to 8px tolerance for scrollbar width and sub-pixel rounding
    expect(overflowDelta).toBeLessThanOrEqual(8);
  });
});
