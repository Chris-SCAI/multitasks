export interface DailyPlan {
  date: string;
  taskIds: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyGoal {
  weekStart: string;
  goals: string[];
  completedGoals: string[];
  createdAt: string;
  updatedAt: string;
}
