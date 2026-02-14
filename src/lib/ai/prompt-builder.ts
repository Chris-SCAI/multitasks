import type { Task } from "@/types";

interface AnalysisInput {
  tasks: Task[];
  timezone: string;
  currentDate: string;
}

export function buildAnalysisPrompt(input: AnalysisInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `Tu es un expert en productivité et gestion du temps. Tu utilises la matrice d'Eisenhower pour prioriser les tâches.

RÈGLES DE CLASSIFICATION :
- URGENT = deadline dans moins de 48h à partir de maintenant (${input.currentDate}, timezone ${input.timezone})
- IMPORTANT = tâche ayant un impact significatif sur les objectifs professionnels ou personnels
- Durée estimée : arrondir aux 5 minutes (minimum 5, maximum 480)
- Next action : verbe d'action + objet + contexte (max 300 caractères)
- risk_flag = true si deadline < 48h OU si 2+ tâches ont la même deadline
- Ordre suggéré : urgent+important → important (quick wins first) → urgent non important → reste

FORMAT DE RÉPONSE : JSON strict uniquement, pas de texte autour.
{
  "tasks": [
    {
      "task_id": "string (UUID de la tâche)",
      "eisenhower_quadrant": "urgent_important" | "important_not_urgent" | "urgent_not_important" | "not_urgent_not_important",
      "suggested_priority": "urgent" | "high" | "medium" | "low",
      "estimated_duration_minutes": number (5-480, multiple de 5),
      "next_action": "string (verbe + objet + contexte)",
      "reasoning": "string (1 phrase justifiant le classement)",
      "risk_flag": boolean,
      "suggested_order": number (1-based, unique)
    }
  ],
  "summary": "string (2-3 phrases résumant la priorisation)",
  "conflict_warnings": ["string"] (deadlines en conflit, surcharge)
}`;

  const taskList = input.tasks
    .map((t, i) => {
      const parts = [
        `${i + 1}. [${t.id}] "${t.title}"`,
        t.description ? `   Description: ${t.description}` : null,
        `   Statut: ${t.status}`,
        `   Priorité actuelle: ${t.priority}`,
        t.dueDate ? `   Deadline: ${t.dueDate}` : "   Pas de deadline",
        t.estimatedMinutes
          ? `   Durée estimée: ${t.estimatedMinutes} min`
          : null,
      ];
      return parts.filter(Boolean).join("\n");
    })
    .join("\n\n");

  const userPrompt = `Analyse et priorise ces ${input.tasks.length} tâches avec la matrice d'Eisenhower :

${taskList}

Date actuelle : ${input.currentDate}
Timezone : ${input.timezone}

Réponds UNIQUEMENT en JSON valide.`;

  return { systemPrompt, userPrompt };
}
