"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuotaIndicator } from "@/components/analysis/QuotaIndicator";
import type { Task } from "@/types";
import type { QuotaInfo } from "@/stores/analysis-store";

interface AnalysisLauncherProps {
  tasks: Task[];
  onAnalyze: (taskIds: string[]) => void;
  isAnalyzing: boolean;
  quotaInfo: QuotaInfo;
}

export function AnalysisLauncher({
  tasks,
  onAnalyze,
  isAnalyzing,
  quotaInfo,
}: AnalysisLauncherProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const maxSelection = 20;
  const remaining = Math.max(0, quotaInfo.limit - quotaInfo.used);
  const quotaExhausted = remaining === 0 && quotaInfo.plan !== "pro_sync";

  function toggleTask(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < maxSelection) {
        next.add(id);
      }
      return next;
    });
  }

  function selectAll() {
    const ids = tasks.slice(0, maxSelection).map((t) => t.id);
    setSelectedIds(new Set(ids));
  }

  function deselectAll() {
    setSelectedIds(new Set());
  }

  const allSelected =
    tasks.length > 0 &&
    selectedIds.size === Math.min(tasks.length, maxSelection);

  return (
    <div className="space-y-6">
      {/* Header premium avec icon gradient */}
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
          <Sparkles className="size-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Analyse IA</h2>
          <p className="mt-1 text-base text-neutral-300">
            Sélectionnez les tâches à analyser pour obtenir une priorisation
            Eisenhower.
          </p>
        </div>
      </div>

      <QuotaIndicator
        used={quotaInfo.used}
        limit={quotaInfo.limit}
        plan={quotaInfo.plan}
      />

      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-neutral-300">
          {selectedIds.size}/{maxSelection} tâches sélectionnées
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? deselectAll : selectAll}
          className="text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
        >
          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#1E293B] py-16">
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-full bg-violet-600/15 blur-[80px]" />
          </div>
          <div className="relative">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/20">
              <Sparkles className="size-8 text-violet-400" />
            </div>
            <p className="mb-1 text-lg font-semibold text-white">
              Aucune tâche à analyser
            </p>
            <p className="text-base text-neutral-300">
              Ajoutez des tâches d&apos;abord pour lancer une analyse IA.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl">
          {/* Gradient border on task list */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/20 via-blue-500/10 to-transparent" />
          <div className="relative max-h-[400px] space-y-1.5 overflow-y-auto rounded-2xl bg-[#0B1120] p-3">
            {tasks.map((task) => (
              <label
                key={task.id}
                className={cn(
                  "flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200",
                  selectedIds.has(task.id)
                    ? "bg-violet-900/25 shadow-sm shadow-violet-500/10"
                    : "hover:bg-[#1C2640]"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(task.id)}
                  onChange={() => toggleTask(task.id)}
                  className="size-4 shrink-0 rounded border-[#1E293B] text-violet-600 focus:ring-violet-500"
                />
                <span className="truncate text-base font-medium text-white">
                  {task.title}
                </span>
                {task.priority && (
                  <span
                    className={cn(
                      "ml-auto shrink-0 rounded-full px-2 py-0.5 text-sm font-medium",
                      task.priority === "urgent" &&
                        "bg-red-900/30 text-red-400",
                      task.priority === "high" &&
                        "bg-amber-900/30 text-amber-400",
                      task.priority === "medium" &&
                        "bg-blue-900/30 text-blue-400",
                      task.priority === "low" &&
                        "bg-neutral-700 text-neutral-300"
                    )}
                  >
                    {task.priority}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={() => onAnalyze(Array.from(selectedIds))}
        disabled={selectedIds.size === 0 || isAnalyzing || quotaExhausted}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-6 text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50"
        size="lg"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative flex items-center justify-center gap-2">
          <Sparkles className="size-5" />
          {quotaExhausted
            ? "Quota épuisé"
            : `Analyser avec l'IA (${selectedIds.size} tâche${selectedIds.size > 1 ? "s" : ""})`}
        </span>
      </Button>
    </div>
  );
}
