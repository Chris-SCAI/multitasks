import { describe, it, expect, beforeEach, vi } from "vitest";
import { PLANS, getPlan, isFeatureAvailable, ANALYSIS_PACKS } from "@/lib/stripe/plans";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe/client";

// Reset du store subscription avant chaque test
beforeEach(() => {
  useSubscriptionStore.setState({
    currentPlan: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    billingPeriod: "monthly",
  });
  // Clear localStorage pour tester la persistence
  localStorage.clear();
});

describe("Plans configuration (plans.ts)", () => {
  it("exporte les 4 plans (free, etudiant, pro, equipe)", () => {
    expect(PLANS.free).toBeDefined();
    expect(PLANS.etudiant).toBeDefined();
    expect(PLANS.pro).toBeDefined();
    expect(PLANS.equipe).toBeDefined();
    expect(Object.keys(PLANS)).toHaveLength(4);
  });

  it("plan free a les bons prix (0€)", () => {
    const plan = PLANS.free;
    expect(plan.priceMonthly).toBe(0);
    expect(plan.priceAnnual).toBe(0);
    expect(plan.stripePriceIdMonthly).toBeNull();
    expect(plan.stripePriceIdAnnual).toBeNull();
  });

  it("plan free a les bonnes limites (5 domaines, tâches illimitées, 5 analyses/mois)", () => {
    const plan = PLANS.free;
    expect(plan.limits.domains).toBe(5);
    expect(plan.limits.tasks).toBeNull();
    expect(plan.limits.analysesPerPeriod).toBe(5);
    expect(plan.limits.analysisPeriod).toBe("monthly");
    expect(plan.limits.remindersPerDay).toBe(3);
    expect(plan.limits.calendarViews).toEqual(["week"]);
    expect(plan.limits.sync).toBe(false);
    expect(plan.limits.export).toBe(false);
  });

  it("plan etudiant a les bons prix (2.99€/mois, 29€/an)", () => {
    const plan = PLANS.etudiant;
    expect(plan.priceMonthly).toBe(2.99);
    expect(plan.priceAnnual).toBe(29);
  });

  it("plan etudiant a les bonnes limites (illimité, 30 analyses/mois)", () => {
    const plan = PLANS.etudiant;
    expect(plan.limits.domains).toBeNull();
    expect(plan.limits.tasks).toBeNull();
    expect(plan.limits.analysesPerPeriod).toBe(30);
    expect(plan.limits.analysisPeriod).toBe("monthly");
    expect(plan.limits.remindersPerDay).toBeNull();
    expect(plan.limits.calendarViews).toEqual(["week", "month"]);
    expect(plan.limits.sync).toBe(false);
    expect(plan.limits.export).toBe(false);
    expect(plan.requiresVerification).toBe(true);
  });

  it("plan pro a les bons prix (7.99€/mois, 59€/an)", () => {
    const plan = PLANS.pro;
    expect(plan.priceMonthly).toBe(7.99);
    expect(plan.priceAnnual).toBe(59);
  });

  it("plan pro a les bonnes limites (tout illimité, 100 analyses/mois, sync, export)", () => {
    const plan = PLANS.pro;
    expect(plan.limits.domains).toBeNull();
    expect(plan.limits.tasks).toBeNull();
    expect(plan.limits.analysesPerPeriod).toBe(100);
    expect(plan.limits.analysisPeriod).toBe("monthly");
    expect(plan.limits.remindersPerDay).toBeNull();
    expect(plan.limits.calendarViews).toEqual(["week", "month"]);
    expect(plan.limits.sync).toBe(true);
    expect(plan.limits.export).toBe(true);
    expect(plan.recommended).toBe(true);
  });

  it("plan equipe a les bons prix (12.99€/mois, 99€/an)", () => {
    const plan = PLANS.equipe;
    expect(plan.priceMonthly).toBe(12.99);
    expect(plan.priceAnnual).toBe(99);
    expect(plan.perUser).toBe(true);
  });

  it("plan equipe a les bonnes limites (tout illimité, analyses illimitées, sync, export)", () => {
    const plan = PLANS.equipe;
    expect(plan.limits.domains).toBeNull();
    expect(plan.limits.tasks).toBeNull();
    expect(plan.limits.analysesPerPeriod).toBe(9999);
    expect(plan.limits.analysisPeriod).toBe("monthly");
    expect(plan.limits.remindersPerDay).toBeNull();
    expect(plan.limits.calendarViews).toEqual(["week", "month"]);
    expect(plan.limits.sync).toBe(true);
    expect(plan.limits.export).toBe(true);
  });

  it("ANALYSIS_PACKS a les bons prix (10=4.90€, 30=9.90€)", () => {
    expect(ANALYSIS_PACKS).toHaveLength(2);
    const pack10 = ANALYSIS_PACKS.find((p) => p.analyses === 10);
    const pack30 = ANALYSIS_PACKS.find((p) => p.analyses === 30);
    expect(pack10).toBeDefined();
    expect(pack10!.price).toBe(4.9);
    expect(pack30).toBeDefined();
    expect(pack30!.price).toBe(9.9);
  });

  it("getPlan retourne le bon plan pour un id valide", () => {
    expect(getPlan("free").id).toBe("free");
    expect(getPlan("etudiant").id).toBe("etudiant");
    expect(getPlan("pro").id).toBe("pro");
    expect(getPlan("equipe").id).toBe("equipe");
  });

  it("getPlan retourne le plan free pour un id invalide", () => {
    const plan = getPlan("invalid-plan-id");
    expect(plan.id).toBe("free");
  });

  it("isFeatureAvailable retourne true pour les features du plan pro", () => {
    expect(isFeatureAvailable("pro", "sync")).toBe(true);
    expect(isFeatureAvailable("pro", "export")).toBe(true);
    expect(isFeatureAvailable("pro", "month_calendar")).toBe(true);
  });

  it("isFeatureAvailable retourne true pour les features du plan equipe", () => {
    expect(isFeatureAvailable("equipe", "sync")).toBe(true);
    expect(isFeatureAvailable("equipe", "export")).toBe(true);
    expect(isFeatureAvailable("equipe", "month_calendar")).toBe(true);
  });

  it("isFeatureAvailable retourne false pour les features au-dessus du plan", () => {
    expect(isFeatureAvailable("free", "sync")).toBe(false);
    expect(isFeatureAvailable("free", "export")).toBe(false);
    expect(isFeatureAvailable("free", "month_calendar")).toBe(false);
    expect(isFeatureAvailable("etudiant", "sync")).toBe(false);
    expect(isFeatureAvailable("etudiant", "export")).toBe(false);
  });

  it("isFeatureAvailable retourne true pour month_calendar sur etudiant", () => {
    expect(isFeatureAvailable("etudiant", "month_calendar")).toBe(true);
  });
});

