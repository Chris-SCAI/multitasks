"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Calendar, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeText } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DomainBadge } from "@/components/domains/DomainBadge";
import type { Task, UpdateTaskInput, Domain, TaskPriority } from "@/types";

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "bg-red-900/30 text-red-400",
  high: "bg-orange-900/30 text-orange-400",
  medium: "bg-blue-900/30 text-blue-400",
  low: "bg-neutral-800 text-neutral-400",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: "Urgente",
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, input: UpdateTaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  domain?: Domain;
}

export function TaskCard({ task, onUpdate, onDelete, domain }: TaskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isDone = task.status === "done";

  async function toggleComplete() {
    await onUpdate(task.id, {
      status: isDone ? "todo" : "done",
    });
  }

  async function handleDelete() {
    await onDelete(task.id);
    setShowDeleteConfirm(false);
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group flex items-start gap-4 rounded-xl border border-[#1E293B] bg-[#151D2E] p-5 shadow-sm transition-all hover:bg-[#1C2640] hover:shadow-md hover:border-violet-500/20",
        isDone && "opacity-60"
      )}
    >
      <div className="relative">
        <motion.button
          type="button"
          whileTap={{ scale: 1.2, rotate: 5 }}
          onClick={toggleComplete}
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isDone
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-[#1E293B] hover:border-violet-500"
          )}
        >
          {isDone && <Check className="size-3.5" />}
        </motion.button>
        {isDone && (
          <motion.div className="pointer-events-none absolute -top-1 -left-1" aria-hidden>
            {[...Array(4)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute size-1.5 rounded-full bg-emerald-400"
                initial={{ opacity: 1, scale: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: [0, (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 8)],
                  y: [0, -(8 + Math.random() * 12)],
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-lg font-semibold text-white leading-tight",
              isDone && "line-through"
            )}
          >
            {sanitizeText(task.title)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className={cn("text-sm", PRIORITY_COLORS[task.priority])}
          >
            {PRIORITY_LABELS[task.priority]}
          </Badge>

          {domain && <DomainBadge domain={domain} size="sm" />}

          {task.dueDate && (
            <span className="inline-flex items-center gap-1 text-sm text-neutral-300">
              <Calendar className="size-3.5" />
              {formatDate(task.dueDate)}
            </span>
          )}

          {task.estimatedMinutes && (
            <span className="inline-flex items-center gap-1 text-sm text-neutral-300">
              <Clock className="size-3.5" />
              {task.estimatedMinutes}min
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {showDeleteConfirm ? (
          <div className="flex items-center gap-1">
            <Button
              size="xs"
              variant="destructive"
              onClick={handleDelete}
            >
              Supprimer
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Non
            </Button>
          </div>
        ) : (
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
