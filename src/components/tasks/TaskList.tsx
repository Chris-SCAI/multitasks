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
          className="bg-card animate-pulse rounded-lg border p-4"
        >
          <div className="flex items-start gap-3">
            <div className="bg-muted mt-0.5 size-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 w-3/4 rounded" />
              <div className="flex gap-2">
                <div className="bg-muted h-5 w-16 rounded-full" />
                <div className="bg-muted h-5 w-20 rounded-full" />
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
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
        <ClipboardList className="text-muted-foreground size-8" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">Aucune tâche</h3>
      <p className="text-muted-foreground mb-6 text-sm">
        Commencez par ajouter votre première tâche
      </p>
      <Button onClick={onCreateTask}>
        <Plus className="size-4" />
        Ajouter une tâche
      </Button>
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
