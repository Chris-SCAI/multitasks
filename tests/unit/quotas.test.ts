import { describe, it, expect, beforeEach } from "vitest";
import { checkQuota, incrementQuota, getQuotaInfo } from "@/lib/quotas/checker";

const QUOTA_STORAGE_KEY = "multitasks_quota";

// ---------------------------------------------------------------------------
// Helper to set quota state in localStorage
// ---------------------------------------------------------------------------

interface QuotaState {
  plan: "free" | "etudiant" | "pro" | "equipe";
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

  // --- Plan free (monthly = 5) ---

  it("plan free: allowed si 0 analyses utilisees", () => {
    setQuotaState({ plan: "free", analysesUsedPeriod: 0 });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5);
  });

  it("plan free: allowed si 3 analyses utilisees", () => {
    setQuotaState({ plan: "free", analysesUsedPeriod: 3 });
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "free",
      analysesUsedPeriod: 3,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("plan free: not allowed si 5 analyses utilisees", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "free",
      analysesUsedPeriod: 5,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("plan free: not allowed si > 5 analyses utilisees", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "free",
      analysesUsedPeriod: 8,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("plan free: message indique le quota restant", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "free",
      analysesUsedPeriod: 3,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.message).toContain("2 analyse(s) restante(s)");
  });

  it("plan free: message indique epuise quand 0 restant", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "free",
      analysesUsedPeriod: 5,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.message).toContain("épuisé");
  });

  // --- Plan etudiant (monthly = 30) ---

  it("plan etudiant: 30 analyses par mois, allowed si < 30", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "etudiant",
      analysesUsedPeriod: 15,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(15);
  });

  it("plan etudiant: not allowed si >= 30", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "etudiant",
      analysesUsedPeriod: 30,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("plan etudiant: reset mensuel quand le mois change", () => {
    const pastMonth = new Date(2024, 0, 1);
    setQuotaState({
      plan: "etudiant",
      analysesUsedPeriod: 30,
      periodResetAt: pastMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(30);
  });

  it("plan etudiant: message contient 'ce mois'", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "etudiant",
      analysesUsedPeriod: 10,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.message).toContain("ce mois");
  });

  // --- Plan pro (monthly = 100) ---

  it("plan pro: 100 analyses par mois, allowed si < 100", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "pro",
      analysesUsedPeriod: 50,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(50);
  });

  it("plan pro: not allowed si >= 100", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "pro",
      analysesUsedPeriod: 100,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("plan pro: reset mensuel quand le mois change", () => {
    const pastMonth = new Date(2024, 0, 1);
    setQuotaState({
      plan: "pro",
      analysesUsedPeriod: 100,
      periodResetAt: pastMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(100);
  });

  it("plan pro: message contient 'ce mois'", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "pro",
      analysesUsedPeriod: 20,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.message).toContain("ce mois");
  });

  // --- Plan equipe (unlimited = 9999) ---

  it("plan equipe: analyses illimitees, toujours allowed", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "equipe",
      analysesUsedPeriod: 500,
      periodResetAt: endOfMonth.toISOString(),
    });
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9999);
    expect(result.message).toContain("illimitées");
  });

  // --- Default state (no localStorage) ---

  it("sans localStorage, retourne le plan free par defaut", () => {
    const result = checkQuota();
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5);
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
      plan: "etudiant",
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
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "free",
      analysesUsedPeriod: 2,
      periodResetAt: endOfMonth.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.plan).toBe("free");
    expect(info.used).toBe(2);
    expect(info.limit).toBe(5);
  });

  it("plan free: message de reset contient 'Renouvellement'", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "free",
      periodResetAt: endOfMonth.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.resetInfo).toContain("Renouvellement");
  });

  it("plan etudiant: retourne used = analysesUsedPeriod", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "etudiant",
      analysesUsedPeriod: 10,
      periodResetAt: endOfMonth.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.plan).toBe("etudiant");
    expect(info.used).toBe(10);
    expect(info.limit).toBe(30);
  });

  it("plan etudiant: message de reset contient 'Renouvellement'", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "etudiant",
      analysesUsedPeriod: 0,
      periodResetAt: endOfMonth.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.resetInfo).toContain("Renouvellement");
  });

  it("plan pro: retourne limit = 100", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "pro",
      analysesUsedPeriod: 40,
      periodResetAt: endOfMonth.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.plan).toBe("pro");
    expect(info.used).toBe(40);
    expect(info.limit).toBe(100);
  });

  it("plan pro: message de reset contient 'Renouvellement'", () => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setQuotaState({
      plan: "pro",
      analysesUsedPeriod: 0,
      periodResetAt: endOfMonth.toISOString(),
    });
    const info = getQuotaInfo();
    expect(info.resetInfo).toContain("Renouvellement");
  });

  it("sans localStorage: retourne les defauts free", () => {
    const info = getQuotaInfo();
    expect(info.plan).toBe("free");
    expect(info.used).toBe(0);
    expect(info.limit).toBe(5);
  });
});
