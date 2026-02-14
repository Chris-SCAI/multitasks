import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildAnalysisPrompt } from "@/lib/ai/prompt-builder";
import {
  parseAnalysisResponse,
  validateTaskIds,
} from "@/lib/ai/response-parser";
import { checkQuota, incrementQuota } from "@/lib/quotas/checker";

const taskInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  domainId: z.string(),
  tags: z.array(z.string()),
  dueDate: z.string().nullable(),
  estimatedMinutes: z.number().nullable(),
  actualMinutes: z.number().nullable(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().nullable(),
});

const requestBodySchema = z.object({
  tasks: z.array(taskInputSchema).min(1).max(20),
});

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI analysis not configured. Set ANTHROPIC_API_KEY." },
        { status: 503 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parseResult = requestBodySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { tasks } = parseResult.data;

    const quota = checkQuota();
    if (!quota.allowed) {
      return NextResponse.json(
        { error: quota.message },
        { status: 429 }
      );
    }

    const { systemPrompt, userPrompt } = buildAnalysisPrompt({
      tasks,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentDate: new Date().toISOString().split("T")[0],
    });

    const client = new Anthropic({ apiKey });
    const startTime = Date.now();

    const callAnthropic = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);
      try {
        return await client.messages.create(
          {
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            temperature: 0.1,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          },
          { signal: controller.signal }
        );
      } finally {
        clearTimeout(timeout);
      }
    };

    let message: Anthropic.Message;
    try {
      message = await callAnthropic();
    } catch {
      try {
        message = await callAnthropic();
      } catch (retryError) {
        if (
          retryError instanceof Error &&
          retryError.name === "AbortError"
        ) {
          return NextResponse.json(
            { error: "L'analyse a pris trop de temps. Veuillez réessayer." },
            { status: 504 }
          );
        }
        return NextResponse.json(
          { error: "Analysis failed. Please try again." },
          { status: 500 }
        );
      }
    }

    const durationMs = Date.now() - startTime;
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const tokensUsed =
      message.usage.input_tokens + message.usage.output_tokens;

    const analysis = parseAnalysisResponse(responseText);
    const validIds = tasks.map((t) => t.id);

    if (!validateTaskIds(analysis, validIds)) {
      return NextResponse.json(
        { error: "AI returned invalid task IDs" },
        { status: 500 }
      );
    }

    incrementQuota();

    return NextResponse.json({
      analysis,
      metadata: {
        tokensUsed,
        durationMs,
        model: "claude-sonnet-4-20250514",
        taskCount: tasks.length,
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "AI response did not match expected format" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
