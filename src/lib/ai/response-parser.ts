import { z } from "zod";

const taskAnalysisSchema = z.object({
  task_id: z.string().uuid(),
  eisenhower_quadrant: z.enum([
    "urgent_important",
    "important_not_urgent",
    "urgent_not_important",
    "not_urgent_not_important",
  ]),
  suggested_priority: z.enum(["urgent", "high", "medium", "low"]),
  estimated_duration_minutes: z.number().int().min(5).max(480),
  next_action: z.string().max(300),
  reasoning: z.string(),
  risk_flag: z.boolean(),
  suggested_order: z.number().int().min(1),
});

const analysisResponseSchema = z.object({
  tasks: z.array(taskAnalysisSchema).min(1).max(20),
  summary: z.string(),
  conflict_warnings: z.array(z.string()),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
export type TaskAnalysisResult = z.infer<typeof taskAnalysisSchema>;

export function parseAnalysisResponse(rawResponse: string): AnalysisResponse {
  const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No valid JSON found in AI response");
  }

  const parsed: unknown = JSON.parse(jsonMatch[0]);

  // Reject if response contains HTML or script tags (prompt injection protection)
  const jsonStr = JSON.stringify(parsed);
  if (/<script|<\/script|<iframe|javascript:/i.test(jsonStr)) {
    throw new Error("Response contains potentially malicious content");
  }

  return analysisResponseSchema.parse(parsed);
}

export function validateTaskIds(
  response: AnalysisResponse,
  validTaskIds: string[]
): boolean {
  return response.tasks.every((t) => validTaskIds.includes(t.task_id));
}

export function validateUniqueOrders(response: AnalysisResponse): boolean {
  const orders = response.tasks.map((t) => t.suggested_order);
  return new Set(orders).size === orders.length;
}
