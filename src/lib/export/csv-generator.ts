import type { Task } from "@/types/task";

/**
 * Génère un CSV UTF-8 avec BOM à partir d'une liste de tâches
 * Format : id, title, description, status, priority, domain, dueDate, estimatedMinutes, createdAt, completedAt
 */
export function generateTasksCSV(tasks: Task[]): string {
  // BOM UTF-8 pour Excel
  const BOM = "\uFEFF";

  // Headers
  const headers = [
    "id",
    "title",
    "description",
    "status",
    "priority",
    "domainId",
    "dueDate",
    "estimatedMinutes",
    "createdAt",
    "completedAt",
  ];

  // Fonction pour échapper les valeurs CSV
  const escapeCsvValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

    // Si la valeur contient une virgule, des guillemets ou un retour à la ligne,
    // l'entourer de guillemets et doubler les guillemets internes
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n") ||
      stringValue.includes("\r")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  // Construire les lignes
  const rows = tasks.map((task) => {
    return [
      escapeCsvValue(task.id),
      escapeCsvValue(task.title),
      escapeCsvValue(task.description),
      escapeCsvValue(task.status),
      escapeCsvValue(task.priority),
      escapeCsvValue(task.domainId),
      escapeCsvValue(task.dueDate),
      escapeCsvValue(task.estimatedMinutes),
      escapeCsvValue(task.createdAt),
      escapeCsvValue(task.completedAt),
    ].join(",");
  });

  // Assembler le CSV
  const csvContent = [headers.join(","), ...rows].join("\n");

  return BOM + csvContent;
}
