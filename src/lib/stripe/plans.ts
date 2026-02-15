export interface PlanConfig {
  id: "free" | "ia_quotidienne" | "pro_sync";
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  limits: {
    domains: number | null;
    tasks: number | null;
    analysesPerPeriod: number;
    analysisPeriod: "lifetime" | "monthly" | "daily";
    remindersPerDay: number | null;
    calendarViews: ("week" | "month")[];
    sync: boolean;
    export: boolean;
  };
  stripePriceIdMonthly: string | null;
  stripePriceIdAnnual: string | null;
  recommended: boolean;
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Gratuit",
    description: "Pour découvrir Multitasks",
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      "3 domaines",
      "60 tâches",
      "2 analyses IA (à vie)",
      "Vue semaine",
      "Stockage local",
    ],
    limits: {
      domains: 3,
      tasks: 60,
      analysesPerPeriod: 2,
      analysisPeriod: "lifetime",
      remindersPerDay: 1,
      calendarViews: ["week"],
      sync: false,
      export: false,
    },
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
    recommended: false,
  },
  ia_quotidienne: {
    id: "ia_quotidienne",
    name: "IA Quotidienne",
    description: "Pour les utilisateurs réguliers",
    priceMonthly: 5.9,
    priceAnnual: 49,
    features: [
      "Domaines illimités",
      "Tâches illimitées",
      "8 analyses IA / mois",
      "5 rappels / jour",
      "Calendrier complet",
      "Stockage local",
    ],
    limits: {
      domains: null,
      tasks: null,
      analysesPerPeriod: 8,
      analysisPeriod: "monthly",
      remindersPerDay: 5,
      calendarViews: ["week", "month"],
      sync: false,
      export: false,
    },
    stripePriceIdMonthly: process.env.STRIPE_PRICE_IA_MONTHLY ?? null,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_IA_ANNUAL ?? null,
    recommended: false,
  },
  pro_sync: {
    id: "pro_sync",
    name: "Pro Sync",
    description: "Pour les professionnels exigeants",
    priceMonthly: 12.9,
    priceAnnual: 99,
    features: [
      "Tout illimité",
      "3 analyses IA / jour",
      "Rappels illimités",
      "Sync cloud multi-appareils",
      "Export CSV + PDF",
      "Support prioritaire",
    ],
    limits: {
      domains: null,
      tasks: null,
      analysesPerPeriod: 3,
      analysisPeriod: "daily",
      remindersPerDay: null,
      calendarViews: ["week", "month"],
      sync: true,
      export: true,
    },
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? null,
    recommended: true,
  },
};

export function getPlan(planId: string): PlanConfig {
  return PLANS[planId] ?? PLANS.free;
}

export function isFeatureAvailable(
  planId: string,
  feature: "sync" | "export" | "month_calendar"
): boolean {
  const plan = getPlan(planId);
  switch (feature) {
    case "sync":
      return plan.limits.sync;
    case "export":
      return plan.limits.export;
    case "month_calendar":
      return plan.limits.calendarViews.includes("month");
    default:
      return false;
  }
}

export const ANALYSIS_PACKS = [
  { id: "pack_10", name: "10 analyses", price: 4.9, analyses: 10 },
  { id: "pack_30", name: "30 analyses", price: 9.9, analyses: 30 },
];

export const STUDENT_DISCOUNT = {
  percentOff: 50,
  couponId: process.env.STRIPE_STUDENT_COUPON_ID ?? null,
  eligiblePlans: ["pro_sync"] as const,
  annualPriceWithDiscount: 49,
};
