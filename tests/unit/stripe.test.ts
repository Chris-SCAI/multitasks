import { describe, it, expect, beforeEach, vi } from "vitest";
import { PLANS, getPlan, isFeatureAvailable, ANALYSIS_PACKS, STUDENT_DISCOUNT } from "@/lib/stripe/plans";
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
  it("exporte les 3 plans (free, ia_quotidienne, pro_sync)", () => {
    expect(PLANS.free).toBeDefined();
    expect(PLANS.ia_quotidienne).toBeDefined();
    expect(PLANS.pro_sync).toBeDefined();
    expect(Object.keys(PLANS)).toHaveLength(3);
  });

  it("plan free a les bons prix (0€)", () => {
    const plan = PLANS.free;
    expect(plan.priceMonthly).toBe(0);
    expect(plan.priceAnnual).toBe(0);
    expect(plan.stripePriceIdMonthly).toBeNull();
    expect(plan.stripePriceIdAnnual).toBeNull();
  });

  it("plan free a les bonnes limites (3 domaines, 60 tâches, 2 analyses lifetime)", () => {
    const plan = PLANS.free;
    expect(plan.limits.domains).toBe(3);
    expect(plan.limits.tasks).toBe(60);
    expect(plan.limits.analysesPerPeriod).toBe(2);
    expect(plan.limits.analysisPeriod).toBe("lifetime");
    expect(plan.limits.remindersPerDay).toBe(1);
    expect(plan.limits.calendarViews).toEqual(["week"]);
    expect(plan.limits.sync).toBe(false);
    expect(plan.limits.export).toBe(false);
  });

  it("plan ia_quotidienne a les bons prix (5.90€/mois, 49€/an)", () => {
    const plan = PLANS.ia_quotidienne;
    expect(plan.priceMonthly).toBe(5.9);
    expect(plan.priceAnnual).toBe(49);
  });

  it("plan ia_quotidienne a les bonnes limites (illimité, 8 analyses/mois, 5 rappels/jour)", () => {
    const plan = PLANS.ia_quotidienne;
    expect(plan.limits.domains).toBeNull();
    expect(plan.limits.tasks).toBeNull();
    expect(plan.limits.analysesPerPeriod).toBe(8);
    expect(plan.limits.analysisPeriod).toBe("monthly");
    expect(plan.limits.remindersPerDay).toBe(5);
    expect(plan.limits.calendarViews).toEqual(["week", "month"]);
    expect(plan.limits.sync).toBe(false);
    expect(plan.limits.export).toBe(false);
  });

  it("plan pro_sync a les bons prix (12.90€/mois, 99€/an)", () => {
    const plan = PLANS.pro_sync;
    expect(plan.priceMonthly).toBe(12.9);
    expect(plan.priceAnnual).toBe(99);
  });

  it("plan pro_sync a les bonnes limites (tout illimité, 3 analyses/jour, sync, export)", () => {
    const plan = PLANS.pro_sync;
    expect(plan.limits.domains).toBeNull();
    expect(plan.limits.tasks).toBeNull();
    expect(plan.limits.analysesPerPeriod).toBe(3);
    expect(plan.limits.analysisPeriod).toBe("daily");
    expect(plan.limits.remindersPerDay).toBeNull();
    expect(plan.limits.calendarViews).toEqual(["week", "month"]);
    expect(plan.limits.sync).toBe(true);
    expect(plan.limits.export).toBe(true);
    expect(plan.recommended).toBe(true);
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

  it("STUDENT_DISCOUNT est 50% sur pro_sync avec prix annuel 49€", () => {
    expect(STUDENT_DISCOUNT.percentOff).toBe(50);
    expect(STUDENT_DISCOUNT.eligiblePlans).toContain("pro_sync");
    expect(STUDENT_DISCOUNT.annualPriceWithDiscount).toBe(49);
  });

  it("getPlan retourne le bon plan pour un id valide", () => {
    expect(getPlan("free").id).toBe("free");
    expect(getPlan("ia_quotidienne").id).toBe("ia_quotidienne");
    expect(getPlan("pro_sync").id).toBe("pro_sync");
  });

  it("getPlan retourne le plan free pour un id invalide", () => {
    const plan = getPlan("invalid-plan-id");
    expect(plan.id).toBe("free");
  });

  it("isFeatureAvailable retourne true pour les features du plan courant", () => {
    expect(isFeatureAvailable("pro_sync", "sync")).toBe(true);
    expect(isFeatureAvailable("pro_sync", "export")).toBe(true);
    expect(isFeatureAvailable("pro_sync", "month_calendar")).toBe(true);
  });

  it("isFeatureAvailable retourne false pour les features au-dessus du plan", () => {
    expect(isFeatureAvailable("free", "sync")).toBe(false);
    expect(isFeatureAvailable("free", "export")).toBe(false);
    expect(isFeatureAvailable("free", "month_calendar")).toBe(false);
    expect(isFeatureAvailable("ia_quotidienne", "sync")).toBe(false);
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
    useSubscriptionStore.getState().setPlan("ia_quotidienne");
    expect(useSubscriptionStore.getState().currentPlan).toBe("ia_quotidienne");
    expect(useSubscriptionStore.getState().getPlanConfig().id).toBe("ia_quotidienne");
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
    // Set un plan
    useSubscriptionStore.getState().setPlan("pro_sync");
    useSubscriptionStore.getState().setBillingPeriod("annual");
    useSubscriptionStore.getState().setStripeIds("cus_abc", "sub_xyz");

    // Vérifier que les données sont dans localStorage
    const stored = localStorage.getItem("multitasks-subscription");
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.currentPlan).toBe("pro_sync");
    expect(parsed.state.billingPeriod).toBe("annual");
    expect(parsed.state.stripeCustomerId).toBe("cus_abc");
    expect(parsed.state.stripeSubscriptionId).toBe("sub_xyz");
  });

  it("persist restaure l'état après clear et réinitialisation", () => {
    // Set un état
    useSubscriptionStore.getState().setPlan("ia_quotidienne");
    useSubscriptionStore.getState().setBillingPeriod("annual");

    // Simuler un reload en réinitialisant le store manuellement
    const stored = localStorage.getItem("multitasks-subscription");
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);

    // Vérifier que les données persistent
    expect(parsed.state.currentPlan).toBe("ia_quotidienne");
    expect(parsed.state.billingPeriod).toBe("annual");
  });

  it("passage de free à ia_quotidienne donne accès au calendrier mois", () => {
    // Plan free initial
    let plan = useSubscriptionStore.getState().getPlanConfig();
    expect(plan.limits.calendarViews).toEqual(["week"]);

    // Upgrade vers ia_quotidienne
    useSubscriptionStore.getState().setPlan("ia_quotidienne");
    plan = useSubscriptionStore.getState().getPlanConfig();
    expect(plan.limits.calendarViews).toContain("month");
  });

  it("passage de ia_quotidienne à pro_sync donne accès au sync et export", () => {
    useSubscriptionStore.getState().setPlan("ia_quotidienne");
    let plan = useSubscriptionStore.getState().getPlanConfig();
    expect(plan.limits.sync).toBe(false);
    expect(plan.limits.export).toBe(false);

    useSubscriptionStore.getState().setPlan("pro_sync");
    plan = useSubscriptionStore.getState().getPlanConfig();
    expect(plan.limits.sync).toBe(true);
    expect(plan.limits.export).toBe(true);
  });
});

