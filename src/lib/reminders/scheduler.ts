export interface Reminder {
  id: string;
  taskId: string;
  taskTitle: string;
  scheduledAt: string; // ISO datetime
  triggered: boolean;
  createdAt: string;
}

export interface ReminderConfig {
  maxPerDay: number; // free=1, ia_quotidienne=5, pro=Infinity
}

/**
 * Calcule le moment de rappel pour une tache.
 *
 * Regles :
 * 1. dueDate + estimatedMinutes => deadline - duree - 30min
 * 2. dueDate seul => deadline - 24h
 * 3. Sinon => null (pas de rappel automatique)
 *
 * dueDate est au format "YYYY-MM-DD" ou "YYYY-MM-DDTHH:mm".
 * Si l'heure est précisée, la deadline est à cette heure. Sinon, 23:59.
 */
export function calculateReminderTime(
  dueDate: string | null,
  estimatedMinutes: number | null,
): string | null {
  if (!dueDate) return null;

  // Si dueDate contient l'heure (YYYY-MM-DDTHH:mm), l'utiliser directement
  // Sinon, utiliser 23:59 par défaut
  const hasTime = dueDate.length > 10;
  const deadlineStr = hasTime ? `${dueDate}:00` : `${dueDate}T23:59:00`;
  const deadline = new Date(deadlineStr);

  if (isNaN(deadline.getTime())) return null;

  if (estimatedMinutes !== null && estimatedMinutes > 0) {
    // Rappel = deadline - duree estimee - 30 min
    const offsetMs = (estimatedMinutes + 30) * 60 * 1000;
    const reminderTime = new Date(deadline.getTime() - offsetMs);
    return reminderTime.toISOString();
  }

  // dueDate seul => rappel = deadline - 24h
  const reminderTime = new Date(deadline.getTime() - 24 * 60 * 60 * 1000);
  return reminderTime.toISOString();
}

/**
 * Retourne les rappels dont scheduledAt <= now ET triggered === false
 */
export function getTriggeredReminders(reminders: Reminder[]): Reminder[] {
  const now = new Date();
  return reminders.filter(
    (r) => !r.triggered && new Date(r.scheduledAt) <= now,
  );
}

/**
 * Cree un rappel pour une tache
 */
export function createReminder(
  taskId: string,
  taskTitle: string,
  scheduledAt: string,
): Reminder {
  return {
    id: crypto.randomUUID(),
    taskId,
    taskTitle,
    scheduledAt,
    triggered: false,
    createdAt: new Date().toISOString(),
  };
}
