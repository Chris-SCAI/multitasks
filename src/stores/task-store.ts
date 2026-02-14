import { create } from "zustand";
import { db } from "@/lib/db/local";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
} from "@/types";

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTasks: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (taskIds: string[]) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;

  // Computed
  filteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filters: {},
  isLoading: false,
  error: null,

  loadTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const dbTasks = await db.tasks.orderBy("order").toArray();
      const tasks: Task[] = dbTasks.map((t) => ({
        ...t,
        id: t.id!,
      }));
      set({ tasks, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  createTask: async (input) => {
    const now = new Date().toISOString();
    const maxOrder = get().tasks.reduce(
      (max, t) => Math.max(max, t.order),
      -1
    );
    const id = crypto.randomUUID();
    const newTask = {
      id,
      title: input.title,
      description: input.description ?? "",
      status: input.status ?? ("todo" as const),
      priority: input.priority ?? ("medium" as const),
      domainId: input.domainId,
      tags: input.tags ?? [],
      dueDate: input.dueDate ?? null,
      estimatedMinutes: input.estimatedMinutes ?? null,
      actualMinutes: null,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };
    await db.tasks.add(newTask);
    const task: Task = { ...newTask, id };
    set((state) => ({ tasks: [...state.tasks, task] }));
    return task;
  },

  updateTask: async (id, input) => {
    const now = new Date().toISOString();
    const updates = {
      ...input,
      updatedAt: now,
      ...(input.status === "done" ? { completedAt: now } : {}),
    };
    await db.tasks.update(id, updates);
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  },

  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  reorderTasks: async (taskIds) => {
    const updates = taskIds.map((id, index) => ({
      key: id,
      changes: { order: index, updatedAt: new Date().toISOString() },
    }));
    await Promise.all(
      updates.map(({ key, changes }) => db.tasks.update(key, changes))
    );
    set((state) => ({
      tasks: state.tasks.map((t) => {
        const idx = taskIds.indexOf(t.id);
        return idx >= 0 ? { ...t, order: idx } : t;
      }),
    }));
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  filteredTasks: () => {
    const { tasks, filters } = get();
    let result = [...tasks];

    if (filters.status && filters.status.length > 0) {
      result = result.filter((t) => filters.status!.includes(t.status));
    }
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter((t) => filters.priority!.includes(t.priority));
    }
    if (filters.domainId) {
      result = result.filter((t) => t.domainId === filters.domainId);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((t) =>
        filters.tags!.some((tag) => t.tags.includes(tag))
      );
    }

    return result.sort((a, b) => a.order - b.order);
  },
}));