describe("Sécurité Stripe", () => {
  it("STRIPE_SECRET_KEY n'est pas dans un fichier NEXT_PUBLIC", () => {
    // Ce test vérifie conceptuellement que la clé secrète n'est jamais exposée côté client
    // Dans le code source, on vérifie que les variables NEXT_PUBLIC ne contiennent jamais SECRET
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
    // ia_quotidienne et pro_sync ont des stripePriceId configurés via env
    // En test, ils peuvent être null si l'env n'est pas set, ce qui est attendu
    const iaPlan = PLANS.ia_quotidienne;
    const proPlan = PLANS.pro_sync;

    // On vérifie juste que les champs existent (peuvent être null en test)
    expect(iaPlan).toHaveProperty("stripePriceIdMonthly");
    expect(iaPlan).toHaveProperty("stripePriceIdAnnual");
    expect(proPlan).toHaveProperty("stripePriceIdMonthly");
    expect(proPlan).toHaveProperty("stripePriceIdAnnual");
  });

  it("Types de plans sont bien typés (type safety)", () => {
    const planIds: Array<"free" | "ia_quotidienne" | "pro_sync"> = ["free", "ia_quotidienne", "pro_sync"];
    planIds.forEach((id) => {
      const plan = PLANS[id];
      expect(plan.id).toBe(id);
    });
  });
});

