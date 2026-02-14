import { describe, it, expect } from "vitest";
import { buildAnalysisPrompt } from "@/lib/ai/prompt-builder";
import {
  parseAnalysisResponse,
  validateTaskIds,
  validateUniqueOrders,
} from "@/lib/ai/response-parser";
import type { AnalysisResponse } from "@/lib/ai/response-parser";
import type { Task } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Faire le rapport",
    description: "",
    status: "todo",
    priority: "medium",
    domainId: "dom-1",
    tags: [],
    dueDate: null,
    estimatedMinutes: null,
    actualMinutes: null,
    order: 0,
    createdAt: "2025-06-01T10:00:00.000Z",
    updatedAt: "2025-06-01T10:00:00.000Z",
    completedAt: null,
    ...overrides,
  };
}

function makeValidResponseJson(taskIds: string[]): string {
  const tasks = taskIds.map((id, i) => ({
    task_id: id,
    eisenhower_quadrant: "urgent_important",
    suggested_priority: "high",
    estimated_duration_minutes: 30,
    next_action: "Commencer la redaction du rapport",
    reasoning: "Deadline proche, impact eleve.",
    risk_flag: false,
    suggested_order: i + 1,
  }));

  return JSON.stringify({
    tasks,
    summary: "Priorisation terminee.",
    conflict_warnings: [],
  });
}

// ---------------------------------------------------------------------------
// prompt-builder
// ---------------------------------------------------------------------------

describe("buildAnalysisPrompt", () => {
  const defaultInput = {
    tasks: [makeTask()],
    timezone: "Europe/Paris",
    currentDate: "2025-06-10T12:00:00.000Z",
  };

  it("retourne systemPrompt et userPrompt", () => {
    const result = buildAnalysisPrompt(defaultInput);
    expect(result).toHaveProperty("systemPrompt");
    expect(result).toHaveProperty("userPrompt");
    expect(typeof result.systemPrompt).toBe("string");
    expect(typeof result.userPrompt).toBe("string");
  });

  it("le userPrompt contient les titres des taches", () => {
    const { userPrompt } = buildAnalysisPrompt(defaultInput);
    expect(userPrompt).toContain("Faire le rapport");
  });

  it("le userPrompt contient la date et la timezone", () => {
    const { userPrompt } = buildAnalysisPrompt(defaultInput);
    expect(userPrompt).toContain("2025-06-10T12:00:00.000Z");
    expect(userPrompt).toContain("Europe/Paris");
  });

  it("les descriptions sont incluses si presentes", () => {
    const tasks = [makeTask({ description: "Description detaillee ici" })];
    const { userPrompt } = buildAnalysisPrompt({ ...defaultInput, tasks });
    expect(userPrompt).toContain("Description detaillee ici");
  });

  it("les descriptions ne figurent pas si vides", () => {
    const tasks = [makeTask({ description: "" })];
    const { userPrompt } = buildAnalysisPrompt({ ...defaultInput, tasks });
    expect(userPrompt).not.toContain("Description:");
  });

  it("les deadlines sont incluses si presentes", () => {
    const tasks = [makeTask({ dueDate: "2025-06-15" })];
    const { userPrompt } = buildAnalysisPrompt({ ...defaultInput, tasks });
    expect(userPrompt).toContain("2025-06-15");
  });

  it("affiche 'Pas de deadline' si aucune deadline", () => {
    const tasks = [makeTask({ dueDate: null })];
    const { userPrompt } = buildAnalysisPrompt({ ...defaultInput, tasks });
    expect(userPrompt).toContain("Pas de deadline");
  });

  it("fonctionne avec 1 tache", () => {
    const { userPrompt } = buildAnalysisPrompt(defaultInput);
    expect(userPrompt).toContain("1 tâches");
  });

  it("fonctionne avec 20 taches", () => {
    const tasks = Array.from({ length: 20 }, (_, i) =>
      makeTask({
        id: `550e8400-e29b-41d4-a716-4466554400${String(i).padStart(2, "0")}`,
        title: `Tache ${i + 1}`,
      })
    );
    const { userPrompt } = buildAnalysisPrompt({ ...defaultInput, tasks });
    expect(userPrompt).toContain("20 tâches");
    expect(userPrompt).toContain("Tache 1");
    expect(userPrompt).toContain("Tache 20");
  });

  it("le systemPrompt contient la date et timezone", () => {
    const { systemPrompt } = buildAnalysisPrompt(defaultInput);
    expect(systemPrompt).toContain("2025-06-10T12:00:00.000Z");
    expect(systemPrompt).toContain("Europe/Paris");
  });

  it("inclut estimatedMinutes si present", () => {
    const tasks = [makeTask({ estimatedMinutes: 60 })];
    const { userPrompt } = buildAnalysisPrompt({ ...defaultInput, tasks });
    expect(userPrompt).toContain("60 min");
  });
});

