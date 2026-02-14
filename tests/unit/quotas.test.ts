import { describe, it, expect, beforeEach } from "vitest";
import { checkQuota, incrementQuota, getQuotaInfo } from "@/lib/quotas/checker";

const QUOTA_STORAGE_KEY = "multitasks_quota";

// ---------------------------------------------------------------------------
// Helper to set quota state in localStorage
// ---------------------------------------------------------------------------

interface QuotaState {
  plan: "free" | "ia_quotidienne" | "pro_sync";
  analysesUsedTotal: number;
  analysesUsedPeriod: number;
  periodResetAt: string | null;
}

function setQuotaState(state: Partial<QuotaState>): void {
  const full: QuotaState = {
    plan: "free",
    analysesUsedTotal: 0,
    analysesUsedPeriod: 0,
    periodResetAt: null,
    ...state,
  };
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(full));
}

function getStoredState(): QuotaState | null {
  const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ---------------------------------------------------------------------------
// checkQuota
// ---------------------------------------------------------------------------

describe("checkQuota", () => {
  beforeEach(() => localStorage.clear());

  // --- Plan free (lifetime = 2) ---

  it("plan free: allowed si 0 analyses utilisees", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 0 });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("plan free: allowed si 1 analyse utilisee", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 1 });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it("plan free: not allowed si 2 analyses utilisees", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 2 });
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("plan free: not allowed si > 2 analyses utilisees", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 5 });
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("plan free: message indique le quota restant", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 1 });
    const result = checkQuota();
    expect(result.message).toContain("1 analyse(s) restante(s)");
  });

  it("plan free: message indique epuise quand 0 restant", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 2 });
    const result = checkQuota();
    expect(result.message).toContain("épuisé");
  });

  // --- Plan ia_quotidienne (monthly = 8) ---

  it("plan ia_quotidienne: 8 analyses par mois, allowed si < 8", () => {
    // Set periodResetAt to current month so no reset
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "ia_quotidienne",
      analysesUsedPeriod: 5,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(3);
  });

  it("plan ia_quotidienne: not allowed si >= 8", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "ia_quotidienne",
      analysesUsedPeriod: 8,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("plan ia_quotidienne: reset mensuel quand le mois change", () => {
    // Set periodResetAt to a past month so it resets
    const pastMonth = new Date(2024, 0, 1); // January 2024
    setQuotaState({
      plan: "ia_quotidienne",
      analysesUsedPeriod: 8,
      periodResetAt: pastMonth.toISOString(),
    });
    const result = checkQuota();
    // Should have been reset, so allowed again
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(8);
  });

  it("plan ia_quotidienne: message contient 'ce mois'", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "ia_quotidienne",
      analysesUsedPeriod: 3,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.message).toContain("ce mois");
  });

  // --- Plan pro_sync (daily = 3) ---

  it("plan pro_sync: 3 analyses par jour, allowed si < 3", () => {
    // periodResetAt = today so no reset
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    setQuotaState({
      plan: "pro_sync",
      analysesUsedPeriod: 1,
      periodResetAt: today.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("plan pro_sync: not allowed si >= 3", () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    setQuotaState({
      plan: "pro_sync",
      analysesUsedPeriod: 3,
      periodResetAt: today.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("plan pro_sync: reset quotidien quand le jour change", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setQuotaState({
      plan: "pro_sync",
      analysesUsedPeriod: 3,
      periodResetAt: yesterday.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(3);
  });

  it("plan pro_sync: message contient 'aujourd'hui'", () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    setQuotaState({
      plan: "pro_sync",
      analysesUsedPeriod: 1,
      periodResetAt: today.toISOString(),
    });
    const result = checkQuota();
    expect(result.message).toContain("aujourd'hui");
  });

  // --- Default state (no localStorage) ---

  it("sans localStorage, retourne le plan free par defaut", () => {
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// incrementQuota
// ---------------------------------------------------------------------------

describe("incrementQuota", () => {
  beforeEach(() => localStorage.clear());

  it("incremente le compteur total et periode", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 0, analysesUsedPeriod: 0 });
    incrementQuota();
    const state = getStoredState()!;
    expect(state.analysesUsedTotal).toBe(1);
    expect(state.analysesUsedPeriod).toBe(1);
  });

  it("incremente a partir de l'etat existant", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "ia_quotidienne",
      analysesUsedTotal: 5,
      analysesUsedPeriod: 3,
      periodResetAt: endOfMonth.toISOString(),
    });
    incrementQuota();
    const state = getStoredState()!;
    expect(state.analysesUsedTotal).toBe(6);
    expect(state.analysesUsedPeriod).toBe(4);
  });

  it("le compteur persiste dans localStorage", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 0 });
    incrementQuota();
    // Re-read from localStorage directly
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const stored = JSON.parse(raw!);
    expect(stored.analysesUsedTotal).toBe(1);
  });

  it("deux increments successifs = compteur a 2", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 0 });
    incrementQuota();
    incrementQuota();
    const state = getStoredState()!;
    expect(state.analysesUsedTotal).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// getQuotaInfo
// ---------------------------------------------------------------------------

describe("getQuotaInfo", () => {
  beforeEach(() => localStorage.clear());

  it("plan free: retourne les bonnes valeurs", () => {
    setQuotaState({ plan: "free", analysesUsedTotal: 1 });
    const info = getQuotaInfo();
    expect(info.plan).toBe("free");
    expect(info.used).toBe(1);
    expect(info.limit).toBe(2);
  });

  it("plan free: message de reset 'a vie'", () => {
    setQuotaState({ plan: "free" });
    const info = getQuotaInfo();
    expect(info.resetInfo).toContain("vie");
  });

  it("plan ia_quotidienne: retourne used = analysesUsedPeriod", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "ia_quotidienne",
      analysesUsedPeriod: 4,
      periodResetAt: endOfMonth.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.plan).toBe("ia_quotidienne");
    expect(info.used).toBe(4);
    expect(info.limit).toBe(8);
  });

  it("plan ia_quotidienne: message de reset contient 'Renouvellement'", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "ia_quotidienne",
      analysesUsedPeriod: 0,
      periodResetAt: endOfMonth.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.resetInfo).toContain("Renouvellement");
  });

  it("plan pro_sync: retourne limit = 3", () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    setQuotaState({
      plan: "pro_sync",
      analysesUsedPeriod: 2,
      periodResetAt: today.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.plan).toBe("pro_sync");
    expect(info.used).toBe(2);
    expect(info.limit).toBe(3);
  });

  it("plan pro_sync: message de reset quotidien", () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    setQuotaState({
      plan: "pro_sync",
      analysesUsedPeriod: 0,
      periodResetAt: today.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.resetInfo).toContain("quotidien");
  });

  it("sans localStorage: retourne les defauts free", () => {
    const info = getQuotaInfo();
    expect(info.plan).toBe("free");
    expect(info.used).toBe(0);
    expect(info.limit).toBe(2);
  });
});
