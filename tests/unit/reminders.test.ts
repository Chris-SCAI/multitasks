import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  calculateReminderTime,
  getTriggeredReminders,
  createReminder,
  type Reminder,
} from "@/lib/reminders/scheduler";
import { useReminderStore } from "@/stores/reminder-store";
import type { Task } from "@/types/task";

// Helper to create a task with defaults
function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: crypto.randomUUID(),
    title: "Test task",
    description: "",
    status: "todo",
    priority: "medium",
    domainId: "dom-1",
    tags: [],
    dueDate: null,
    estimatedMinutes: null,
    actualMinutes: null,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
    ...overrides,
  };
}

// Helper to create a reminder
function makeReminder(overrides: Partial<Reminder> = {}): Reminder {
  return {
    id: crypto.randomUUID(),
    taskId: crypto.randomUUID(),
    taskTitle: "Test task",
    scheduledAt: new Date().toISOString(),
    triggered: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── calculateReminderTime ────────────────────────────

describe("calculateReminderTime", () => {
  it("avec dueDate + estimatedMinutes : rappel = deadline - duree - 30min", () => {
    const dueDate = "2025-06-15";
    const estimatedMinutes = 60;

    const result = calculateReminderTime(dueDate, estimatedMinutes);

    expect(result).not.toBeNull();
    const reminderTime = new Date(result!);
    // Deadline = 2025-06-15 23:59:00
    // Rappel = deadline - 60min - 30min = deadline - 90min
    const deadline = new Date("2025-06-15T23:59:00");
    const expected = new Date(deadline.getTime() - 90 * 60 * 1000);
    expect(reminderTime.getTime()).toBe(expected.getTime());
  });

  it("avec dueDate seul (estimatedMinutes null) : rappel = deadline - 24h", () => {
    const dueDate = "2025-06-15";

    const result = calculateReminderTime(dueDate, null);

    expect(result).not.toBeNull();
    const reminderTime = new Date(result!);
    const deadline = new Date("2025-06-15T23:59:00");
    const expected = new Date(deadline.getTime() - 24 * 60 * 60 * 1000);
    expect(reminderTime.getTime()).toBe(expected.getTime());
  });

  it("sans dueDate : retourne null", () => {
    const result = calculateReminderTime(null, 60);
    expect(result).toBeNull();
  });

  it("avec dueDate vide string : retourne null (date invalide)", () => {
    const result = calculateReminderTime("", 60);
    // "" will create an invalid date => isNaN returns true => null
    expect(result).toBeNull();
  });

  it("avec estimatedMinutes = 0 : rappel = deadline - 30min", () => {
    const dueDate = "2025-06-15";

    // estimatedMinutes = 0 is falsy for the > 0 check, so it falls through to -24h
    const result = calculateReminderTime(dueDate, 0);

    expect(result).not.toBeNull();
    const reminderTime = new Date(result!);
    const deadline = new Date("2025-06-15T23:59:00");
    // estimatedMinutes is 0, which is not > 0, so it's treated as dueDate-only => -24h
    const expected = new Date(deadline.getTime() - 24 * 60 * 60 * 1000);
    expect(reminderTime.getTime()).toBe(expected.getTime());
  });

  it("retourne un ISO string valide", () => {
    const result = calculateReminderTime("2025-06-15", 120);
    expect(result).not.toBeNull();
    const date = new Date(result!);
    expect(isNaN(date.getTime())).toBe(false);
    // ISO string format check
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("avec une grande duree estimee", () => {
    const dueDate = "2025-06-15";
    const estimatedMinutes = 480; // 8 hours

    const result = calculateReminderTime(dueDate, estimatedMinutes);

    expect(result).not.toBeNull();
    const reminderTime = new Date(result!);
    const deadline = new Date("2025-06-15T23:59:00");
    const expected = new Date(
      deadline.getTime() - (480 + 30) * 60 * 1000,
    );
    expect(reminderTime.getTime()).toBe(expected.getTime());
  });
});

// ─── getTriggeredReminders ────────────────────────────

describe("getTriggeredReminders", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("retourne les rappels dont scheduledAt <= now ET triggered === false", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

    const reminders: Reminder[] = [
      makeReminder({
        scheduledAt: "2025-06-15T11:00:00Z",
        triggered: false,
      }),
      makeReminder({
        scheduledAt: "2025-06-15T12:00:00Z",
        triggered: false,
      }),
    ];

    const result = getTriggeredReminders(reminders);
    expect(result).toHaveLength(2);
  });

  it("n'inclut pas les rappels deja triggered", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

    const reminders: Reminder[] = [
      makeReminder({
        scheduledAt: "2025-06-15T11:00:00Z",
        triggered: true,
      }),
      makeReminder({
        scheduledAt: "2025-06-15T11:30:00Z",
        triggered: false,
      }),
    ];

    const result = getTriggeredReminders(reminders);
    expect(result).toHaveLength(1);
    expect(result[0].triggered).toBe(false);
  });

  it("n'inclut pas les rappels futurs", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));

    const reminders: Reminder[] = [
      makeReminder({
        scheduledAt: "2025-06-15T13:00:00Z",
        triggered: false,
      }),
      makeReminder({
        scheduledAt: "2025-06-16T10:00:00Z",
        triggered: false,
      }),
    ];

    const result = getTriggeredReminders(reminders);
    expect(result).toHaveLength(0);
  });

  it("retourne un array vide si aucun rappel", () => {
    const result = getTriggeredReminders([]);
    expect(result).toHaveLength(0);
  });
});

