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
    <div className="space-y-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="Rechercher une tâche..."
          value={filters.search ?? ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          Statut :
        </span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggleStatus(opt.value)}
          >
            <Badge
              variant={
                filters.status?.includes(opt.value) ? "default" : "outline"
              }
              className={cn(
                "cursor-pointer transition-colors",
                filters.status?.includes(opt.value) && "bg-primary text-primary-foreground"
              )}
            >
              {opt.label}
            </Badge>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          Priorité :
        </span>
        {PRIORITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => togglePriority(opt.value)}
          >
            <Badge
              variant={
                filters.priority?.includes(opt.value) ? "default" : "outline"
              }
              className={cn(
                "cursor-pointer transition-colors",
                filters.priority?.includes(opt.value) && "bg-primary text-primary-foreground"
              )}
            >
              {opt.label}
            </Badge>
          </button>
        ))}
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="size-3.5" />
          Effacer les filtres
        </Button>
      )}
    </div>
  );
}
