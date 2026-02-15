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
    <div className="relative flex flex-col items-center justify-center py-16 md:py-24">
      {/* Gradient glow décoratifs renforcés */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-purple-600/15 blur-[100px]" />
      </div>

      {/* Illustration SVG large et détaillée */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="relative mb-10"
      >
        <svg
          width="280"
          height="250"
          viewBox="0 0 280 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Carte principale — checklist */}
          <rect x="60" y="30" width="160" height="190" rx="16" fill="#151D2E" stroke="#1E293B" strokeWidth="1.5" />
          {/* Barre de titre */}
          <rect x="60" y="30" width="160" height="36" rx="16" fill="#1C2640" />
          <rect x="60" y="50" width="160" height="16" fill="#1C2640" />
          <circle cx="78" cy="48" r="4" fill="#EF4444" opacity="0.8" />
          <circle cx="92" cy="48" r="4" fill="#F59E0B" opacity="0.8" />
          <circle cx="106" cy="48" r="4" fill="#10B981" opacity="0.8" />

          {/* Ligne 1 — complétée */}
          <rect x="78" y="82" width="16" height="16" rx="4" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="1.5" />
          <path d="M82 90 L86 94 L94 84" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="102" y="86" width="80" height="8" rx="4" fill="#334155" />

          {/* Barre de progression gradient */}
          <rect x="102" y="98" width="80" height="3" rx="1.5" fill="#1E293B" />
          <rect x="102" y="98" width="56" height="3" rx="1.5" fill="url(#progressGradient)" />

          {/* Ligne 2 — en cours */}
          <rect x="78" y="114" width="16" height="16" rx="4" fill="#7C3AED" opacity="0.2" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="102" y="118" width="65" height="8" rx="4" fill="#334155" />

          {/* Ligne 3 — vide */}
          <rect x="78" y="146" width="16" height="16" rx="4" fill="transparent" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="102" y="150" width="50" height="8" rx="4" fill="#1E293B" />

          {/* Ligne 4 — vide */}
          <rect x="78" y="178" width="16" height="16" rx="4" fill="transparent" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="102" y="182" width="40" height="8" rx="4" fill="#1E293B" />

          {/* Carte flottante — badge IA */}
          <g filter="url(#shadow1)" className="animate-float">
            <rect x="180" y="10" width="70" height="30" rx="15" fill="url(#aiGradient)" />
            <text x="198" y="30" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">✨ IA</text>
          </g>

          {/* Carte flottante — priorité */}
          <g filter="url(#shadow2)" className="animate-float-delayed">
            <rect x="6" y="100" width="44" height="48" rx="12" fill="#151D2E" stroke="#1E293B" strokeWidth="1" />
            <text x="16" y="122" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">P1</text>
            <rect x="14" y="130" width="28" height="4" rx="2" fill="#334155" />
          </g>

          {/* Mini calendrier flottant */}
          <g filter="url(#shadow3)" className="animate-float">
            <rect x="230" y="140" width="40" height="44" rx="10" fill="#151D2E" stroke="#1E293B" strokeWidth="1" />
            <rect x="230" y="140" width="40" height="14" rx="10" fill="#7C3AED" opacity="0.3" />
            <rect x="230" y="148" width="40" height="6" fill="#7C3AED" opacity="0.3" />
            <text x="242" y="150" fill="#A78BFA" fontSize="7" fontWeight="600" fontFamily="Inter, sans-serif">MAR</text>
            <text x="243" y="175" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">15</text>
          </g>

          {/* Étoiles flottantes */}
          <circle cx="20" cy="40" r="3" fill="#7C3AED" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="260" cy="70" r="2.5" fill="#A78BFA" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="250" cy="210" r="2" fill="#2563EB" opacity="0.5">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="220" r="2.5" fill="#10B981" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="240" r="2" fill="#7C3AED" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.2s" repeatCount="indefinite" />
          </circle>

          {/* Gradients et ombres */}
          <defs>
            <linearGradient id="aiGradient" x1="180" y1="10" x2="250" y2="40">
              <stop stopColor="#7C3AED" />
              <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="progressGradient" x1="102" y1="98" x2="158" y2="98">
              <stop stopColor="#7C3AED" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
            <filter id="shadow1" x="170" y="2" width="90" height="50" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.3" />
            </filter>
            <filter id="shadow2" x="-4" y="92" width="62" height="66" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
            </filter>
            <filter id="shadow3" x="222" y="132" width="56" height="62" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.2" />
            </filter>
          </defs>
        </svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="relative mb-3 text-2xl font-extrabold tracking-tight text-white"
      >
        Prêt à conquérir votre journée ?
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45, ease: "easeOut" }}
        className="relative mb-10 max-w-md text-center text-sm leading-relaxed text-slate-400"
      >
        Ajoutez vos premières tâches et laissez l&apos;IA les prioriser{" "}
        <br className="hidden sm:block" />
        avec la matrice d&apos;Eisenhower — en 10 secondes.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateTask}
        className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-violet-600/25"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <Plus className="relative size-5 transition-transform duration-200 group-hover:rotate-90" />
        <span className="relative">Ajouter ma première tâche</span>
      </motion.button>
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
