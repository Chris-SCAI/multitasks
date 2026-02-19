"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DomainBadge } from "@/components/domains/DomainBadge";
import { ConflictBadge } from "@/components/calendar/ConflictBadge";
import type { Task, TaskPriority, Domain } from "@/types";
import type { DayInfo, ConflictInfo } from "@/hooks/useCalendar";

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

interface CalendarWeekProps {
  days: DayInfo[];
  getTasksForDay: (date: string) => Task[];
  getDayLoad: (date: string) => number;
  getConflicts: (date: string) => ConflictInfo;
  updateTaskDeadline: (taskId: string, newDate: string) => Promise<void>;
  domains: Domain[];
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

function DraggableTask({
  task,
  domain,
}: {
  task: Task;
  domain?: Domain;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
              "cursor-grab rounded-md border border-[#1E293B] bg-[#151D2E] p-2 text-base shadow-sm transition-all duration-200 hover:bg-[#1C2640] hover:shadow-md hover:border-violet-500/30 hover:shadow-violet-500/5 active:cursor-grabbing",
              isDragging && "opacity-30"
            )}
          >
            <p className="truncate font-medium leading-tight text-white">{task.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <Badge
                variant="secondary"
                className={cn("text-xs px-1.5 py-0.5", PRIORITY_COLORS[task.priority])}
              >
                {PRIORITY_LABELS[task.priority]}
              </Badge>
              {domain && <DomainBadge domain={domain} size="sm" />}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="text-base font-medium">{task.title}</p>
            {task.description && (
              <p className="text-base opacity-80">{task.description}</p>
            )}
            {task.estimatedMinutes && (
              <p className="text-base opacity-80">
                Estimé : {formatMinutes(task.estimatedMinutes)}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function TaskCardOverlay({
  task,
  domain,
}: {
  task: Task;
  domain?: Domain;
}) {
  return (
    <div className="w-40 scale-105 cursor-grabbing rounded-md border border-[#1E293B] bg-[#151D2E] p-2 text-base shadow-xl shadow-violet-500/20 ring-2 ring-primary/30">
      <p className="truncate font-medium leading-tight text-white">{task.title}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        <Badge
          variant="secondary"
          className={cn("text-xs px-1.5 py-0.5", PRIORITY_COLORS[task.priority])}
        >
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        {domain && <DomainBadge domain={domain} size="sm" />}
      </div>
    </div>
  );
}

function DroppableDay({
  day,
  tasks,
  domains,
  dayLoad,
  conflict,
  isOver,
}: {
  day: DayInfo;
  tasks: Task[];
  domains: Domain[];
  dayLoad: number;
  conflict: ConflictInfo;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: day.date,
    data: { date: day.date },
  });

  return (
    <div ref={setNodeRef} className="relative">
      {day.isToday && (
        <div className="absolute -inset-1 rounded-xl bg-primary/5 blur-xl pointer-events-none" />
      )}
      <div
        className={cn(
          "relative flex min-h-[140px] flex-col rounded-lg border transition-all duration-200 sm:min-h-[200px]",
          day.isToday
            ? "border-primary bg-primary/15 shadow-md shadow-primary/10"
            : "border-[#1E293B] bg-[#151D2E] hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5",
          tasks.length === 0 &&
            !day.isToday &&
            "bg-[#0B1120]/50",
          isOver && "border-primary bg-primary/10 ring-2 ring-primary/20"
        )}
      >
      <div className="flex items-center justify-between border-b border-[#1E293B]/50 px-2 py-1.5">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-base",
              day.isToday
                ? "font-bold text-primary"
                : "font-medium text-neutral-300"
            )}
          >
            {day.dayName}
          </span>
          <span
            className={cn(
              "flex items-center justify-center rounded-full text-base",
              day.isToday
                ? "size-8 bg-primary font-bold text-white shadow-sm shadow-primary/50"
                : "size-7 font-medium text-white"
            )}
          >
            {day.dayNumber}
          </span>
        </div>
        <ConflictBadge conflict={conflict} size="sm" />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-1.5">
        {tasks.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-lg text-[#1E293B]">+</span>
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              domain={domains.find((d) => d.id === task.domainId)}
            />
          ))
        )}
      </div>

      {dayLoad > 0 && (
        <div className="border-t border-[#1E293B]/50 px-2 py-1">
          <span className={cn(
            "inline-flex items-center gap-1 text-sm font-medium bg-clip-text text-transparent",
            dayLoad > 480
              ? "bg-gradient-to-r from-red-400 to-red-500"
              : dayLoad > 240
                ? "bg-gradient-to-r from-amber-400 to-orange-400"
                : "bg-gradient-to-r from-emerald-400 to-green-400"
          )}>
            <Clock className={cn(
              "size-3",
              dayLoad > 480 ? "text-red-400" : dayLoad > 240 ? "text-amber-400" : "text-emerald-400"
            )} />
            {formatMinutes(dayLoad)}
          </span>
        </div>
      )}
      </div>
    </div>
  );
}

export function CalendarWeek({
  days,
  getTasksForDay,
  getDayLoad,
  getConflicts,
  updateTaskDeadline,
  domains,
}: CalendarWeekProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  }, []);

  const handleDragOver = useCallback(
    (event: { over: { id: string | number } | null }) => {
      setOverId(event.over ? String(event.over.id) : null);
    },
    []
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      setOverId(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = String(active.id);
      const newDate = String(over.id);
      const task = active.data.current?.task as Task | undefined;

      if (task && task.dueDate !== newDate) {
        await updateTaskDeadline(taskId, newDate);
      }
    },
    [updateTaskDeadline]
  );

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
    setOverId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="grid grid-cols-7 gap-1.5 overflow-x-auto sm:gap-2"
      >
        {days.map((day) => (
          <DroppableDay
            key={day.date}
            day={day}
            tasks={getTasksForDay(day.date)}
            domains={domains}
            dayLoad={getDayLoad(day.date)}
            conflict={getConflicts(day.date)}
            isOver={overId === day.date}
          />
        ))}
      </motion.div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <TaskCardOverlay
            task={activeTask}
            domain={domains.find((d) => d.id === activeTask.domainId)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
