import type { Task } from "@/types/task";
import type { Domain } from "@/types/domain";
import type { AnalysisResponse } from "@/lib/ai/response-parser";

interface GeneratePDFOptions {
  tasks: Task[];
  domains: Domain[];
  analysisResult?: AnalysisResponse;
}

/**
 * Génère un rapport HTML formaté qui peut être converti en PDF côté client
 * Utilise print CSS media queries pour une mise en page optimisée
 */
export function generateTasksPDF(options: GeneratePDFOptions): string {
  const { tasks, domains, analysisResult } = options;

  // Créer un map des domaines pour accès rapide
  const domainMap = new Map(domains.map((d) => [d.id, d]));

  // Grouper les tâches par domaine
  const tasksByDomain = tasks.reduce(
    (acc, task) => {
      const domainId = task.domainId ?? "__no_domain__";
      if (!acc[domainId]) {
        acc[domainId] = [];
      }
      acc[domainId].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  // Générer la date du rapport
  const reportDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Styles CSS pour le PDF
  const styles = `
    <style>
      @page {
        margin: 2cm;
      }
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #0F172A;
      }
      .header {
        text-align: center;
        margin-bottom: 2em;
        padding-bottom: 1em;
        border-bottom: 2px solid #2563EB;
      }
      h1 {
        font-size: 24pt;
        font-weight: 700;
        color: #2563EB;
        margin: 0 0 0.5em 0;
      }
      .date {
        font-size: 10pt;
        color: #64748B;
      }
      h2 {
        font-size: 16pt;
        font-weight: 600;
        color: #1E293B;
        margin: 1.5em 0 0.5em 0;
        border-bottom: 1px solid #E2E8F0;
        padding-bottom: 0.25em;
      }
      h3 {
        font-size: 12pt;
        font-weight: 600;
        color: #334155;
        margin: 1em 0 0.5em 0;
      }
      .task {
        margin-bottom: 1em;
        padding: 0.75em;
        border-left: 4px solid #E2E8F0;
        background-color: #F8FAFC;
        page-break-inside: avoid;
      }
      .task-title {
        font-weight: 600;
        font-size: 11pt;
        margin-bottom: 0.25em;
      }
      .task-meta {
        font-size: 9pt;
        color: #64748B;
        margin-bottom: 0.5em;
      }
      .task-description {
        font-size: 10pt;
        color: #475569;
      }
      .priority-urgent {
        border-left-color: #EF4444;
      }
      .priority-high {
        border-left-color: #F59E0B;
      }
      .priority-medium {
        border-left-color: #3B82F6;
      }
      .priority-low {
        border-left-color: #10B981;
      }
      .status-done {
        opacity: 0.7;
      }
      .matrix {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
        margin: 1em 0;
      }
      .quadrant {
        padding: 1em;
        border: 1px solid #E2E8F0;
        border-radius: 4px;
        page-break-inside: avoid;
      }
      .quadrant-title {
        font-weight: 600;
        font-size: 10pt;
        margin-bottom: 0.5em;
      }
      .quadrant-urgent_important {
        background-color: #FEE2E2;
        border-left: 4px solid #EF4444;
      }
      .quadrant-important_not_urgent {
        background-color: #DBEAFE;
        border-left: 4px solid #3B82F6;
      }
      .quadrant-urgent_not_important {
        background-color: #FEF3C7;
        border-left: 4px solid #F59E0B;
      }
      .quadrant-not_urgent_not_important {
        background-color: #F1F5F9;
        border-left: 4px solid #94A3B8;
      }
      .summary {
        margin: 1em 0;
        padding: 1em;
        background-color: #F0F9FF;
        border-left: 4px solid #7C3AED;
        page-break-inside: avoid;
      }
      @media print {
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
      }
    </style>
  `;

  // Header
  const header = `
    <div class="header">
      <h1>Rapport Multitasks</h1>
      <div class="date">${reportDate}</div>
    </div>
  `;

  // Section matrice Eisenhower si analyse disponible
  let matrixSection = "";
  if (analysisResult) {
    const tasksByQuadrant = {
      urgent_important: [] as Task[],
      important_not_urgent: [] as Task[],
      urgent_not_important: [] as Task[],
      not_urgent_not_important: [] as Task[],
    };

    // Créer un map des résultats d'analyse
    const analysisMap = new Map(
      analysisResult.tasks.map((a) => [a.task_id, a])
    );

    // Grouper les tâches par quadrant
    tasks.forEach((task) => {
      const analysis = analysisMap.get(task.id);
      if (analysis && analysis.eisenhower_quadrant) {
        tasksByQuadrant[analysis.eisenhower_quadrant].push(task);
      }
    });

    const quadrantLabels = {
      urgent_important: "Urgent et Important",
      important_not_urgent: "Important mais Non Urgent",
      urgent_not_important: "Urgent mais Non Important",
      not_urgent_not_important: "Ni Urgent ni Important",
    };

    matrixSection = `
      <h2>Matrice d'Eisenhower</h2>
      ${
        analysisResult.summary
          ? `<div class="summary"><strong>Résumé :</strong> ${analysisResult.summary}</div>`
          : ""
      }
      <div class="matrix">
        ${Object.entries(tasksByQuadrant)
          .map(([quadrant, quadrantTasks]) => {
            const label =
              quadrantLabels[quadrant as keyof typeof quadrantLabels];
            return `
            <div class="quadrant quadrant-${quadrant}">
              <div class="quadrant-title">${label} (${quadrantTasks.length})</div>
              ${quadrantTasks
                .map(
                  (task) => `
                <div style="font-size: 9pt; margin-bottom: 0.25em;">
                  • ${task.title}
                </div>
              `
                )
                .join("")}
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  }

  // Section tâches groupées par domaine
  const tasksSection = `
    <h2>Tâches par domaine</h2>
    ${Object.entries(tasksByDomain)
      .map(([domainId, domainTasks]) => {
        const domain = domainMap.get(domainId);
        const domainName = domain?.name || "Sans domaine";

        return `
        <h3>${domainName} (${domainTasks.length})</h3>
        ${domainTasks
          .map((task) => {
            const priorityClass = `priority-${task.priority}`;
            const statusClass =
              task.status === "done" ? "status-done" : "";

            return `
            <div class="task ${priorityClass} ${statusClass}">
              <div class="task-title">${task.title}</div>
              <div class="task-meta">
                Statut: ${getStatusLabel(task.status)} •
                Priorité: ${getPriorityLabel(task.priority)}
                ${task.dueDate ? ` • Échéance: ${formatDate(task.dueDate)}` : ""}
                ${task.estimatedMinutes ? ` • Durée estimée: ${task.estimatedMinutes} min` : ""}
              </div>
              ${task.description ? `<div class="task-description">${task.description}</div>` : ""}
            </div>
          `;
          })
          .join("")}
      `;
      })
      .join("")}
  `;

  // Assembler le HTML complet
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport Multitasks</title>
      ${styles}
    </head>
    <body>
      ${header}
      ${matrixSection}
      ${tasksSection}
    </body>
    </html>
  `;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    todo: "À faire",
    in_progress: "En cours",
    done: "Terminée",
  };
  return labels[status] || status;
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    urgent: "Urgente",
  };
  return labels[priority] || priority;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
