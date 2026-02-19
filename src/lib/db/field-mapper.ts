import type { Task, TaskPriority } from "@/types/task";
import type { Domain } from "@/types/domain";

// --- Types DB Supabase (snake_case, priorités FR) ---

export interface DbTask {
  id: string;
  user_id: string;
  domain_id: string | null;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  deadline: string | null;
  estimated_duration: number | null;
  priority: "haute" | "moyenne" | "basse" | "non_definie";
  recurrence_rule: { frequency: "daily" | "weekly" | "monthly" | "yearly" } | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface DbDomain {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

// --- Mapping priorités ---

const priorityClientToDb: Record<TaskPriority, DbTask["priority"]> = {
  urgent: "haute",
  high: "haute",
  medium: "moyenne",
  low: "basse",
};

const priorityDbToClient: Record<DbTask["priority"], TaskPriority> = {
  haute: "high",
  moyenne: "medium",
  basse: "low",
  non_definie: "low",
};

// --- Mappers tâches ---

interface ClientTask {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: TaskPriority;
  domainId: string | null;
  dueDate: string | null;
  estimatedMinutes: number | null;
  recurrenceRule: { frequency: "daily" | "weekly" | "monthly" | "yearly" } | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export function mapTaskToDb(task: ClientTask, userId: string): DbTask {
  return {
    id: task.id,
    user_id: userId,
    domain_id: task.domainId,
    title: task.title,
    description: task.description,
    status: task.status,
    deadline: task.dueDate,
    estimated_duration: task.estimatedMinutes,
    priority: priorityClientToDb[task.priority],
    recurrence_rule: task.recurrenceRule,
    sort_order: task.order,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    completed_at: task.completedAt,
  };
}

export function mapTaskFromDb(row: DbTask): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: priorityDbToClient[row.priority],
    domainId: row.domain_id,
    tags: [],
    dueDate: row.deadline,
    estimatedMinutes: row.estimated_duration,
    actualMinutes: null,
    recurrenceRule: row.recurrence_rule ?? null,
    order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}

// --- Mappers domaines ---

interface ClientDomain {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  isDefault: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function mapDomainToDb(domain: ClientDomain, userId: string): DbDomain {
  return {
    id: domain.id,
    user_id: userId,
    name: domain.name,
    color: domain.color,
    icon: domain.icon,
    sort_order: domain.order,
    is_archived: false,
    created_at: domain.createdAt,
    updated_at: domain.updatedAt,
  };
}

export function mapDomainFromDb(row: DbDomain): Domain {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    icon: row.icon,
    description: "",
    isDefault: false,
    order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
