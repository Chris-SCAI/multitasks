export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  domainId: string | null;
  tags: string[];
  dueDate: string | null; // "YYYY-MM-DDTHH:mm" ou "YYYY-MM-DD" (legacy)
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  recurrenceRule: RecurrenceRule | null;
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
  recurrenceRule?: RecurrenceRule | null;
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
  recurrenceRule?: RecurrenceRule | null;
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

export const RECURRENCE_LABELS: Record<RecurrenceFrequency, string> = {
  daily: "Tous les jours",
  weekly: "Toutes les semaines",
  monthly: "Tous les mois",
  yearly: "Tous les ans",
};

/**
 * Extrait la partie date (YYYY-MM-DD) d'un dueDate
 * Compatible avec les formats "YYYY-MM-DD" et "YYYY-MM-DDTHH:mm"
 */
export function getDatePart(dueDate: string): string {
  return dueDate.substring(0, 10);
}

/**
 * Calcule la prochaine date d'échéance pour une tâche récurrente
 */
export function getNextDueDate(
  currentDueDate: string,
  frequency: RecurrenceFrequency,
): string {
  const hasTime = currentDueDate.length > 10;
  const datePart = currentDueDate.substring(0, 10);
  const timePart = hasTime ? currentDueDate.substring(10) : "";

  const d = new Date(datePart);

  switch (frequency) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}${timePart}`;
}