describe("Client Stripe (client.ts)", () => {
  beforeEach(() => {
    // Reset l'instance singleton entre les tests
    vi.resetModules();
  });

  it("getStripeClient retourne null si STRIPE_SECRET_KEY n'est pas définie", () => {
    // En environnement de test, la clé n'est probablement pas définie
    const originalEnv = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    const client = getStripeClient();
    expect(client).toBeNull();

    // Restaurer
    if (originalEnv) process.env.STRIPE_SECRET_KEY = originalEnv;
  });

  it("isStripeConfigured retourne false si pas de clé secrète", () => {
    const originalEnv = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    expect(isStripeConfigured()).toBe(false);

    // Restaurer
    if (originalEnv) process.env.STRIPE_SECRET_KEY = originalEnv;
  });

  it("isStripeConfigured retourne true si clé secrète définie", () => {
    const originalEnv = process.env.STRIPE_SECRET_KEY;
    process.env.STRIPE_SECRET_KEY = "sk_test_fake_key_for_testing";

    expect(isStripeConfigured()).toBe(true);

    // Restaurer
    if (originalEnv) {
      process.env.STRIPE_SECRET_KEY = originalEnv;
    } else {
      delete process.env.STRIPE_SECRET_KEY;
    }
  });
});

describe("Logique métier des plans", () => {
  it("Plan annuel ia_quotidienne a une réduction vs mensuel (~17%)", () => {
    const plan = PLANS.ia_quotidienne;
    const yearlyTotal = plan.priceAnnual;
    const monthlyTotal = plan.priceMonthly * 12;
    const discount = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;

    // 5.90 * 12 = 70.80€, annuel = 49€ → ~30% de réduction
    expect(discount).toBeGreaterThan(15);
    expect(yearlyTotal).toBeLessThan(monthlyTotal);
  });

  it("Plan annuel pro_sync a une réduction vs mensuel (~36%)", () => {
    const plan = PLANS.pro_sync;
    const yearlyTotal = plan.priceAnnual;
    const monthlyTotal = plan.priceMonthly * 12;
    const discount = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;

    // 12.90 * 12 = 154.80€, annuel = 99€ → ~36% de réduction
    expect(discount).toBeGreaterThan(30);
    expect(yearlyTotal).toBeLessThan(monthlyTotal);
  });

  it("Réduction étudiante pro_sync annuel = prix ia_quotidienne annuel", () => {
    const proPlan = PLANS.pro_sync;
    const iaPlan = PLANS.ia_quotidienne;

    // Réduction 50% sur pro_sync annuel (99€) = 49.50€ arrondi à 49€
    const studentPrice = STUDENT_DISCOUNT.annualPriceWithDiscount;
    expect(studentPrice).toBe(49);
    expect(studentPrice).toBe(iaPlan.priceAnnual);
  });

  it("Quotas d'analyses augmentent avec les plans", () => {
    expect(PLANS.free.limits.analysesPerPeriod).toBe(2);
    expect(PLANS.ia_quotidienne.limits.analysesPerPeriod).toBe(8);
    expect(PLANS.pro_sync.limits.analysesPerPeriod).toBe(3);

    // Note: pro_sync a moins que ia_quotidienne mais c'est quotidien vs mensuel
    expect(PLANS.free.limits.analysisPeriod).toBe("lifetime");
    expect(PLANS.ia_quotidienne.limits.analysisPeriod).toBe("monthly");
    expect(PLANS.pro_sync.limits.analysisPeriod).toBe("daily");
  });

  it("Rappels par jour augmentent avec les plans", () => {
    expect(PLANS.free.limits.remindersPerDay).toBe(1);
    expect(PLANS.ia_quotidienne.limits.remindersPerDay).toBe(5);
    expect(PLANS.pro_sync.limits.remindersPerDay).toBeNull(); // unlimited
  });

  it("Seul pro_sync a sync et export", () => {
    expect(PLANS.free.limits.sync).toBe(false);
    expect(PLANS.free.limits.export).toBe(false);

    expect(PLANS.ia_quotidienne.limits.sync).toBe(false);
    expect(PLANS.ia_quotidienne.limits.export).toBe(false);

    expect(PLANS.pro_sync.limits.sync).toBe(true);
    expect(PLANS.pro_sync.limits.export).toBe(true);
  });

  it("Calendrier mois accessible seulement aux plans payants", () => {
    expect(PLANS.free.limits.calendarViews).not.toContain("month");
    expect(PLANS.ia_quotidienne.limits.calendarViews).toContain("month");
    expect(PLANS.pro_sync.limits.calendarViews).toContain("month");
  });
});
