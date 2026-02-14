"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/stores/task-store";

export function useTasks() {
  const store = useTaskStore();

  useEffect(() => {
    store.loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tasks: store.filteredTasks(),
    allTasks: store.tasks,
    isLoading: store.isLoading,
    error: store.error,
    filters: store.filters,
    createTask: store.createTask,
    updateTask: store.updateTask,
    deleteTask: store.deleteTask,
    reorderTasks: store.reorderTasks,
    setFilters: store.setFilters,
    clearFilters: store.clearFilters,
  };
}
