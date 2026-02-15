"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TaskFilters as TaskFiltersType, TaskStatus, TaskPriority } from "@/types";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminée" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "urgent", label: "Urgente" },
  { value: "high", label: "Haute" },
  { value: "medium", label: "Moyenne" },
  { value: "low", label: "Basse" },
];

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: Partial<TaskFiltersType>) => void;
  onClear: () => void;
  taskCount?: number;
}

export function TaskFilters({
  filters,
  onFilterChange,
  onClear,
  taskCount,
}: TaskFiltersProps) {
  const hasFilters =
    (filters.status && filters.status.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    !!filters.search;

  function toggleStatus(status: TaskStatus) {
    const current = filters.status ?? [];
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFilterChange({ status: next });
  }

  function togglePriority(priority: TaskPriority) {
    const current = filters.priority ?? [];
    const next = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onFilterChange({ priority: next });
  }

  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#151D2E] p-5 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
        <Input
          placeholder="Rechercher une tâche..."
          value={filters.search ?? ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="border-[#1E293B] bg-[#0B1120] pl-9 pr-20 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-violet-500/30"
        />
        {taskCount !== undefined && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            {taskCount} tâche{taskCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-500">
          Statut
        </span>
        {STATUS_OPTIONS.map((opt) => {
          const isActive = filters.status?.includes(opt.value);
          const activeColors: Record<TaskStatus, string> = {
            todo: "bg-slate-900/30 text-slate-400 border-slate-500/40",
            in_progress: "bg-blue-900/30 text-blue-400 border-blue-500/40",
            done: "bg-emerald-900/30 text-emerald-400 border-emerald-500/40",
          };
          const dotColors: Record<TaskStatus, string> = {
            todo: "bg-slate-400",
            in_progress: "bg-blue-400",
            done: "bg-emerald-400",
          };
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleStatus(opt.value)}
              className="active:scale-95 transition-transform"
            >
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-all inline-flex items-center gap-1.5",
                  isActive
                    ? activeColors[opt.value]
                    : "border-[#1E293B] text-slate-400 hover:border-slate-500 hover:text-slate-300"
                )}
              >
                <span className={cn("size-2 rounded-full", isActive ? dotColors[opt.value] : "bg-slate-600")} />
                {opt.label}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-500">
          Priorité
        </span>
        {PRIORITY_OPTIONS.map((opt) => {
          const isActive = filters.priority?.includes(opt.value);
          const activeColors: Record<TaskPriority, string> = {
            urgent: "bg-red-900/30 text-red-400 border-red-500/40",
            high: "bg-orange-900/30 text-orange-400 border-orange-500/40",
            medium: "bg-blue-900/30 text-blue-400 border-blue-500/40",
            low: "bg-slate-900/30 text-slate-400 border-slate-500/40",
          };
          const dotColors: Record<TaskPriority, string> = {
            urgent: "bg-red-400",
            high: "bg-orange-400",
            medium: "bg-blue-400",
            low: "bg-slate-400",
          };
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => togglePriority(opt.value)}
              className="active:scale-95 transition-transform"
            >
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-all inline-flex items-center gap-1.5",
                  isActive
                    ? activeColors[opt.value]
                    : "border-[#1E293B] text-slate-400 hover:border-slate-500 hover:text-slate-300"
                )}
              >
                <span className={cn("size-2 rounded-full", isActive ? dotColors[opt.value] : "bg-slate-600")} />
                {opt.label}
              </Badge>
            </button>
          );
        })}
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-slate-400 hover:text-white hover:bg-[#1C2640]">
          <X className="size-3.5" />
          Effacer les filtres
        </Button>
      )}
    </div>
  );
}