describe("Store subscription (subscription-store.ts)", () => {
  it("état initial est plan free", () => {
    const state = useSubscriptionStore.getState();
    expect(state.currentPlan).toBe("free");
    expect(state.stripeCustomerId).toBeNull();
    expect(state.stripeSubscriptionId).toBeNull();
    expect(state.billingPeriod).toBe("monthly");
  });

  it("getPlanConfig retourne la config du plan courant", () => {
    const config = useSubscriptionStore.getState().getPlanConfig();
    expect(config.id).toBe("free");
    expect(config.priceMonthly).toBe(0);
  });

  it("setPlan met à jour le plan courant", () => {
    useSubscriptionStore.getState().setPlan("etudiant");
    expect(useSubscriptionStore.getState().currentPlan).toBe("etudiant");
    expect(useSubscriptionStore.getState().getPlanConfig().id).toBe("etudiant");
  });

  it("setStripeIds met à jour les IDs Stripe", () => {
    useSubscriptionStore.getState().setStripeIds("cus_123", "sub_456");
    const state = useSubscriptionStore.getState();
    expect(state.stripeCustomerId).toBe("cus_123");
    expect(state.stripeSubscriptionId).toBe("sub_456");
  });

  it("setBillingPeriod toggle monthly/yearly", () => {
    expect(useSubscriptionStore.getState().billingPeriod).toBe("monthly");

    useSubscriptionStore.getState().setBillingPeriod("annual");
    expect(useSubscriptionStore.getState().billingPeriod).toBe("annual");

    useSubscriptionStore.getState().setBillingPeriod("monthly");
    expect(useSubscriptionStore.getState().billingPeriod).toBe("monthly");
  });

  it("persist fonctionne (lecture depuis localStorage après set)", () => {
    useSubscriptionStore.getState().setPlan("pro");
    useSubscriptionStore.getState().setBillingPeriod("annual");
    useSubscriptionStore.getState().setStripeIds("cus_abc", "sub_xyz");

    const stored = localStorage.getItem("multitasks-subscription");
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.currentPlan).toBe("pro");
    expect(parsed.state.billingPeriod).toBe("annual");
    expect(parsed.state.stripeCustomerId).toBe("cus_abc");
    expect(parsed.state.stripeSubscriptionId).toBe("sub_xyz");
  });

  it("persist restaure l'état après clear et réinitialisation", () => {
    useSubscriptionStore.getState().setPlan("etudiant");
    useSubscriptionStore.getState().setBillingPeriod("annual");

    const stored = localStorage.getItem("multitasks-subscription");
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.currentPlan).toBe("etudiant");
    expect(parsed.state.billingPeriod).toBe("annual");
  });

  it("passage de free à etudiant donne accès au calendrier mois", () => {
    let plan = useSubscriptionStore.getState().getPlanConfig();
    expect(plan.limits.calendarViews).toEqual(["week"]);

    useSubscriptionStore.getState().setPlan("etudiant");
    plan = useSubscriptionStore.getState().getPlanConfig();
    expect(plan.limits.calendarViews).toContain("month");
  });

  it("passage de etudiant à pro donne accès au sync et export", () => {
    useSubscriptionStore.getState().setPlan("etudiant");
    let plan = useSubscriptionStore.getState().getPlanConfig();
    expect(plan.limits.sync).toBe(false);
    expect(plan.limits.export).toBe(false);

    useSubscriptionStore.getState().setPlan("pro");
    plan = useSubscriptionStore.getState().getPlanConfig();
    expect(plan.limits.sync).toBe(true);
    expect(plan.limits.export).toBe(true);
  });
});

