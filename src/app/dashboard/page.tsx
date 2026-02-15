"use client";

import { useMemo, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useDomains } from "@/hooks/useDomains";
import { Plus, ListTodo, CalendarClock, CheckCircle2 } from "lucide-react";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks/TaskFilters";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className={`flex size-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const {
    tasks,
    allTasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    filters,
    setFilters,
    clearFilters,
  } = useTasks();
  const { domains } = useDomains();
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.status === "done").length;
    const dueToday = allTasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= today && d < tomorrow;
    }).length;

    return { total, completed, dueToday };
  }, [allTasks]);

  return (
    <div className="space-y-6">
      {/* Compteurs statistiques */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={ListTodo} label="Total" value={stats.total} color="bg-violet-600" />
        <StatCard icon={CalendarClock} label="Aujourd'hui" value={stats.dueToday} color="bg-blue-600" />
        <StatCard icon={CheckCircle2} label="Terminées" value={stats.completed} color="bg-emerald-600" />
      </div>

      <TaskFilters
        filters={filters}
        onFilterChange={setFilters}
        onClear={clearFilters}
      />

      <TaskList
        tasks={tasks}
        domains={domains}
        isLoading={isLoading}
        onCreateTask={() => setShowForm(true)}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onReorder={reorderTasks}
      />

      <TaskForm
        mode="create"
        domains={domains}
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={async (input) => { await createTask(input); }}
      />

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 z-20 flex size-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 transition-transform hover:scale-105 hover:bg-violet-500 active:scale-95 md:bottom-6"
        aria-label="Ajouter une tâche"
      >
        <Plus className="size-6" />
      </button>
    </div>
  );
}