// ---------------------------------------------------------------------------
// response-parser — parseAnalysisResponse
// ---------------------------------------------------------------------------

describe("parseAnalysisResponse", () => {
  const taskId = "550e8400-e29b-41d4-a716-446655440000";

  it("parse un JSON valide", () => {
    const raw = makeValidResponseJson([taskId]);
    const result = parseAnalysisResponse(raw);
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].task_id).toBe(taskId);
    expect(result.summary).toBe("Priorisation terminee.");
  });

  it("parse un JSON valide entoure de texte", () => {
    const json = makeValidResponseJson([taskId]);
    const raw = `Voici le resultat:\n${json}\nFin.`;
    const result = parseAnalysisResponse(raw);
    expect(result.tasks).toHaveLength(1);
  });

  it("rejette un string sans JSON", () => {
    expect(() => parseAnalysisResponse("Pas de JSON ici")).toThrow(
      "No valid JSON found"
    );
  });

  it("rejette un JSON avec des champs manquants (Zod)", () => {
    const invalid = JSON.stringify({ tasks: [{ task_id: taskId }] });
    expect(() => parseAnalysisResponse(invalid)).toThrow();
  });

  it("rejette un quadrant invalide", () => {
    const raw = JSON.stringify({
      tasks: [
        {
          task_id: taskId,
          eisenhower_quadrant: "super_urgent",
          suggested_priority: "high",
          estimated_duration_minutes: 30,
          next_action: "Faire",
          reasoning: "Important",
          risk_flag: false,
          suggested_order: 1,
        },
      ],
      summary: "ok",
      conflict_warnings: [],
    });
    expect(() => parseAnalysisResponse(raw)).toThrow();
  });

  it("rejette une duree < 5", () => {
    const raw = JSON.stringify({
      tasks: [
        {
          task_id: taskId,
          eisenhower_quadrant: "urgent_important",
          suggested_priority: "high",
          estimated_duration_minutes: 2,
          next_action: "Faire",
          reasoning: "Important",
          risk_flag: false,
          suggested_order: 1,
        },
      ],
      summary: "ok",
      conflict_warnings: [],
    });
    expect(() => parseAnalysisResponse(raw)).toThrow();
  });

  it("rejette une duree > 480", () => {
    const raw = JSON.stringify({
      tasks: [
        {
          task_id: taskId,
          eisenhower_quadrant: "urgent_important",
          suggested_priority: "high",
          estimated_duration_minutes: 500,
          next_action: "Faire",
          reasoning: "Important",
          risk_flag: false,
          suggested_order: 1,
        },
      ],
      summary: "ok",
      conflict_warnings: [],
    });
    expect(() => parseAnalysisResponse(raw)).toThrow();
  });

  it("rejette un task_id non-UUID", () => {
    const raw = JSON.stringify({
      tasks: [
        {
          task_id: "not-a-uuid",
          eisenhower_quadrant: "urgent_important",
          suggested_priority: "high",
          estimated_duration_minutes: 30,
          next_action: "Faire",
          reasoning: "Important",
          risk_flag: false,
          suggested_order: 1,
        },
      ],
      summary: "ok",
      conflict_warnings: [],
    });
    expect(() => parseAnalysisResponse(raw)).toThrow();
  });

  it("detecte le contenu HTML/script malveillant", () => {
    const raw = JSON.stringify({
      tasks: [
        {
          task_id: taskId,
          eisenhower_quadrant: "urgent_important",
          suggested_priority: "high",
          estimated_duration_minutes: 30,
          next_action: '<script>alert("xss")</script>',
          reasoning: "Important",
          risk_flag: false,
          suggested_order: 1,
        },
      ],
      summary: "ok",
      conflict_warnings: [],
    });
    expect(() => parseAnalysisResponse(raw)).toThrow(
      "potentially malicious content"
    );
  });

  it("detecte une iframe malveillante", () => {
    const raw = JSON.stringify({
      tasks: [
        {
          task_id: taskId,
          eisenhower_quadrant: "urgent_important",
          suggested_priority: "high",
          estimated_duration_minutes: 30,
          next_action: '<iframe src="evil.com"></iframe>',
          reasoning: "Important",
          risk_flag: false,
          suggested_order: 1,
        },
      ],
      summary: "ok",
      conflict_warnings: [],
    });
    expect(() => parseAnalysisResponse(raw)).toThrow(
      "potentially malicious content"
    );
  });

  it("detecte javascript: dans le contenu", () => {
    const raw = JSON.stringify({
      tasks: [
        {
          task_id: taskId,
          eisenhower_quadrant: "urgent_important",
          suggested_priority: "high",
          estimated_duration_minutes: 30,
          next_action: "javascript:alert(1)",
          reasoning: "Important",
          risk_flag: false,
          suggested_order: 1,
        },
      ],
      summary: "ok",
      conflict_warnings: [],
    });
    expect(() => parseAnalysisResponse(raw)).toThrow(
      "potentially malicious content"
    );
  });
});

