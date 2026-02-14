"use client";

import { useState, useCallback, useMemo } from "react";
import { useTaskStore } from "@/stores/task-store";

type CalendarView = "week" | "month";

interface DayInfo {
  date: string;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
  isCurrentMonth: boolean;
}

interface ConflictInfo {
  hasConflict: boolean;
  reason: "multiple_deadlines" | "overloaded" | null;
  taskCount: number;
  totalMinutes: number;
}

const DAY_NAMES = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

const DAY_NAMES_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const MONTH_NAMES = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTodayString(): string {
  return formatDateString(new Date());
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [view, setView] = useState<CalendarView>("week");

  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);

  const navigateWeek = useCallback(
    (direction: 1 | -1) => {
      setCurrentDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() + direction * 7);
        return next;
      });
    },
    []
  );

  const navigateMonth = useCallback(
    (direction: 1 | -1) => {
      setCurrentDate((prev) => {
        const next = new Date(prev);
        next.setMonth(next.getMonth() + direction);
        return next;
      });
    },
    []
  );

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const getWeekDays = useCallback((): DayInfo[] => {
    const monday = getMondayOfWeek(currentDate);
    const today = getTodayString();
    const currentMonth = currentDate.getMonth();

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = formatDateString(d);
      return {
        date: dateStr,
        dayNumber: d.getDate(),
        dayName: DAY_NAMES_SHORT[i],
        isToday: dateStr === today,
        isCurrentMonth: d.getMonth() === currentMonth,
      };
    });
  }, [currentDate]);

  const getMonthDays = useCallback((): DayInfo[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = getTodayString();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const monday = getMondayOfWeek(firstDay);

    const days: DayInfo[] = [];
    const d = new Date(monday);

    while (d <= lastDay || days.length % 7 !== 0) {
      const dateStr = formatDateString(d);
      const dayOfWeek = d.getDay();
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      days.push({
        date: dateStr,
        dayNumber: d.getDate(),
        dayName: DAY_NAMES_SHORT[dayIndex],
        isToday: dateStr === today,
        isCurrentMonth: d.getMonth() === month,
      });
      d.setDate(d.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  const getTasksForDay = useCallback(
    (date: string) => {
      return tasks.filter((t) => t.dueDate === date);
    },
    [tasks]
  );

  const getDayLoad = useCallback(
    (date: string): number => {
      return tasks
        .filter((t) => t.dueDate === date)
        .reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0);
    },
    [tasks]
  );

  const getConflicts = useCallback(
    (date: string): ConflictInfo => {
      const dayTasks = tasks.filter((t) => t.dueDate === date);
      const taskCount = dayTasks.length;
      const totalMinutes = dayTasks.reduce(
        (sum, t) => sum + (t.estimatedMinutes ?? 0),
        0
      );

      const hasMultipleDeadlines = taskCount >= 2;
      const isOverloaded = totalMinutes > 480;

      if (isOverloaded) {
        return {
          hasConflict: true,
          reason: "overloaded",
          taskCount,
          totalMinutes,
        };
      }

      if (hasMultipleDeadlines) {
        return {
          hasConflict: true,
          reason: "multiple_deadlines",
          taskCount,
          totalMinutes,
        };
      }

      return {
        hasConflict: false,
        reason: null,
        taskCount,
        totalMinutes,
      };
    },
    [tasks]
  );

  const updateTaskDeadline = useCallback(
    async (taskId: string, newDate: string) => {
      await updateTask(taskId, { dueDate: newDate });
    },
    [updateTask]
  );

  const weekLabel = useMemo(() => {
    const days = getWeekDays();
    if (days.length === 0) return "";
    const first = days[0];
    const last = days[6];

    const firstDate = new Date(first.date);
    const lastDate = new Date(last.date);

    const firstMonth = MONTH_NAMES[firstDate.getMonth()];
    const lastMonth = MONTH_NAMES[lastDate.getMonth()];

    const year = lastDate.getFullYear();

    if (firstMonth === lastMonth) {
      return `Semaine du ${first.dayNumber} au ${last.dayNumber} ${firstMonth.charAt(0).toUpperCase() + firstMonth.slice(1)} ${year}`;
    }
    return `Semaine du ${first.dayNumber} ${firstMonth.charAt(0).toUpperCase() + firstMonth.slice(1).slice(0, 3)} au ${last.dayNumber} ${lastMonth.charAt(0).toUpperCase() + lastMonth.slice(1).slice(0, 3)} ${year}`;
  }, [getWeekDays]);

  const monthLabel = useMemo(() => {
    const month = MONTH_NAMES[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  }, [currentDate]);

  return {
    currentDate,
    view,
    setView,
    navigateWeek,
    navigateMonth,
    goToToday,
    getWeekDays,
    getMonthDays,
    getTasksForDay,
    getDayLoad,
    getConflicts,
    updateTaskDeadline,
    weekLabel,
    monthLabel,
  };
}

export { DAY_NAMES, DAY_NAMES_SHORT, MONTH_NAMES };
export type { CalendarView, DayInfo, ConflictInfo };
