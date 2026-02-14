import { create } from "zustand";
import type {
  AnalysisResponse,
  TaskAnalysisResult,
} from "@/lib/ai/response-parser";
import {
  loadQuotaInfo,
  executeAnalysis,
  type QuotaInfo,
} from "@/lib/ai/analysis-service";
import type { Task, TaskPriority } from "@/types";

interface AnalysisMetadata {
  tokensUsed: number;
  durationMs: number;
  model: string;
  taskCount: number;
}

interface HistoryEntry {
  analysis: AnalysisResponse;
  metadata: AnalysisMetadata;
  createdAt: string;
}

type AnalysisStatus = "idle" | "loading" | "done" | "error";

interface AnalysisState {
  status: AnalysisStatus;
  result: AnalysisResponse | null;
  analysisMetadata: AnalysisMetadata | null;
  error: string | null;
  quotaInfo: QuotaInfo;
  history: HistoryEntry[];

  runAnalysis: (taskIds: string[], tasks: Task[]) => Promise<void>;
  clearAnalysis: () => void;
  applyAnalysis: (
    updateTask: (
      id: string,
      input: { priority?: TaskPriority; estimatedMinutes?: number | null; order?: number }
    ) => Promise<void>
  ) => Promise<void>;
  refreshQuota: () => void;
}

// Re-export for backwards compatibility
export type { AnalysisResponse, TaskAnalysisResult, QuotaInfo };

const PRIORITY_MAP: Record<string, TaskPriority> = {
  urgent: "urgent",
  high: "high",
  medium: "medium",
  low: "low",
};

function mapPriority(
  suggested: TaskAnalysisResult["suggested_priority"]
): TaskPriority {
  return PRIORITY_MAP[suggested] ?? "medium";
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  status: "idle",
  result: null,
  analysisMetadata: null,
  error: null,
  quotaInfo: loadQuotaInfo(),
  history: [],

  runAnalysis: async (_taskIds, tasks) => {
    set({ status: "loading", error: null });

    try {
      const data = await executeAnalysis(tasks);

      set((state) => ({
        status: "done",
        result: data.analysis,
        analysisMetadata: data.metadata,
        error: null,
        quotaInfo: loadQuotaInfo(),
        history: [
          ...state.history,
          {
            analysis: data.analysis,
            metadata: data.metadata,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    } catch (e) {
      set({
        status: "error",
        error: (e as Error).message,
        quotaInfo: loadQuotaInfo(),
      });
    }
  },

  clearAnalysis: () => {
    set({ status: "idle", result: null, analysisMetadata: null, error: null });
  },

  applyAnalysis: async (updateTask) => {
    const { result } = get();
    if (!result) return;

    for (const task of result.tasks) {
      await updateTask(task.task_id, {
        priority: mapPriority(task.suggested_priority),
        estimatedMinutes: task.estimated_duration_minutes,
        order: task.suggested_order,
      });
    }
  },

  refreshQuota: () => {
    set({ quotaInfo: loadQuotaInfo() });
  },
}));
