type Plan = "free" | "ia_quotidienne" | "pro_sync";

interface QuotaState {
  plan: Plan;
  analysesUsedTotal: number;
  analysesUsedPeriod: number;
  periodResetAt: string | null;
}

interface QuotaLimit {
  type: "lifetime" | "monthly" | "daily";
  limit: number;
}

const QUOTA_LIMITS: Record<Plan, QuotaLimit> = {
  free: { type: "lifetime", limit: 2 },
  ia_quotidienne: { type: "monthly", limit: 8 },
  pro_sync: { type: "daily", limit: 3 },
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
    return {
      plan: parsed.plan ?? "free",
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
  const limit = QUOTA_LIMITS[state.plan];

  if (limit.type === "lifetime") {
    return false;
  }

  if (!state.periodResetAt) {
    return true;
  }

  const resetAt = new Date(state.periodResetAt);
  const now = new Date();

  if (limit.type === "monthly") {
    return (
      now.getFullYear() > resetAt.getFullYear() ||
      (now.getFullYear() === resetAt.getFullYear() &&
        now.getMonth() > resetAt.getMonth())
    );
  }

  if (limit.type === "daily") {
    const nowDate = now.toISOString().split("T")[0];
    const resetDate = resetAt.toISOString().split("T")[0];
    return nowDate !== resetDate;
  }

  return false;
}

function getNextResetDate(plan: Plan): string {
  const now = new Date();
  const limit = QUOTA_LIMITS[plan];

  if (limit.type === "monthly") {
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString();
  }

  if (limit.type === "daily") {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }

  return now.toISOString();
}

function ensureResetIfNeeded(state: QuotaState): QuotaState {
  if (shouldResetPeriod(state)) {
    const updated: QuotaState = {
      ...state,
      analysesUsedPeriod: 0,
      periodResetAt: getNextResetDate(state.plan),
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

  if (limit.type === "lifetime") {
    const remaining = Math.max(0, limit.limit - state.analysesUsedTotal);
    return {
      allowed: remaining > 0,
      remaining,
      message:
        remaining > 0
          ? `${remaining} analyse(s) restante(s) sur ${limit.limit}`
          : "Quota d'analyses gratuit épuisé. Passez au plan IA Quotidienne pour continuer.",
    };
  }

  const remaining = Math.max(0, limit.limit - state.analysesUsedPeriod);
  const periodLabel = limit.type === "monthly" ? "ce mois" : "aujourd'hui";
  return {
    allowed: remaining > 0,
    remaining,
    message:
      remaining > 0
        ? `${remaining} analyse(s) restante(s) ${periodLabel}`
        : `Quota d'analyses épuisé pour ${periodLabel}. ${
            limit.type === "monthly"
              ? "Renouvellement au début du mois prochain."
              : "Renouvellement demain."
          }`,
  };
}

export function incrementQuota(): void {
  const rawState = loadQuotaState();
  const state = ensureResetIfNeeded(rawState);

  const updated: QuotaState = {
    ...state,
    analysesUsedTotal: state.analysesUsedTotal + 1,
    analysesUsedPeriod: state.analysesUsedPeriod + 1,
    periodResetAt: state.periodResetAt ?? getNextResetDate(state.plan),
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

  const used =
    quotaLimit.type === "lifetime"
      ? state.analysesUsedTotal
      : state.analysesUsedPeriod;

  let resetInfo: string;
  if (quotaLimit.type === "lifetime") {
    resetInfo = "Quota à vie (non renouvelable)";
  } else if (quotaLimit.type === "monthly") {
    resetInfo = state.periodResetAt
      ? `Renouvellement le ${new Date(state.periodResetAt).toLocaleDateString("fr-FR")}`
      : "Renouvellement au début du mois prochain";
  } else {
    resetInfo = "Renouvellement quotidien";
  }

  return {
    used,
    limit: quotaLimit.limit,
    plan: state.plan,
    resetInfo,
  };
}
