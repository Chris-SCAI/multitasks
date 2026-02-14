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
      <div>
        <h2 className="text-xl font-semibold text-white">
          Analyse IA
        </h2>
        <p className="mt-1 text-base text-neutral-300">
          Sélectionnez les tâches à analyser pour obtenir une priorisation
          Eisenhower.
        </p>
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
        >
          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#1E293B] py-16">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-violet-600/20">
            <Sparkles className="size-8 text-violet-400" />
          </div>
          <p className="mb-1 text-lg font-semibold text-white">
            Aucune tâche à analyser
          </p>
          <p className="text-base text-neutral-300">
            Ajoutez des tâches d&apos;abord pour lancer une analyse IA.
          </p>
        </div>
      ) : (
        <div className="max-h-[400px] space-y-1.5 overflow-y-auto rounded-lg border border-[#1E293B] p-2">
          {tasks.map((task) => (
            <label
              key={task.id}
              className={cn(
                "flex min-h-[44px] cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors",
                selectedIds.has(task.id)
                  ? "bg-violet-900/20"
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
      )}

      <Button
        onClick={() => onAnalyze(Array.from(selectedIds))}
        disabled={selectedIds.size === 0 || isAnalyzing || quotaExhausted}
        className="w-full bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-md transition-all hover:from-violet-600 hover:to-blue-600 hover:shadow-lg disabled:opacity-50"
        size="lg"
      >
        <Sparkles className="size-5" />
        {quotaExhausted
          ? "Quota épuisé"
          : `Analyser avec l'IA (${selectedIds.size} tâche${selectedIds.size > 1 ? "s" : ""})`}
      </Button>
    </div>
  );
}
