export interface TaskAnalysis {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  tasksByDomain: Record<string, number>;
  averageCompletionMinutes: number | null;
  overdueTasks: number;
}

export interface DomainAnalysis {
  domainId: string;
  domainName: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}
