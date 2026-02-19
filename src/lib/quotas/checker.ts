type Plan = "free" | "etudiant" | "pro" | "equipe";

interface QuotaState {
  plan: Plan;
  analysesUsedTotal: number;
  analysesUsedPeriod: number;
  periodResetAt: string | null;
}

interface QuotaLimit {
  type: "monthly";
  limit: number;
}

const QUOTA_LIMITS: Record<Plan, QuotaLimit> = {
  free: { type: "monthly", limit: 5 },
  etudiant: { type: "monthly", limit: 30 },
  pro: { type: "monthly", limit: 100 },
  equipe: { type: "monthly", limit: 9999 },
};

const QUOTA_STORAGE_KEY = "multitasks_quota";

function getDefaultQuotaState(): QuotaState {
  return {
    plan: "free",
    analysesUsedTotal: 0,
    analysesUsedPeriod: 0,
    periodResetAt: null,
  };
}

function loadQuotaState(): QuotaState {
  if (typeof window === "undefined") {
    return getDefaultQuotaState();
  }

  try {
    const stored = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (!stored) {
      return getDefaultQuotaState();
    }
    const parsed = JSON.parse(stored) as QuotaState;
    // Migration: map old plan IDs to new ones
    let plan = parsed.plan ?? "free";
    if (plan === ("ia_quotidienne" as string)) plan = "pro";
    if (plan === ("pro_sync" as string)) plan = "pro";
    return {
      plan,
      analysesUsedTotal: parsed.analysesUsedTotal ?? 0,
      analysesUsedPeriod: parsed.analysesUsedPeriod ?? 0,
      periodResetAt: parsed.periodResetAt ?? null,
    };
  } catch {
    return getDefaultQuotaState();
  }
}

function saveQuotaState(state: QuotaState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be full or unavailable
  }
}

function shouldResetPeriod(state: QuotaState): boolean {
  if (!state.periodResetAt) {
    return true;
  }

  const resetAt = new Date(state.periodResetAt);
  const now = new Date();

  return (
    now.getFullYear() > resetAt.getFullYear() ||
    (now.getFullYear() === resetAt.getFullYear() &&
      now.getMonth() > resetAt.getMonth())
  );
}

function getNextResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

function ensureResetIfNeeded(state: QuotaState): QuotaState {
  if (shouldResetPeriod(state)) {
    const updated: QuotaState = {
      ...state,
      analysesUsedPeriod: 0,
      periodResetAt: getNextResetDate(),
    };
    saveQuotaState(updated);
    return updated;
  }
  return state;
}

export function checkQuota(): {
  allowed: boolean;
  remaining: number;
  message: string;
} {
  const rawState = loadQuotaState();
  const state = ensureResetIfNeeded(rawState);
  const limit = QUOTA_LIMITS[state.plan];

  const remaining = Math.max(0, limit.limit - state.analysesUsedPeriod);
  const isUnlimited = state.plan === "equipe";

  if (isUnlimited) {
    return {
      allowed: true,
      remaining: 9999,
      message: "Analyses illimitées",
    };
  }

  return {
    allowed: remaining > 0,
    remaining,
    message:
      remaining > 0
        ? `${remaining} analyse(s) restante(s) ce mois`
        : "Quota d'analyses épuisé pour ce mois. Renouvellement au début du mois prochain.",
  };
}

export function incrementQuota(): void {
  const rawState = loadQuotaState();
  const state = ensureResetIfNeeded(rawState);

  const updated: QuotaState = {
    ...state,
    analysesUsedTotal: state.analysesUsedTotal + 1,
    analysesUsedPeriod: state.analysesUsedPeriod + 1,
    periodResetAt: state.periodResetAt ?? getNextResetDate(),
  };

  saveQuotaState(updated);
}

export function getQuotaInfo(): {
  used: number;
  limit: number;
  plan: Plan;
  resetInfo: string;
} {
  const rawState = loadQuotaState();
  const state = ensureResetIfNeeded(rawState);
  const quotaLimit = QUOTA_LIMITS[state.plan];

  const used = state.analysesUsedPeriod;

  const resetInfo = state.periodResetAt
    ? `Renouvellement le ${new Date(state.periodResetAt).toLocaleDateString("fr-FR")}`
    : "Renouvellement au début du mois prochain";

  return {
    used,
    limit: quotaLimit.limit,
    plan: state.plan,
    resetInfo,
  };
}