// ---------------------------------------------------------------------------
// response-parser — validateTaskIds
// ---------------------------------------------------------------------------

describe("validateTaskIds", () => {
  const id1 = "550e8400-e29b-41d4-a716-446655440001";
  const id2 = "550e8400-e29b-41d4-a716-446655440002";

  function makeResponse(ids: string[]): AnalysisResponse {
    return parseAnalysisResponse(makeValidResponseJson(ids));
  }

  it("retourne true si tous les IDs correspondent", () => {
    const response = makeResponse([id1, id2]);
    expect(validateTaskIds(response, [id1, id2])).toBe(true);
  });

  it("retourne true si les IDs valides sont un sur-ensemble", () => {
    const response = makeResponse([id1]);
    expect(validateTaskIds(response, [id1, id2])).toBe(true);
  });

  it("retourne false si un ID est inconnu", () => {
    const unknownId = "550e8400-e29b-41d4-a716-446655440099";
    const response = makeResponse([id1, unknownId]);
    expect(validateTaskIds(response, [id1, id2])).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// response-parser — validateUniqueOrders
// ---------------------------------------------------------------------------

describe("validateUniqueOrders", () => {
  const id1 = "550e8400-e29b-41d4-a716-446655440001";
  const id2 = "550e8400-e29b-41d4-a716-446655440002";

  it("retourne true si tous les ordres sont uniques", () => {
    const response = parseAnalysisResponse(makeValidResponseJson([id1, id2]));
    // makeValidResponseJson assigns order i+1 so [1, 2] — unique
    expect(validateUniqueOrders(response)).toBe(true);
  });

  it("retourne false si des ordres sont dupliques", () => {
    const raw = JSON.stringify({
      tasks: [
        {
          task_id: id1,
          eisenhower_quadrant: "urgent_important",
          suggested_priority: "high",
          estimated_duration_minutes: 30,
          next_action: "Faire A",
          reasoning: "A",
          risk_flag: false,
          suggested_order: 1,
        },
        {
          task_id: id2,
          eisenhower_quadrant: "important_not_urgent",
          suggested_priority: "medium",
          estimated_duration_minutes: 60,
          next_action: "Faire B",
          reasoning: "B",
          risk_flag: false,
          suggested_order: 1, // duplicate
        },
      ],
      summary: "ok",
      conflict_warnings: [],
    });
    const response = parseAnalysisResponse(raw);
    expect(validateUniqueOrders(response)).toBe(false);
  });
});
