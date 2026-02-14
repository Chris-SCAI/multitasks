import { describe, it, expect } from "vitest";
import { generateTasksCSV } from "@/lib/export/csv-generator";
import { generateTasksPDF } from "@/lib/export/pdf-generator";
import type { Task } from "@/types/task";
import type { Domain } from "@/types/domain";

describe("CSV Generator", () => {
  const sampleTasks: Task[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Tâche test",
      description: "Description test",
      status: "todo",
      priority: "high",
      domainId: "domain-1",
      tags: [],
      dueDate: "2025-02-15",
      estimatedMinutes: 60,
      actualMinutes: null,
      order: 0,
      createdAt: "2025-02-01T10:00:00Z",
      updatedAt: "2025-02-01T10:00:00Z",
      completedAt: null,
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174001",
      title: 'Tâche avec "guillemets" et, virgule',
      description: "Multi\nligne",
      status: "done",
      priority: "medium",
      domainId: "domain-2",
      tags: [],
      dueDate: null,
      estimatedMinutes: null,
      actualMinutes: 45,
      order: 1,
      createdAt: "2025-02-02T10:00:00Z",
      updatedAt: "2025-02-03T10:00:00Z",
      completedAt: "2025-02-03T11:00:00Z",
    },
  ];

  it("génère un CSV avec BOM UTF-8", () => {
    const csv = generateTasksCSV(sampleTasks);
    expect(csv.charCodeAt(0)).toBe(0xfeff); // BOM
  });

  it("contient les headers corrects", () => {
    const csv = generateTasksCSV(sampleTasks);
    const lines = csv.split("\n");
    const headers = lines[0].replace(/^\uFEFF/, ""); // Retirer BOM
    expect(headers).toBe(
      "id,title,description,status,priority,domainId,dueDate,estimatedMinutes,createdAt,completedAt"
    );
  });

  it("échappe correctement les guillemets", () => {
    const csv = generateTasksCSV(sampleTasks);
    expect(csv).toContain('"Tâche avec ""guillemets"" et, virgule"');
  });

  it("échappe correctement les virgules", () => {
    const csv = generateTasksCSV(sampleTasks);
    const lines = csv.split("\n");
    // La ligne 3 contient des guillemets car il y a une virgule dans le titre
    expect(lines[2]).toMatch(/^223e4567-e89b-12d3-a456-426614174001,"[^"]*"/);
  });

  it("échappe correctement les retours à la ligne", () => {
    const csv = generateTasksCSV(sampleTasks);
    // La description "Multi\nligne" doit être échappée
    expect(csv).toContain('"Multi\nligne"');
  });

  it("génère le bon nombre de lignes", () => {
    const csv = generateTasksCSV(sampleTasks);
    const lines = csv.split("\n");
    // 1 header + 2 tâches + 1 ligne vide finale = 4 lignes
    expect(lines.length).toBe(4);
  });

  it("gère une liste vide", () => {
    const csv = generateTasksCSV([]);
    const lines = csv.split("\n").filter((l) => l.trim());
    expect(lines.length).toBe(1); // Seulement le header
  });

  it("convertit null en chaîne vide", () => {
    const csv = generateTasksCSV(sampleTasks);
    const lines = csv.split("\n");
    // La première tâche a completedAt null
    const firstTask = lines[1];
    expect(firstTask.endsWith(",")).toBe(true); // Dernière colonne vide
  });
});

describe("PDF Generator", () => {
  const sampleDomains: Domain[] = [
    {
      id: "domain-1",
      name: "Professionnel",
      color: "#3B82F6",
      icon: "briefcase",
      description: "Travail",
      isDefault: true,
      order: 0,
      createdAt: "2025-02-01T10:00:00Z",
      updatedAt: "2025-02-01T10:00:00Z",
    },
    {
      id: "domain-2",
      name: "Personnel",
      color: "#10B981",
      icon: "user",
      description: "Perso",
      isDefault: false,
      order: 1,
      createdAt: "2025-02-01T10:00:00Z",
      updatedAt: "2025-02-01T10:00:00Z",
    },
  ];

  const sampleTasks: Task[] = [
    {
      id: "task-1",
      title: "Tâche urgente",
      description: "Description urgente",
      status: "todo",
      priority: "urgent",
      domainId: "domain-1",
      tags: [],
      dueDate: "2025-02-15",
      estimatedMinutes: 60,
      actualMinutes: null,
      order: 0,
      createdAt: "2025-02-01T10:00:00Z",
      updatedAt: "2025-02-01T10:00:00Z",
      completedAt: null,
    },
    {
      id: "task-2",
      title: "Tâche normale",
      description: "Description normale",
      status: "done",
      priority: "medium",
      domainId: "domain-2",
      tags: [],
      dueDate: null,
      estimatedMinutes: 30,
      actualMinutes: 45,
      order: 1,
      createdAt: "2025-02-02T10:00:00Z",
      updatedAt: "2025-02-03T10:00:00Z",
      completedAt: "2025-02-03T11:00:00Z",
    },
  ];

  it("génère du HTML valide", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  it("contient le titre du rapport", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("Rapport Multitasks");
  });

  it("contient la date du rapport", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    const date = new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(html).toContain(date);
  });

  it("groupe les tâches par domaine", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("Professionnel");
    expect(html).toContain("Personnel");
  });

  it("affiche les titres des tâches", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("Tâche urgente");
    expect(html).toContain("Tâche normale");
  });

  it("applique les classes CSS de priorité", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("priority-urgent");
    expect(html).toContain("priority-medium");
  });

  it("applique la classe CSS pour tâches terminées", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("status-done");
  });

  it("contient les styles CSS inline", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("<style>");
    expect(html).toContain("@page");
    expect(html).toContain("font-family");
  });

  it("affiche la matrice Eisenhower si analyse fournie", () => {
    const analysisResult = {
      tasks: [
        {
          task_id: "task-1",
          eisenhower_quadrant: "urgent_important" as const,
          suggested_priority: "urgent" as const,
          estimated_duration_minutes: 60,
          next_action: "Commencer immédiatement",
          reasoning: "Deadline proche",
          risk_flag: true,
          suggested_order: 1,
        },
      ],
      summary: "Une tâche urgente détectée",
      conflict_warnings: [],
    };

    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
      analysisResult,
    });

    expect(html).toContain("Matrice d'Eisenhower");
    expect(html).toContain("Urgent et Important");
    expect(html).toContain("Une tâche urgente détectée");
  });

  it("n'affiche pas la matrice si aucune analyse", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).not.toContain("Matrice d'Eisenhower");
  });

  it("formate les dates en français", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    // Les dates doivent être formatées en français (ex: "15 février 2025")
    expect(html).toContain("février 2025");
  });

  it("affiche les labels de statut en français", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("À faire");
    expect(html).toContain("Terminée");
  });

  it("affiche les labels de priorité en français", () => {
    const html = generateTasksPDF({
      tasks: sampleTasks,
      domains: sampleDomains,
    });
    expect(html).toContain("Urgente");
    expect(html).toContain("Moyenne");
  });
});
