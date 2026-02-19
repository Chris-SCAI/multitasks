export interface PlanConfig {
  id: "free" | "etudiant" | "pro" | "equipe";
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  limits: {
    domains: number | null;
    tasks: number | null;
    analysesPerPeriod: number;
    analysisPeriod: "monthly";
    remindersPerDay: number | null;
    calendarViews: ("week" | "month")[];
    sync: boolean;
    export: boolean;
  };
  stripePriceIdMonthly: string | null;
  stripePriceIdAnnual: string | null;
  recommended: boolean;
  perUser?: boolean;
  requiresVerification?: boolean;
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Gratuit",
    description: "Pour découvrir Multitasks",
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      "Tâches illimitées",
      "5 domaines",
      "5 analyses IA / mois",
      "3 rappels / jour",
      "Vue semaine",
      "Stockage local",
    ],
    limits: {
      domains: 5,
      tasks: null,
      analysesPerPeriod: 5,
      analysisPeriod: "monthly",
      remindersPerDay: 3,
      calendarViews: ["week"],
      sync: false,
      export: false,
    },
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
    recommended: false,
  },
  etudiant: {
    id: "etudiant",
    name: "Étudiant",
    description: "Pour les étudiants vérifiés",
    priceMonthly: 2.99,
    priceAnnual: 29,
    features: [
      "Tâches illimitées",
      "Domaines illimités",
      "30 analyses IA / mois",
      "Rappels illimités",
      "Calendrier complet",
      "Stockage local",
    ],
    limits: {
      domains: null,
      tasks: null,
      analysesPerPeriod: 30,
      analysisPeriod: "monthly",
      remindersPerDay: null,
      calendarViews: ["week", "month"],
      sync: false,
      export: false,
    },
    stripePriceIdMonthly: process.env.STRIPE_PRICE_STUDENT_MONTHLY ?? null,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_STUDENT_ANNUAL ?? null,
    recommended: false,
    requiresVerification: true,
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Pour les professionnels",
    priceMonthly: 7.99,
    priceAnnual: 59,
    features: [
      "Tâches illimitées",
      "Domaines illimités",
      "100 analyses IA / mois",
      "Rappels illimités",
      "Calendrier complet",
      "Sync cloud multi-appareils",
      "Export CSV + PDF",
      "Support prioritaire",
    ],
    limits: {
      domains: null,
      tasks: null,
      analysesPerPeriod: 100,
      analysisPeriod: "monthly",
      remindersPerDay: null,
      calendarViews: ["week", "month"],
      sync: true,
      export: true,
    },
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? null,
    recommended: true,
  },
  equipe: {
    id: "equipe",
    name: "Équipe",
    description: "Pour les PME et équipes",
    priceMonthly: 12.99,
    priceAnnual: 99,
    features: [
      "Tâches illimitées",
      "Domaines illimités",
      "Analyses IA illimitées",
      "Rappels illimités",
      "Calendrier complet",
      "Sync cloud multi-appareils",
      "Export CSV + PDF",
      "Support dédié",
    ],
    limits: {
      domains: null,
      tasks: null,
      analysesPerPeriod: 9999,
      analysisPeriod: "monthly",
      remindersPerDay: null,
      calendarViews: ["week", "month"],
      sync: true,
      export: true,
    },
    stripePriceIdMonthly: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? null,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_TEAM_ANNUAL ?? null,
    recommended: false,
    perUser: true,
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
