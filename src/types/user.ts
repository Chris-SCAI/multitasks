export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "fr" | "en";
  defaultView: "list" | "board" | "calendar";
  showCompletedTasks: boolean;
  compactMode: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "fr",
  defaultView: "list",
  showCompletedTasks: true,
  compactMode: false,
};
