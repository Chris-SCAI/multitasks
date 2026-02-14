import { track } from "@vercel/analytics";

export function trackEvent(
  name: string,
  properties?: Record<string, string | number>,
) {
  track(name, properties);
}

export const EVENTS = {
  SIGNUP: "signup",
  ANALYSIS_STARTED: "analysis_started",
  ANALYSIS_COMPLETED: "analysis_completed",
  UPGRADE_CLICKED: "upgrade_clicked",
  TASK_CREATED: "task_created",
  EXPORT_CSV: "export_csv",
  EXPORT_PDF: "export_pdf",
  CTA_HERO_CLICK: "cta_hero_click",
  CTA_FINAL_CLICK: "cta_final_click",
} as const;
