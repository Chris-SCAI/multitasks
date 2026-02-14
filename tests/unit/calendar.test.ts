import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCalendar } from "@/hooks/useCalendar";
import { useTaskStore } from "@/stores/task-store";
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

describe("useCalendar", () => {
  beforeEach(() => {
    // Reset store tasks before each test
    useTaskStore.setState({ tasks: [] });
  });

  // ─── Navigation ─────────────────────────────────────────

  describe("getWeekDays", () => {
    it("retourne 7 jours (lundi -> dimanche)", () => {
      const { result } = renderHook(() => useCalendar());
      const days = result.current.getWeekDays();

      expect(days).toHaveLength(7);
      expect(days[0].dayName).toBe("Lun");
      expect(days[6].dayName).toBe("Dim");
    });

    it("les jours sont consecutifs", () => {
      const { result } = renderHook(() => useCalendar());
      const days = result.current.getWeekDays();

      for (let i = 1; i < days.length; i++) {
        const prevDate = new Date(days[i - 1].date);
        const currDate = new Date(days[i].date);
        const diffDays =
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(diffDays).toBe(1);
      }
    });

    it("le premier jour est un lundi", () => {
      const { result } = renderHook(() => useCalendar());
      const days = result.current.getWeekDays();
      const firstDate = new Date(days[0].date);
      // getDay() returns 1 for Monday
      expect(firstDate.getDay()).toBe(1);
    });
  });

  describe("navigateWeek", () => {
    it("navigateWeek(1) avance d'une semaine", () => {
      const { result } = renderHook(() => useCalendar());
      const daysBefore = result.current.getWeekDays();

      act(() => {
        result.current.navigateWeek(1);
      });

      const daysAfter = result.current.getWeekDays();
      const beforeDate = new Date(daysBefore[0].date);
      const afterDate = new Date(daysAfter[0].date);
      const diffDays =
        (afterDate.getTime() - beforeDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBe(7);
    });

    it("navigateWeek(-1) recule d'une semaine", () => {
      const { result } = renderHook(() => useCalendar());
      const daysBefore = result.current.getWeekDays();

      act(() => {
        result.current.navigateWeek(-1);
      });

      const daysAfter = result.current.getWeekDays();
      const beforeDate = new Date(daysBefore[0].date);
      const afterDate = new Date(daysAfter[0].date);
      const diffDays =
        (afterDate.getTime() - beforeDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBe(-7);
    });
  });

  describe("getMonthDays", () => {
    it("retourne les jours du mois avec padding (multiple de 7)", () => {
      const { result } = renderHook(() => useCalendar());
      const days = result.current.getMonthDays();

      expect(days.length).toBeGreaterThanOrEqual(28);
      expect(days.length % 7).toBe(0);
    });

    it("contient des jours du mois courant", () => {
      const { result } = renderHook(() => useCalendar());
      const days = result.current.getMonthDays();

      const currentMonthDays = days.filter((d) => d.isCurrentMonth);
      expect(currentMonthDays.length).toBeGreaterThanOrEqual(28);
      expect(currentMonthDays.length).toBeLessThanOrEqual(31);
    });

    it("commence un lundi", () => {
      const { result } = renderHook(() => useCalendar());
      const days = result.current.getMonthDays();
      const firstDate = new Date(days[0].date);
      expect(firstDate.getDay()).toBe(1);
    });
  });

  describe("navigateMonth", () => {
    it("navigateMonth(1) avance d'un mois", () => {
      const { result } = renderHook(() => useCalendar());
      const currentMonth = result.current.currentDate.getMonth();

      act(() => {
        result.current.navigateMonth(1);
      });

      const nextMonth = result.current.currentDate.getMonth();
      const expected = (currentMonth + 1) % 12;
      expect(nextMonth).toBe(expected);
    });

    it("navigateMonth(-1) recule d'un mois", () => {
      const { result } = renderHook(() => useCalendar());
      const currentMonth = result.current.currentDate.getMonth();

      act(() => {
        result.current.navigateMonth(-1);
      });

      const prevMonth = result.current.currentDate.getMonth();
      const expected = (currentMonth - 1 + 12) % 12;
      expect(prevMonth).toBe(expected);
    });
  });

  describe("goToToday", () => {
    it("revient a la date courante apres navigation", () => {
      const { result } = renderHook(() => useCalendar());

      // Navigate away
      act(() => {
        result.current.navigateWeek(1);
        result.current.navigateWeek(1);
        result.current.navigateWeek(1);
      });

      // Come back
      act(() => {
        result.current.goToToday();
      });

      const today = new Date();
      const currentDate = result.current.currentDate;
      expect(currentDate.getDate()).toBe(today.getDate());
      expect(currentDate.getMonth()).toBe(today.getMonth());
      expect(currentDate.getFullYear()).toBe(today.getFullYear());
    });
  });

  // ─── Taches par jour ──────────────────────────────────

  describe("getTasksForDay", () => {
    it("retourne les taches dont dueDate = date", () => {
      const targetDate = "2025-06-15";
      const tasks = [
        makeTask({ title: "Task A", dueDate: targetDate }),
        makeTask({ title: "Task B", dueDate: targetDate }),
        makeTask({ title: "Task C", dueDate: "2025-06-16" }),
      ];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const dayTasks = result.current.getTasksForDay(targetDate);

      expect(dayTasks).toHaveLength(2);
      expect(dayTasks[0].title).toBe("Task A");
      expect(dayTasks[1].title).toBe("Task B");
    });

    it("retourne un array vide si aucune tache ce jour", () => {
      useTaskStore.setState({ tasks: [] });

      const { result } = renderHook(() => useCalendar());
      const dayTasks = result.current.getTasksForDay("2025-06-15");

      expect(dayTasks).toHaveLength(0);
      expect(dayTasks).toEqual([]);
    });
  });

  // ─── Charge par jour ──────────────────────────────────

  describe("getDayLoad", () => {
    it("retourne la somme des estimatedMinutes", () => {
      const targetDate = "2025-06-15";
      const tasks = [
        makeTask({ dueDate: targetDate, estimatedMinutes: 60 }),
        makeTask({ dueDate: targetDate, estimatedMinutes: 120 }),
        makeTask({ dueDate: targetDate, estimatedMinutes: 30 }),
      ];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const load = result.current.getDayLoad(targetDate);

      expect(load).toBe(210);
    });

    it("retourne 0 si aucune tache ce jour", () => {
      useTaskStore.setState({ tasks: [] });

      const { result } = renderHook(() => useCalendar());
      const load = result.current.getDayLoad("2025-06-15");

      expect(load).toBe(0);
    });

    it("retourne 0 si estimatedMinutes sont null", () => {
      const targetDate = "2025-06-15";
      const tasks = [
        makeTask({ dueDate: targetDate, estimatedMinutes: null }),
        makeTask({ dueDate: targetDate, estimatedMinutes: null }),
      ];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const load = result.current.getDayLoad(targetDate);

      expect(load).toBe(0);
    });

    it("gere un mix de null et valeurs", () => {
      const targetDate = "2025-06-15";
      const tasks = [
        makeTask({ dueDate: targetDate, estimatedMinutes: 90 }),
        makeTask({ dueDate: targetDate, estimatedMinutes: null }),
        makeTask({ dueDate: targetDate, estimatedMinutes: 45 }),
      ];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const load = result.current.getDayLoad(targetDate);

      expect(load).toBe(135);
    });
  });

  // ─── Detection de conflits ────────────────────────────

  describe("getConflicts", () => {
    it("retourne hasConflict: false si 0 tache", () => {
      useTaskStore.setState({ tasks: [] });

      const { result } = renderHook(() => useCalendar());
      const conflicts = result.current.getConflicts("2025-06-15");

      expect(conflicts.hasConflict).toBe(false);
      expect(conflicts.reason).toBeNull();
      expect(conflicts.taskCount).toBe(0);
    });

    it("retourne hasConflict: false si 1 tache", () => {
      const tasks = [makeTask({ dueDate: "2025-06-15", estimatedMinutes: 60 })];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const conflicts = result.current.getConflicts("2025-06-15");

      expect(conflicts.hasConflict).toBe(false);
      expect(conflicts.reason).toBeNull();
      expect(conflicts.taskCount).toBe(1);
    });

    it("retourne hasConflict: true, reason: multiple_deadlines si 2+ taches", () => {
      const tasks = [
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 30 }),
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 30 }),
      ];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const conflicts = result.current.getConflicts("2025-06-15");

      expect(conflicts.hasConflict).toBe(true);
      expect(conflicts.reason).toBe("multiple_deadlines");
      expect(conflicts.taskCount).toBe(2);
    });

    it("retourne hasConflict: true, reason: overloaded si charge > 480 min", () => {
      const tasks = [
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 300 }),
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 200 }),
      ];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const conflicts = result.current.getConflicts("2025-06-15");

      expect(conflicts.hasConflict).toBe(true);
      expect(conflicts.reason).toBe("overloaded");
      expect(conflicts.totalMinutes).toBe(500);
    });

    it("overloaded prend priorite sur multiple_deadlines", () => {
      // 3 tasks with overload (>480) => both conditions true, overloaded wins
      const tasks = [
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 200 }),
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 200 }),
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 200 }),
      ];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const conflicts = result.current.getConflicts("2025-06-15");

      expect(conflicts.hasConflict).toBe(true);
      expect(conflicts.reason).toBe("overloaded");
      expect(conflicts.taskCount).toBe(3);
      expect(conflicts.totalMinutes).toBe(600);
    });

    it("charge exactement 480 min n'est pas overloaded", () => {
      const tasks = [
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 240 }),
        makeTask({ dueDate: "2025-06-15", estimatedMinutes: 240 }),
      ];
      useTaskStore.setState({ tasks });

      const { result } = renderHook(() => useCalendar());
      const conflicts = result.current.getConflicts("2025-06-15");

      expect(conflicts.hasConflict).toBe(true);
      // 480 is not > 480, so it should be multiple_deadlines
      expect(conflicts.reason).toBe("multiple_deadlines");
      expect(conflicts.totalMinutes).toBe(480);
    });
  });

  // ─── View toggle ──────────────────────────────────────

  describe("view", () => {
    it("vue par defaut est week", () => {
      const { result } = renderHook(() => useCalendar());
      expect(result.current.view).toBe("week");
    });

    it("setView change la vue", () => {
      const { result } = renderHook(() => useCalendar());

      act(() => {
        result.current.setView("month");
      });

      expect(result.current.view).toBe("month");
    });
  });

  // ─── Labels ───────────────────────────────────────────

  describe("weekLabel", () => {
    it("contient Semaine du", () => {
      const { result } = renderHook(() => useCalendar());
      expect(result.current.weekLabel).toContain("Semaine du");
    });
  });

  describe("monthLabel", () => {
    it("contient l'annee courante", () => {
      const { result } = renderHook(() => useCalendar());
      const year = new Date().getFullYear().toString();
      expect(result.current.monthLabel).toContain(year);
    });
  });
});

// ─── Exports du module ────────────────────────────────

describe("Calendar exports", () => {
  it("exporte DAY_NAMES avec 7 jours", async () => {
    const { DAY_NAMES } = await import("@/hooks/useCalendar");
    expect(DAY_NAMES).toHaveLength(7);
    expect(DAY_NAMES[0]).toBe("lundi");
    expect(DAY_NAMES[6]).toBe("dimanche");
  });

  it("exporte DAY_NAMES_SHORT avec 7 jours", async () => {
    const { DAY_NAMES_SHORT } = await import("@/hooks/useCalendar");
    expect(DAY_NAMES_SHORT).toHaveLength(7);
    expect(DAY_NAMES_SHORT[0]).toBe("Lun");
    expect(DAY_NAMES_SHORT[6]).toBe("Dim");
  });

  it("exporte MONTH_NAMES avec 12 mois", async () => {
    const { MONTH_NAMES } = await import("@/hooks/useCalendar");
    expect(MONTH_NAMES).toHaveLength(12);
    expect(MONTH_NAMES[0]).toBe("janvier");
    expect(MONTH_NAMES[11]).toBe("décembre");
  });
});
