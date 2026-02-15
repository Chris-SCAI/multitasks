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
}

export function TaskFilters({
  filters,
  onFilterChange,
  onClear,
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
    <div className="rounded-2xl border border-[#1E293B] bg-[#0e1726] p-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <Input
          placeholder="Rechercher une tâche..."
          value={filters.search ?? ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="border-[#1E293B] bg-[#0B1120] pl-9 text-white placeholder:text-slate-500 focus-visible:ring-violet-500/50"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">
          Statut
        </span>
        {STATUS_OPTIONS.map((opt) => {
          const isActive = filters.status?.includes(opt.value);
          const activeColors: Record<TaskStatus, string> = {
            todo: "bg-slate-500/20 text-slate-300 border-slate-500/40",
            in_progress: "bg-blue-500/20 text-blue-300 border-blue-500/40",
            done: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          };
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleStatus(opt.value)}
            >
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all",
                  isActive
                    ? activeColors[opt.value]
                    : "border-[#1E293B] text-slate-400 hover:border-slate-500 hover:text-slate-300"
                )}
              >
                {opt.label}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500">
          Priorité
        </span>
        {PRIORITY_OPTIONS.map((opt) => {
          const isActive = filters.priority?.includes(opt.value);
          const activeColors: Record<TaskPriority, string> = {
            urgent: "bg-red-500/20 text-red-300 border-red-500/40",
            high: "bg-orange-500/20 text-orange-300 border-orange-500/40",
            medium: "bg-blue-500/20 text-blue-300 border-blue-500/40",
            low: "bg-slate-500/20 text-slate-300 border-slate-500/40",
          };
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => togglePriority(opt.value)}
            >
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all",
                  isActive
                    ? activeColors[opt.value]
                    : "border-[#1E293B] text-slate-400 hover:border-slate-500 hover:text-slate-300"
                )}
              >
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
