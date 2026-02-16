"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EisenhowerMatrix } from "@/components/analysis/EisenhowerMatrix";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import type { AnalysisResponse, TaskAnalysisResult } from "@/stores/analysis-store";

const QUADRANT_BADGE: Record<
  TaskAnalysisResult["eisenhower_quadrant"],
  { label: string; className: string }
> = {
  urgent_important: {
    label: "Urgent & Important",
    className: "bg-red-900/30 text-red-400",
  },
  important_not_urgent: {
    label: "Important",
    className: "bg-blue-900/30 text-blue-400",
  },
  urgent_not_important: {
    label: "Urgent",
    className: "bg-amber-900/30 text-amber-400",
  },
  not_urgent_not_important: {
    label: "Autre",
    className: "bg-neutral-700 text-neutral-300",
  },
};

interface AnalysisResultProps {
  analysis: AnalysisResponse;
  tasks: Task[];
  onApply: () => void;
  onNewAnalysis: () => void;
}

export function AnalysisResult({
  analysis,
  tasks,
  onApply,
  onNewAnalysis,
}: AnalysisResultProps) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const sortedTasks = [...analysis.tasks].sort(
    (a, b) => a.suggested_order - b.suggested_order
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="rounded-xl border border-[#1E293B] bg-[#151D2E] p-5 md:p-6">
        <h3 className="mb-3 text-lg font-semibold text-white">
          Résumé de l&apos;analyse
        </h3>
        <p className="text-lg leading-relaxed text-neutral-300">
          {analysis.summary}
        </p>
      </div>

      {analysis.conflict_warnings.length > 0 && (
        <div className="space-y-2">
          {analysis.conflict_warnings.map((warning, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-amber-800 bg-amber-900/20 p-3"
            >
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
              <p className="text-lg text-amber-300">
                {warning}
              </p>
            </div>
          ))}
        </div>
      )}

      <EisenhowerMatrix analysis={analysis} tasks={tasks} />

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">
          Ordre suggéré
        </h3>
        <TooltipProvider>
          <div className="space-y-2">
            {sortedTasks.map((item, index) => {
              const task = taskMap.get(item.task_id);
              const badge = QUADRANT_BADGE[item.eisenhower_quadrant];
              return (
                <motion.div
                  key={item.task_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#151D2E] p-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1E293B] text-base font-semibold text-neutral-300">
                    {item.suggested_order}
                  </span>

                  <Badge
                    variant="secondary"
                    className={cn("shrink-0 text-base", badge.className)}
                  >
                    {badge.label}
                  </Badge>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-medium text-white">
                      {task?.title ??
                        `Tâche ${item.task_id.slice(0, 8)}`}
                    </p>
                    <p className="truncate text-base text-neutral-300">
                      {item.next_action}
                    </p>
                  </div>

                  <span className="flex shrink-0 items-center gap-1.5 text-base text-neutral-300">
                    <Clock className="size-4" />
                    {item.estimated_duration_minutes}min
                  </span>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="shrink-0 rounded-md p-1 text-neutral-400 hover:text-neutral-200"
                      >
                        <span className="sr-only">Raisonnement</span>
                        <svg
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="max-w-xs text-sm"
                    >
                      {item.reasoning}
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={onApply}
          className="flex-1 bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600"
          size="lg"
        >
          <Check className="size-6" />
          Appliquer les suggestions
        </Button>
        <Button
          variant="ghost"
          onClick={onNewAnalysis}
          className="flex-1"
          size="lg"
        >
          <RotateCcw className="size-6" />
          Nouvelle analyse
        </Button>
      </div>
    </motion.div>
  );
}
