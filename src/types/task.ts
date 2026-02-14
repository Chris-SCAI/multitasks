export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  domainId: string | null;
  tags: string[];
  dueDate: string | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  domainId: string | null;
  tags?: string[];
  dueDate?: string | null;
  estimatedMinutes?: number | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  domainId?: string;
  tags?: string[];
  dueDate?: string | null;
  estimatedMinutes?: number | null;
  actualMinutes?: number | null;
  order?: number;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  domainId?: string;
  search?: string;
  tags?: string[];
}

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminée",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};
