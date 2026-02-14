"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DomainBadge } from "@/components/domains/DomainBadge";
import { ConflictBadge } from "@/components/calendar/ConflictBadge";
import type { Task, TaskPriority, Domain } from "@/types";
import type { DayInfo, ConflictInfo } from "@/hooks/useCalendar";

const WEEKDAY_HEADERS = ["L", "M", "M", "J", "V", "S", "D"];

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

interface CalendarMonthProps {
  days: DayInfo[];
  getTasksForDay: (date: string) => Task[];
  getDayLoad: (date: string) => number;
  getConflicts: (date: string) => ConflictInfo;
  domains: Domain[];
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

function LoadIndicator({ taskCount }: { taskCount: number }) {
  if (taskCount === 0) return null;

  if (taskCount <= 2) {
    return (
      <div className="flex gap-0.5">
        <span className="size-1.5 rounded-full bg-emerald-500" />
      </div>
    );
  }

  if (taskCount <= 4) {
    return (
      <div className="flex gap-0.5">
        <span className="size-1.5 rounded-full bg-orange-500" />
        <span className="size-1.5 rounded-full bg-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex gap-0.5">
      <span className="size-1.5 rounded-full bg-red-500" />
      <span className="size-1.5 rounded-full bg-red-500" />
      <span className="size-1.5 rounded-full bg-red-500" />
    </div>
  );
}

export function CalendarMonth({
  days,
  getTasksForDay,
  getDayLoad,
  getConflicts,
  domains,
}: CalendarMonthProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedTasks = selectedDate ? getTasksForDay(selectedDate) : [];
  const selectedDayLoad = selectedDate ? getDayLoad(selectedDate) : 0;

  const selectedDateFormatted = selectedDate
    ? (() => {
        const d = new Date(selectedDate + "T00:00:00");
        return d.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      })()
    : "";

  return (
    <>
      <div className="overflow-x-auto">
        <div className="grid min-w-[320px] grid-cols-7 gap-px rounded-lg border border-[#1E293B] bg-[#1E293B]">
          {WEEKDAY_HEADERS.map((header, i) => (
            <div
              key={i}
              className="bg-[#0B1120] py-2 text-center text-sm font-medium text-neutral-400"
            >
              {header}
            </div>
          ))}

          {days.map((day) => {
            const taskCount = getTasksForDay(day.date).length;
            const conflict = getConflicts(day.date);

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                className={cn(
                  "flex min-h-[52px] flex-col items-center gap-1 bg-[#151D2E] p-1.5 transition-colors hover:bg-[#1C2640] sm:min-h-[72px] sm:items-start sm:p-2",
                  !day.isCurrentMonth && "opacity-40",
                  day.isToday && "ring-2 ring-inset ring-primary"
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-sm",
                    day.isToday
                      ? "bg-primary font-bold text-white"
                      : "font-medium text-neutral-300"
                  )}
                >
                  {day.dayNumber}
                </span>
                <div className="flex items-center gap-1">
                  <LoadIndicator taskCount={taskCount} />
                  {conflict.hasConflict && (
                    <ConflictBadge conflict={conflict} size="sm" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog
        open={selectedDate !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDate(null);
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto border-[#1E293B] bg-[#151D2E] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="capitalize text-white">
              {selectedDateFormatted}
            </DialogTitle>
            <DialogDescription>
              {selectedTasks.length === 0
                ? "Aucune tâche ce jour"
                : `${selectedTasks.length} tâche${selectedTasks.length > 1 ? "s" : ""} — ${formatMinutes(selectedDayLoad)} estimées`}
            </DialogDescription>
          </DialogHeader>

          {selectedTasks.length > 0 && (
            <div className="space-y-2">
              {selectedTasks.map((task) => {
                const domain = domains.find((d) => d.id === task.domainId);
                return (
                  <div
                    key={task.id}
                    className="rounded-lg border border-[#1E293B] bg-[#151D2E] p-3 shadow-sm"
                  >
                    <p className="text-base font-medium text-white">{task.title}</p>
                    {task.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-300">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          PRIORITY_COLORS[task.priority]
                        )}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </Badge>
                      {domain && <DomainBadge domain={domain} size="sm" />}
                      {task.estimatedMinutes && (
                        <span className="text-xs text-neutral-300">
                          {formatMinutes(task.estimatedMinutes)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
