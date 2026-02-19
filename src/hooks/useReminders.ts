"use client";

import { useEffect, useCallback, useRef } from "react";
import { useReminderStore } from "@/stores/reminder-store";
import { useTaskStore } from "@/stores/task-store";
import { useUIStore } from "@/stores/ui-store";
import { getTriggeredReminders } from "@/lib/reminders/scheduler";
import {
  requestNotificationPermission,
  sendReminderNotification,
} from "@/lib/reminders/notification";

const CHECK_INTERVAL_MS = 60_000; // 60 secondes

export function useReminders() {
  const reminders = useReminderStore((s) => s.reminders);
  const markTriggered = useReminderStore((s) => s.markTriggered);
  const syncFromTasks = useReminderStore((s) => s.syncFromTasks);
  const tasks = useTaskStore((s) => s.tasks);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pendingCount = reminders.filter(
    (r) => !r.triggered && new Date(r.scheduledAt) > new Date(),
  ).length;

  // Demande la permission au montage
  const requestPermission = useCallback(async () => {
    return requestNotificationPermission();
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Synchro des rappels quand les taches changent
  useEffect(() => {
    if (tasks.length > 0) {
      syncFromTasks(tasks);
    }
  }, [tasks, syncFromTasks]);

  // Verification periodique des rappels a declencher
  useEffect(() => {
    const checkReminders = () => {
      const triggered = getTriggeredReminders(reminders);
      const sound = useUIStore.getState().notificationSound;
      for (const reminder of triggered) {
        sendReminderNotification(reminder.taskTitle, reminder.scheduledAt, sound);
        markTriggered(reminder.id);
      }
    };

    // Verifier immediatement
    checkReminders();

    // Puis toutes les 60 secondes
    intervalRef.current = setInterval(checkReminders, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reminders, markTriggered]);

  return {
    reminders,
    pendingCount,
    requestPermission,
  };
}
