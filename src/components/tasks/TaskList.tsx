"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DomainBadge } from "@/components/domains/DomainBadge";
import { TaskCard } from "@/components/tasks/TaskCard";
import type { Task, UpdateTaskInput, Domain } from "@/types";

interface TaskListProps {
  tasks: Task[];
  domains: Domain[];
  isLoading: boolean;
  onCreateTask: () => void;
  onUpdateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onReorder: (taskIds: string[]) => Promise<void>;
}

function SortableTaskCard({
  task,
  domain,
  onUpdate,
  onDelete,
}: {
  task: Task;
  domain?: Domain;
  onUpdate: (id: string, input: UpdateTaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : 0,
    scale: isDragging ? "1.02" : "1",
    boxShadow: isDragging ? "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)" : "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        domain={domain}
      />
    </div>
  );
}

function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 size-5 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="h-5 w-20 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreateTask }: { onCreateTask: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-16">
      {/* Gradient glow décoratif */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Illustration SVG inline */}
      <div className="relative mb-6">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Fond carte */}
          <rect x="20" y="15" width="80" height="90" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          {/* Lignes checklist */}
          <rect x="36" y="35" width="12" height="12" rx="3" stroke="#7C3AED" strokeWidth="2" fill="none" />
          <line x1="54" y1="41" x2="82" y2="41" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <rect x="36" y="55" width="12" height="12" rx="3" stroke="#7C3AED" strokeWidth="2" fill="none" />
          <line x1="54" y1="61" x2="76" y2="61" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <rect x="36" y="75" width="12" height="12" rx="3" stroke="#7C3AED" strokeWidth="2" fill="none" />
          <line x1="54" y1="81" x2="70" y2="81" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          {/* Étoiles décoratives */}
          <circle cx="95" cy="20" r="3" fill="#7C3AED" opacity="0.8" />
          <circle cx="15" cy="45" r="2" fill="#A78BFA" opacity="0.6" />
          <circle cx="105" cy="70" r="2.5" fill="#A78BFA" opacity="0.7" />
          {/* Check animé sur première ligne */}
          <path d="M39 41 L43 45 L48 37" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="relative mb-2 text-xl font-bold text-white">
        Prêt à conquérir votre journée ?
      </h3>
      <p className="relative mb-8 max-w-sm text-center text-sm text-slate-400">
        Ajoutez vos premières tâches et laissez l&apos;IA vous aider à prioriser ce qui compte vraiment.
      </p>
      <button
        onClick={onCreateTask}
        className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-600/30 active:scale-95"
      >
        <Plus className="size-5" />
        Ajouter une tâche
      </button>
    </div>
  );
}

export function TaskList({
  tasks,
  domains,
  isLoading,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onReorder,
}: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const domainMap = useMemo(() => {
    const map = new Map<string, Domain>();
    domains.forEach((d) => map.set(d.id, d));
    return map;
  }, [domains]);

  const groupedTasks = useMemo(() => {
    const groups = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const key = task.domainId ?? "__no_domain__";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(task);
    });
    return groups;
  }, [tasks]);

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (tasks.length === 0) {
    return <EmptyState onCreateTask={onCreateTask} />;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const allIds = tasks.map((t) => t.id);
    const oldIndex = allIds.indexOf(String(active.id));
    const newIndex = allIds.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newIds = [...allIds];
    newIds.splice(oldIndex, 1);
    newIds.splice(newIndex, 0, String(active.id));

    onReorder(newIds);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {Array.from(groupedTasks.entries()).map(([domainId, domainTasks]) => {
          const domain = domainMap.get(domainId);
          return (
            <div key={domainId} className="space-y-2">
              {domain && (
                <div className="mb-2">
                  <DomainBadge domain={domain} size="md" />
                </div>
              )}

              <SortableContext
                items={domainTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {domainTasks.map((task) => (
                    <motion.div key={task.id} layout>
                      <SortableTaskCard
                        task={task}
                        domain={domain}
                        onUpdate={onUpdateTask}
                        onDelete={onDeleteTask}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
