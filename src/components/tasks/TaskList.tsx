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
    <div className="relative flex flex-col items-center justify-center py-20">
      {/* Gradient glow décoratifs */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-80 w-80 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="absolute -left-20 top-10 h-40 w-40 rounded-full bg-blue-600/10 blur-[80px]" />
        <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-purple-600/10 blur-[80px]" />
      </div>

      {/* Illustration SVG large et détaillée */}
      <div className="relative mb-10">
        <svg
          width="200"
          height="180"
          viewBox="0 0 200 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Carte principale — checklist */}
          <rect x="40" y="20" width="120" height="140" rx="16" fill="#151D2E" stroke="#1E293B" strokeWidth="1.5" />
          {/* Barre de titre */}
          <rect x="40" y="20" width="120" height="36" rx="16" fill="#1C2640" />
          <rect x="40" y="40" width="120" height="16" fill="#1C2640" />
          <circle cx="56" cy="38" r="4" fill="#EF4444" opacity="0.8" />
          <circle cx="68" cy="38" r="4" fill="#F59E0B" opacity="0.8" />
          <circle cx="80" cy="38" r="4" fill="#10B981" opacity="0.8" />

          {/* Ligne 1 — complétée */}
          <rect x="58" y="70" width="16" height="16" rx="4" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="1.5" />
          <path d="M62 78 L66 82 L74 72" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="82" y="74" width="60" height="8" rx="4" fill="#334155" />

          {/* Ligne 2 — en cours */}
          <rect x="58" y="96" width="16" height="16" rx="4" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="82" y="100" width="50" height="8" rx="4" fill="#334155" />

          {/* Ligne 3 — vide */}
          <rect x="58" y="122" width="16" height="16" rx="4" fill="transparent" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="82" y="126" width="40" height="8" rx="4" fill="#1E293B" />

          {/* Carte flottante — badge IA */}
          <g filter="url(#shadow1)">
            <rect x="130" y="6" width="60" height="28" rx="14" fill="url(#aiGradient)" />
            <text x="147" y="24" fill="white" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">✨ IA</text>
          </g>

          {/* Carte flottante — priorité */}
          <g filter="url(#shadow2)">
            <rect x="4" y="90" width="44" height="44" rx="12" fill="#151D2E" stroke="#1E293B" strokeWidth="1" />
            <text x="14" y="110" fill="#F59E0B" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">P1</text>
            <rect x="12" y="118" width="28" height="4" rx="2" fill="#334155" />
          </g>

          {/* Étoiles flottantes */}
          <circle cx="18" cy="30" r="3" fill="#7C3AED" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="185" cy="55" r="2.5" fill="#A78BFA" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="175" cy="150" r="2" fill="#2563EB" opacity="0.5">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="160" r="2.5" fill="#10B981" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.5s" repeatCount="indefinite" />
          </circle>

          {/* Gradients et ombres */}
          <defs>
            <linearGradient id="aiGradient" x1="130" y1="6" x2="190" y2="34">
              <stop stopColor="#7C3AED" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
            <filter id="shadow1" x="122" y="0" width="76" height="44" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.3" />
            </filter>
            <filter id="shadow2" x="-4" y="82" width="60" height="60" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
        </svg>
      </div>

      <h3 className="relative mb-3 text-2xl font-extrabold tracking-tight text-white">
        Prêt à conquérir votre journée ?
      </h3>
      <p className="relative mb-10 max-w-md text-center text-sm leading-relaxed text-slate-400">
        Ajoutez vos premières tâches et laissez l&apos;IA les prioriser
        <br className="hidden sm:block" />
        avec la matrice d&apos;Eisenhower — en 10 secondes.
      </p>
      <button
        onClick={onCreateTask}
        className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-violet-600/25 transition-all duration-200 hover:scale-[1.04] hover:shadow-2xl hover:shadow-violet-600/30 active:scale-95"
      >
        <Plus className="size-5 transition-transform duration-200 group-hover:rotate-90" />
        Ajouter ma première tâche
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