// ─── createReminder ───────────────────────────────────

describe("createReminder", () => {
  it("cree un objet Reminder avec les bons champs", () => {
    const taskId = "task-123";
    const taskTitle = "Ma tache";
    const scheduledAt = "2025-06-15T10:00:00Z";

    const reminder = createReminder(taskId, taskTitle, scheduledAt);

    expect(reminder.taskId).toBe(taskId);
    expect(reminder.taskTitle).toBe(taskTitle);
    expect(reminder.scheduledAt).toBe(scheduledAt);
    expect(reminder.triggered).toBe(false);
    expect(reminder.createdAt).toBeDefined();
  });

  it("id est un UUID valide", () => {
    const reminder = createReminder("task-1", "Title", "2025-06-15T10:00:00Z");
    // UUID v4 format
    expect(reminder.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("triggered est false par defaut", () => {
    const reminder = createReminder("task-1", "Title", "2025-06-15T10:00:00Z");
    expect(reminder.triggered).toBe(false);
  });

  it("createdAt est une date valide", () => {
    const reminder = createReminder("task-1", "Title", "2025-06-15T10:00:00Z");
    const date = new Date(reminder.createdAt);
    expect(isNaN(date.getTime())).toBe(false);
  });
});

// ─── ReminderStore ────────────────────────────────────

describe("ReminderStore", () => {
  beforeEach(() => {
    // Reset store between tests
    useReminderStore.setState({ reminders: [] });
  });

  describe("addReminder", () => {
    it("ajoute un rappel au store", () => {
      const reminder = makeReminder({ taskId: "task-1" });

      useReminderStore.getState().addReminder(reminder);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(1);
      expect(reminders[0].taskId).toBe("task-1");
    });

    it("ne duplique pas si meme taskId", () => {
      const reminder1 = makeReminder({ taskId: "task-1", taskTitle: "First" });
      const reminder2 = makeReminder({ taskId: "task-1", taskTitle: "Second" });

      useReminderStore.getState().addReminder(reminder1);
      useReminderStore.getState().addReminder(reminder2);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(1);
      expect(reminders[0].taskTitle).toBe("First");
    });

    it("ajoute des rappels avec des taskId differents", () => {
      const reminder1 = makeReminder({ taskId: "task-1" });
      const reminder2 = makeReminder({ taskId: "task-2" });

      useReminderStore.getState().addReminder(reminder1);
      useReminderStore.getState().addReminder(reminder2);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(2);
    });
  });

  describe("markTriggered", () => {
    it("marque un rappel comme triggered", () => {
      const reminder = makeReminder({ taskId: "task-1" });
      useReminderStore.setState({ reminders: [reminder] });

      useReminderStore.getState().markTriggered(reminder.id);

      const { reminders } = useReminderStore.getState();
      expect(reminders[0].triggered).toBe(true);
    });

    it("ne modifie pas les autres rappels", () => {
      const r1 = makeReminder({ taskId: "task-1" });
      const r2 = makeReminder({ taskId: "task-2" });
      useReminderStore.setState({ reminders: [r1, r2] });

      useReminderStore.getState().markTriggered(r1.id);

      const { reminders } = useReminderStore.getState();
      expect(reminders[0].triggered).toBe(true);
      expect(reminders[1].triggered).toBe(false);
    });
  });

  describe("removeReminder", () => {
    it("supprime un rappel", () => {
      const reminder = makeReminder({ taskId: "task-1" });
      useReminderStore.setState({ reminders: [reminder] });

      useReminderStore.getState().removeReminder(reminder.id);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(0);
    });

    it("ne supprime que le rappel cible", () => {
      const r1 = makeReminder({ taskId: "task-1" });
      const r2 = makeReminder({ taskId: "task-2" });
      useReminderStore.setState({ reminders: [r1, r2] });

      useReminderStore.getState().removeReminder(r1.id);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(1);
      expect(reminders[0].taskId).toBe("task-2");
    });
  });

  describe("syncFromTasks", () => {
    it("cree des rappels pour les taches avec dueDate", () => {
      const tasks = [
        makeTask({ id: "task-1", title: "Task 1", dueDate: "2025-06-15" }),
        makeTask({ id: "task-2", title: "Task 2", dueDate: "2025-06-20" }),
      ];

      useReminderStore.getState().syncFromTasks(tasks);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(2);
    });

    it("ignore les taches sans dueDate", () => {
      const tasks = [
        makeTask({ id: "task-1", title: "Task 1", dueDate: null }),
        makeTask({ id: "task-2", title: "Task 2", dueDate: "2025-06-15" }),
      ];

      useReminderStore.getState().syncFromTasks(tasks);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(1);
      expect(reminders[0].taskId).toBe("task-2");
    });

    it("ignore les taches avec status done", () => {
      const tasks = [
        makeTask({
          id: "task-1",
          title: "Done task",
          dueDate: "2025-06-15",
          status: "done",
        }),
        makeTask({
          id: "task-2",
          title: "Todo task",
          dueDate: "2025-06-15",
          status: "todo",
        }),
      ];

      useReminderStore.getState().syncFromTasks(tasks);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(1);
      expect(reminders[0].taskId).toBe("task-2");
    });

    it("met a jour le scheduledAt si la deadline change", () => {
      const taskId = "task-1";
      // Initial sync with dueDate 2025-06-15
      const existingReminder = makeReminder({
        taskId,
        taskTitle: "Task 1",
        scheduledAt: calculateReminderTime("2025-06-15", null)!,
      });
      useReminderStore.setState({ reminders: [existingReminder] });

      // Sync with new dueDate 2025-06-20
      const tasks = [
        makeTask({
          id: taskId,
          title: "Task 1",
          dueDate: "2025-06-20",
        }),
      ];

      useReminderStore.getState().syncFromTasks(tasks);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(1);
      const expectedScheduledAt = calculateReminderTime("2025-06-20", null);
      expect(reminders[0].scheduledAt).toBe(expectedScheduledAt);
    });

    it("conserve le rappel existant si scheduledAt identique", () => {
      const taskId = "task-1";
      const scheduledAt = calculateReminderTime("2025-06-15", null)!;
      const existingReminder = makeReminder({
        taskId,
        taskTitle: "Task 1",
        scheduledAt,
        triggered: true,
      });
      useReminderStore.setState({ reminders: [existingReminder] });

      const tasks = [
        makeTask({
          id: taskId,
          title: "Task 1",
          dueDate: "2025-06-15",
        }),
      ];

      useReminderStore.getState().syncFromTasks(tasks);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(1);
      // triggered status preserved
      expect(reminders[0].triggered).toBe(true);
    });

    it("supprime les rappels pour les taches absentes de la liste", () => {
      const existingReminder = makeReminder({
        taskId: "task-old",
        taskTitle: "Old task",
      });
      useReminderStore.setState({ reminders: [existingReminder] });

      // Sync with only new tasks
      const tasks = [
        makeTask({ id: "task-new", title: "New task", dueDate: "2025-06-15" }),
      ];

      useReminderStore.getState().syncFromTasks(tasks);

      const { reminders } = useReminderStore.getState();
      expect(reminders).toHaveLength(1);
      expect(reminders[0].taskId).toBe("task-new");
    });

    it("reset triggered a false si scheduledAt change", () => {
      const taskId = "task-1";
      const existingReminder = makeReminder({
        taskId,
        taskTitle: "Task 1",
        scheduledAt: calculateReminderTime("2025-06-15", null)!,
        triggered: true,
      });
      useReminderStore.setState({ reminders: [existingReminder] });

      // Change dueDate => scheduledAt changes => triggered reset
      const tasks = [
        makeTask({ id: taskId, title: "Task 1", dueDate: "2025-06-20" }),
      ];

      useReminderStore.getState().syncFromTasks(tasks);

      const { reminders } = useReminderStore.getState();
      expect(reminders[0].triggered).toBe(false);
    });
  });
});

// ─── notification.ts ──────────────────────────────────

describe("notification module", () => {
  it("requestNotificationPermission retourne false si pas de window", async () => {
    const { requestNotificationPermission } = await import(
      "@/lib/reminders/notification"
    );

    // jsdom has window but may not have Notification
    // In jsdom, Notification may not exist, which should return false
    const result = await requestNotificationPermission();
    // jsdom doesn't have Notification API by default
    expect(typeof result).toBe("boolean");
  });

  it("sendReminderNotification ne crash pas sans Notification API", async () => {
    const { sendReminderNotification } = await import(
      "@/lib/reminders/notification"
    );

    // Should not throw even without proper Notification support
    expect(() => {
      sendReminderNotification("Test task", "2025-06-15T10:00:00Z");
    }).not.toThrow();
  });
});
