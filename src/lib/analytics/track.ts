// Stub pour Vercel Analytics — sera activé au déploiement
export function trackEvent(
  name: string,
  properties?: Record<string, string | number>
) {
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, properties);
  }
  // En production, Vercel Analytics sera ajouté via next.config.ts
}

export const EVENTS = {
  SIGNUP: "signup",
  ANALYSIS_STARTED: "analysis_started",
  ANALYSIS_COMPLETED: "analysis_completed",
  UPGRADE_CLICKED: "upgrade_clicked",
  TASK_CREATED: "task_created",
  EXPORT_CSV: "export_csv",
  EXPORT_PDF: "export_pdf",
} as const;
