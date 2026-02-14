"use client";

import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import type { AnalysisResponse, TaskAnalysisResult } from "@/stores/analysis-store";

type Quadrant = TaskAnalysisResult["eisenhower_quadrant"];

const QUADRANT_CONFIG: Record<
  Quadrant,
  { title: string; description: string; bg: string; border: string }
> = {
  urgent_important: {
    title: "Urgent & Important",
    description: "À faire immédiatement",
    bg: "bg-red-900/20",
    border: "border-l-4 border-red-500",
  },
  important_not_urgent: {
    title: "Important",
    description: "À planifier",
    bg: "bg-blue-900/20",
    border: "border-l-4 border-blue-500",
  },
  urgent_not_important: {
    title: "Urgent",
    description: "À déléguer",
    bg: "bg-amber-900/20",
    border: "border-l-4 border-amber-500",
  },
  not_urgent_not_important: {
    title: "Ni urgent ni important",
    description: "À éliminer ou reporter",
    bg: "bg-[#0B1120]",
    border: "border-l-4 border-neutral-600",
  },
};

const QUADRANT_ORDER: Quadrant[] = [
  "urgent_important",
  "important_not_urgent",
  "urgent_not_important",
  "not_urgent_not_important",
];

interface EisenhowerMatrixProps {
  analysis: AnalysisResponse;
  tasks: Task[];
}

export function EisenhowerMatrix({ analysis, tasks }: EisenhowerMatrixProps) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  const grouped = QUADRANT_ORDER.map((quadrant) => ({
    quadrant,
    config: QUADRANT_CONFIG[quadrant],
    items: analysis.tasks.filter((t) => t.eisenhower_quadrant === quadrant),
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {grouped.map(({ quadrant, config, items }, index) => (
          <motion.div
            key={quadrant}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.1 }}
            className={cn(
              "rounded-lg p-4",
              config.bg,
              config.border
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-base font-semibold text-white">
                {config.title}
              </h4>
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-sm font-medium text-neutral-300">
                {items.length}
              </span>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Aucune tâche dans ce quadrant
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => {
                  const task = taskMap.get(item.task_id);
                  return (
                    <motion.div
                      key={item.task_id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.08 }}
                      className={cn(
                        "rounded-md bg-black/20 p-2.5",
                        item.risk_flag && "ring-1 ring-red-400"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-base font-medium text-white">
                          {item.risk_flag && (
                            <AlertTriangle className="mr-1 inline size-3.5 animate-pulse text-red-500" />
                          )}
                          {task?.title ?? `Tâche ${item.task_id.slice(0, 8)}`}
                        </p>
                        <span className="flex shrink-0 items-center gap-1 text-sm text-neutral-300">
                          <Clock className="size-3" />
                          {item.estimated_duration_minutes}min
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-300">
                        {item.next_action}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#1E293B] p-3 text-sm text-neutral-300 md:grid-cols-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-500" />
          Faire tout de suite
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-blue-500" />
          Planifier
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amber-500" />
          Déléguer
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-neutral-400" />
          Éliminer
        </div>
      </div>
    </div>
  );
}
