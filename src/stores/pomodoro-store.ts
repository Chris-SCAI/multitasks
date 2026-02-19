import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTaskStore } from "./task-store";
import { playTimerEndSound } from "@/lib/reminders/sounds";

interface PomodoroSession {
  id: string;
  taskId: string;
  taskTitle: string;
  type: "work" | "break" | "longBreak";
  duration: number;
  completedAt: string;
}

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreak: boolean;
  autoStartWork: boolean;
}

interface PomodoroState {
  activeTaskId: string | null;
  activeTaskTitle: string;
  timeRemaining: number;
  isRunning: boolean;
  sessionType: "work" | "break" | "longBreak";
  workSessionCount: number;

  sessions: PomodoroSession[];

  settings: PomodoroSettings;

  startSession: (taskId: string, taskTitle: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: () => void;
  completeSession: () => void;
  skipSession: () => void;
  updateSettings: (s: Partial<PomodoroSettings>) => void;
  todayStats: () => { sessions: number; totalMinutes: number };
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function cleanOldSessions(sessions: PomodoroSession[]): PomodoroSession[] {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoff = sevenDaysAgo.toISOString();
  return sessions.filter((s) => s.completedAt >= cutoff);
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      activeTaskTitle: "",
      timeRemaining: 0,
      isRunning: false,
      sessionType: "work",
      workSessionCount: 0,

      sessions: [],

      settings: {
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartBreak: true,
        autoStartWork: false,
      },

      startSession: (taskId, taskTitle) => {
        const { settings } = get();
        set({
          activeTaskId: taskId,
          activeTaskTitle: taskTitle,
          timeRemaining: settings.workDuration * 60,
          isRunning: true,
          sessionType: "work",
        });
      },

      pause: () => set({ isRunning: false }),

      resume: () => set({ isRunning: true }),

      stop: () =>
        set({
          activeTaskId: null,
          activeTaskTitle: "",
          timeRemaining: 0,
          isRunning: false,
          sessionType: "work",
        }),

      tick: () => {
        const { timeRemaining, isRunning } = get();
        if (!isRunning || timeRemaining <= 0) return;

        const next = timeRemaining - 1;
        if (next <= 0) {
          get().completeSession();
        } else {
          set({ timeRemaining: next });
        }
      },

      completeSession: () => {
        const state = get();
        const { sessionType, activeTaskId, activeTaskTitle, settings, workSessionCount } = state;

        playTimerEndSound();

        const session: PomodoroSession = {
          id: crypto.randomUUID(),
          taskId: activeTaskId ?? "",
          taskTitle: activeTaskTitle,
          type: sessionType,
          duration: sessionType === "work"
            ? settings.workDuration * 60
            : sessionType === "break"
              ? settings.breakDuration * 60
              : settings.longBreakDuration * 60,
          completedAt: new Date().toISOString(),
        };

        const updatedSessions = cleanOldSessions([...state.sessions, session]);

        if (sessionType === "work") {
          // Mettre a jour actualMinutes de la tache
          if (activeTaskId) {
            const taskStore = useTaskStore.getState();
            const task = taskStore.tasks.find((t) => t.id === activeTaskId);
            const currentMinutes = task?.actualMinutes ?? 0;
            taskStore.updateTask(activeTaskId, {
              actualMinutes: currentMinutes + settings.workDuration,
            });
          }

          const newCount = workSessionCount + 1;
          const isLongBreak = newCount % settings.sessionsBeforeLongBreak === 0;
          const nextType = isLongBreak ? "longBreak" : "break";
          const nextDuration = isLongBreak
            ? settings.longBreakDuration * 60
            : settings.breakDuration * 60;

          set({
            sessions: updatedSessions,
            workSessionCount: newCount,
            sessionType: nextType,
            timeRemaining: nextDuration,
            isRunning: settings.autoStartBreak,
          });
        } else {
          // Fin de pause -> retour au travail
          set({
            sessions: updatedSessions,
            sessionType: "work",
            timeRemaining: settings.workDuration * 60,
            isRunning: settings.autoStartWork,
          });
        }
      },

      skipSession: () => {
        const state = get();
        const { sessionType, settings, workSessionCount } = state;

        if (sessionType === "work") {
          const newCount = workSessionCount + 1;
          const isLongBreak = newCount % settings.sessionsBeforeLongBreak === 0;
          const nextType = isLongBreak ? "longBreak" : "break";
          const nextDuration = isLongBreak
            ? settings.longBreakDuration * 60
            : settings.breakDuration * 60;
          set({
            workSessionCount: newCount,
            sessionType: nextType,
            timeRemaining: nextDuration,
            isRunning: false,
          });
        } else {
          set({
            sessionType: "work",
            timeRemaining: settings.workDuration * 60,
            isRunning: false,
          });
        }
      },

      updateSettings: (s) =>
        set((state) => ({
          settings: { ...state.settings, ...s },
        })),

      todayStats: () => {
        const { sessions } = get();
        const today = getToday();
        const todaySessions = sessions.filter(
          (s) => s.type === "work" && s.completedAt.startsWith(today)
        );
        return {
          sessions: todaySessions.length,
          totalMinutes: todaySessions.reduce((acc, s) => acc + s.duration / 60, 0),
        };
      },
    }),
    {
      name: "multitasks-pomodoro",
      partialize: (state) => ({
        sessions: state.sessions,
        settings: state.settings,
        workSessionCount: state.workSessionCount,
      }),
    }
  )
);
