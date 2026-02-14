import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";
type View = "list" | "board";

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  currentView: View;
  showCompletedTasks: boolean;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: View) => void;
  toggleShowCompleted: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: true,
      currentView: "list",
      showCompletedTasks: true,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentView: (view) => set({ currentView: view }),
      toggleShowCompleted: () =>
        set((state) => ({ showCompletedTasks: !state.showCompletedTasks })),
    }),
    {
      name: "multitasks-ui",
    }
  )
);
