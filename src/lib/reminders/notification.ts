import {
  type NotificationSound,
  playNotificationSound,
} from "@/lib/reminders/sounds";

/**
 * Demande la permission de notification au navigateur
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

/**
 * Envoie une notification de rappel
 */
export function sendReminderNotification(
  taskTitle: string,
  scheduledAt: string,
  sound?: NotificationSound,
): void {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  )
    return;

  new Notification("Rappel Multitasks", {
    body: `"${taskTitle}" — échéance bientôt`,
    icon: "/favicon.ico",
    tag: `reminder-${scheduledAt}`, // evite les doublons
  });

  if (sound) {
    playNotificationSound(sound);
  }
}
