import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationSound } from "@/lib/reminders/sounds";

type Theme = "light" | "dark" | "system";
type View = "list" | "board";

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  currentView: View;
  showCompletedTasks: boolean;
  notificationSound: NotificationSound;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: View) => void;
  toggleShowCompleted: () => void;
  setNotificationSound: (sound: NotificationSound) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: true,
      currentView: "list",
      showCompletedTasks: true,
      notificationSound: "bell",

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentView: (view) => set({ currentView: view }),
      toggleShowCompleted: () =>
        set((state) => ({ showCompletedTasks: !state.showCompletedTasks })),
      setNotificationSound: (sound) => set({ notificationSound: sound }),
    }),
    {
      name: "multitasks-ui",
    }
  )
);