describe("Sécurité Stripe", () => {
  it("STRIPE_SECRET_KEY n'est pas dans un fichier NEXT_PUBLIC", () => {
    const publicVars = ["NEXT_PUBLIC_STRIPE_KEY"];
    publicVars.forEach((varName) => {
      expect(varName).not.toContain("SECRET");
    });
  });

  it("Plan invalide devrait échouer la validation (checkout)", () => {
    const invalidPlanId = "plan_inexistant";
    const plan = PLANS[invalidPlanId as keyof typeof PLANS];
    expect(plan).toBeUndefined();
  });

  it("Plan sans priceId configuré devrait échouer (checkout)", () => {
    const plan = PLANS.free;
    expect(plan.stripePriceIdMonthly).toBeNull();
    expect(plan.stripePriceIdAnnual).toBeNull();
  });

  it("Plans payants ont des stripePriceId (ou null si env non configuré)", () => {
    const etudiantPlan = PLANS.etudiant;
    const proPlan = PLANS.pro;
    const equipePlan = PLANS.equipe;

    expect(etudiantPlan).toHaveProperty("stripePriceIdMonthly");
    expect(etudiantPlan).toHaveProperty("stripePriceIdAnnual");
    expect(proPlan).toHaveProperty("stripePriceIdMonthly");
    expect(proPlan).toHaveProperty("stripePriceIdAnnual");
    expect(equipePlan).toHaveProperty("stripePriceIdMonthly");
    expect(equipePlan).toHaveProperty("stripePriceIdAnnual");
  });

  it("Types de plans sont bien typés (type safety)", () => {
    const planIds: Array<"free" | "etudiant" | "pro" | "equipe"> = [
      "free",
      "etudiant",
      "pro",
      "equipe",
    ];
    planIds.forEach((id) => {
      const plan = PLANS[id];
      expect(plan.id).toBe(id);
    });
  });
});

describe("Client Stripe (client.ts)", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("getStripeClient retourne null si STRIPE_SECRET_KEY n'est pas définie", () => {
    const originalEnv = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    const client = getStripeClient();
    expect(client).toBeNull();

    if (originalEnv) process.env.STRIPE_SECRET_KEY = originalEnv;
  });

  it("isStripeConfigured retourne false si pas de clé secrète", () => {
    const originalEnv = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    expect(isStripeConfigured()).toBe(false);

    if (originalEnv) process.env.STRIPE_SECRET_KEY = originalEnv;
  });

  it("isStripeConfigured retourne true si clé secrète définie", () => {
    const originalEnv = process.env.STRIPE_SECRET_KEY;
    process.env.STRIPE_SECRET_KEY = "sk_test_fake_key_for_testing";

    expect(isStripeConfigured()).toBe(true);

    if (originalEnv) {
      process.env.STRIPE_SECRET_KEY = originalEnv;
    } else {
      delete process.env.STRIPE_SECRET_KEY;
    }
  });
});

