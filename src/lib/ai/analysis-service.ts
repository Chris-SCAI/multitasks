import { checkQuota, incrementQuota, getQuotaInfo } from "@/lib/quotas/checker";
import type { AnalysisResponse } from "@/lib/ai/response-parser";
import type { Task } from "@/types";

interface AnalysisMetadata {
  tokensUsed: number;
  durationMs: number;
  model: string;
  taskCount: number;
}

export interface QuotaInfo {
  used: number;
  limit: number;
  plan: "free" | "ia_quotidienne" | "pro_sync";
  resetInfo: string;
}

export interface AnalysisServiceResult {
  analysis: AnalysisResponse;
  metadata: AnalysisMetadata;
}

export function loadQuotaInfo(): QuotaInfo {
  try {
    return getQuotaInfo();
  } catch {
    return { used: 0, limit: 2, plan: "free", resetInfo: "" };
  }
}

export async function executeAnalysis(tasks: Task[]): Promise<AnalysisServiceResult> {
  const quota = checkQuota();
  if (!quota.allowed) {
    throw new Error(quota.message);
  }

  const response = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Erreur lors de l'analyse");
  }

  const data = (await response.json()) as AnalysisServiceResult;
  incrementQuota();
  return data;
}
