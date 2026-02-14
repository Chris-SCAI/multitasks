import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "@/types/task";
import {
  type Reminder,
  calculateReminderTime,
  createReminder,
} from "@/lib/reminders/scheduler";

interface ReminderState {
  reminders: Reminder[];

  addReminder: (reminder: Reminder) => void;
  markTriggered: (id: string) => void;
  removeReminder: (id: string) => void;
  syncFromTasks: (tasks: Task[]) => void;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],

      addReminder: (reminder) => {
        const { reminders } = get();
        // Pas de doublon pour le meme taskId
        if (reminders.some((r) => r.taskId === reminder.taskId)) return;
        set({ reminders: [...reminders, reminder] });
      },

      markTriggered: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, triggered: true } : r,
          ),
        }));
      },

      removeReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },

      syncFromTasks: (tasks) => {
        const existing = get().reminders;
        const existingByTaskId = new Map(existing.map((r) => [r.taskId, r]));

        const newReminders: Reminder[] = [];

        for (const task of tasks) {
          // Ignorer les taches terminees
          if (task.status === "done") continue;

          const scheduledAt = calculateReminderTime(
            task.dueDate,
            task.estimatedMinutes,
          );

          if (!scheduledAt) continue;

          const existingReminder = existingByTaskId.get(task.id);

          if (existingReminder) {
            // Si le temps de rappel a change, on met a jour
            if (existingReminder.scheduledAt !== scheduledAt) {
              newReminders.push({
                ...existingReminder,
                scheduledAt,
                taskTitle: task.title,
                triggered: false,
              });
            } else {
              // Garder tel quel (y compris si deja triggered)
              newReminders.push({
                ...existingReminder,
                taskTitle: task.title,
              });
            }
          } else {
            newReminders.push(createReminder(task.id, task.title, scheduledAt));
          }
        }

        set({ reminders: newReminders });
      },
    }),
    {
      name: "multitasks-reminders",
    },
  ),
);
