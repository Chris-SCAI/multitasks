"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useDomains } from "@/hooks/useDomains";
import { Plus } from "lucide-react";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFilters } from "@/components/tasks/TaskFilters";

export default function TasksPage() {
  const {
    tasks,
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

  return (
    <div className="space-y-6">
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