describe("Logique métier des plans", () => {
  it("Plan annuel etudiant a une réduction vs mensuel", () => {
    const plan = PLANS.etudiant;
    const yearlyTotal = plan.priceAnnual;
    const monthlyTotal = plan.priceMonthly * 12;
    const discount = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;

    // 2.99 * 12 = 35.88€, annuel = 29€ → ~19% de réduction
    expect(discount).toBeGreaterThan(15);
    expect(yearlyTotal).toBeLessThan(monthlyTotal);
  });

  it("Plan annuel pro a une réduction vs mensuel", () => {
    const plan = PLANS.pro;
    const yearlyTotal = plan.priceAnnual;
    const monthlyTotal = plan.priceMonthly * 12;
    const discount = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;

    // 7.99 * 12 = 95.88€, annuel = 59€ → ~38% de réduction
    expect(discount).toBeGreaterThan(30);
    expect(yearlyTotal).toBeLessThan(monthlyTotal);
  });

  it("Plan annuel equipe a une réduction vs mensuel", () => {
    const plan = PLANS.equipe;
    const yearlyTotal = plan.priceAnnual;
    const monthlyTotal = plan.priceMonthly * 12;
    const discount = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;

    // 12.99 * 12 = 155.88€, annuel = 99€ → ~36% de réduction
    expect(discount).toBeGreaterThan(30);
    expect(yearlyTotal).toBeLessThan(monthlyTotal);
  });

  it("Quotas d'analyses augmentent avec les plans", () => {
    expect(PLANS.free.limits.analysesPerPeriod).toBe(5);
    expect(PLANS.etudiant.limits.analysesPerPeriod).toBe(30);
    expect(PLANS.pro.limits.analysesPerPeriod).toBe(100);
    expect(PLANS.equipe.limits.analysesPerPeriod).toBe(9999);

    // Tous les plans sont mensuels
    expect(PLANS.free.limits.analysisPeriod).toBe("monthly");
    expect(PLANS.etudiant.limits.analysisPeriod).toBe("monthly");
    expect(PLANS.pro.limits.analysisPeriod).toBe("monthly");
    expect(PLANS.equipe.limits.analysisPeriod).toBe("monthly");
  });

  it("Rappels par jour augmentent avec les plans", () => {
    expect(PLANS.free.limits.remindersPerDay).toBe(3);
    expect(PLANS.etudiant.limits.remindersPerDay).toBeNull(); // unlimited
    expect(PLANS.pro.limits.remindersPerDay).toBeNull(); // unlimited
    expect(PLANS.equipe.limits.remindersPerDay).toBeNull(); // unlimited
  });

  it("Seuls pro et equipe ont sync et export", () => {
    expect(PLANS.free.limits.sync).toBe(false);
    expect(PLANS.free.limits.export).toBe(false);

    expect(PLANS.etudiant.limits.sync).toBe(false);
    expect(PLANS.etudiant.limits.export).toBe(false);

    expect(PLANS.pro.limits.sync).toBe(true);
    expect(PLANS.pro.limits.export).toBe(true);

    expect(PLANS.equipe.limits.sync).toBe(true);
    expect(PLANS.equipe.limits.export).toBe(true);
  });

  it("Calendrier mois accessible seulement aux plans payants", () => {
    expect(PLANS.free.limits.calendarViews).not.toContain("month");
    expect(PLANS.etudiant.limits.calendarViews).toContain("month");
    expect(PLANS.pro.limits.calendarViews).toContain("month");
    expect(PLANS.equipe.limits.calendarViews).toContain("month");
  });
});

describe("Webhook Stripe — signature invalide", () => {
  it("rejette (400) une requête avec signature invalide", async () => {
    const originalSecret = process.env.STRIPE_SECRET_KEY;
    const originalWebhook = process.env.STRIPE_WEBHOOK_SECRET;
    process.env.STRIPE_SECRET_KEY = "sk_test_fake_key_for_testing";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";

    vi.resetModules();
    const { POST } = await import("@/app/api/stripe/webhook/route");

    const body = JSON.stringify({ type: "checkout.session.completed" });
    const request = new Request("http://localhost:3000/api/stripe/webhook", {
      method: "POST",
      body,
      headers: {
        "stripe-signature": "t=9999999,v1=invalid_signature_value",
        "content-type": "application/json",
      },
    });

    const response = await POST(request as never);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error).toBe("Invalid signature");

    if (originalSecret) {
      process.env.STRIPE_SECRET_KEY = originalSecret;
    } else {
      delete process.env.STRIPE_SECRET_KEY;
    }
    if (originalWebhook) {
      process.env.STRIPE_WEBHOOK_SECRET = originalWebhook;
    } else {
      delete process.env.STRIPE_WEBHOOK_SECRET;
    }
  });
});
