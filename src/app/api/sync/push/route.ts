import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { isFeatureAvailable } from "@/lib/stripe/plans";

const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200),
  description: z.string().max(2000),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  domainId: z.string().uuid(),
  tags: z.array(z.string()),
  dueDate: z.string().nullable(),
  estimatedMinutes: z.number().nullable(),
  actualMinutes: z.number().nullable(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().nullable(),
});

const domainSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string(),
  description: z.string(),
  isDefault: z.boolean(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const pushRequestSchema = z.object({
  tasks: z.array(taskSchema),
  domains: z.array(domainSchema),
  lastSyncAt: z.string().nullable(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Vérification de l'utilisateur (stub avec header)
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérification du plan Pro
    // Dans un vrai environnement, récupérer le plan depuis la DB
    // Pour l'instant, stub : si pas de header x-plan, on considère free
    const userPlan = request.headers.get("x-plan") || "free";
    if (!isFeatureAvailable(userPlan, "sync")) {
      return NextResponse.json(
        { error: "Cette fonctionnalité nécessite un abonnement Pro" },
        { status: 403 }
      );
    }

    // Validation des entrées
    const body: unknown = await request.json();
    const validated = pushRequestSchema.parse(body);

    // Vérifier si Supabase est configuré
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Service de synchronisation non disponible" },
        { status: 503 }
      );
    }

    // Stub : Supabase n'est pas configuré, donc on simule le succès
    const pushed = validated.tasks.length + validated.domains.length;
    const conflicts = 0;

    return NextResponse.json({
      pushed,
      conflicts,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Push sync error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la synchronisation" },
      { status: 500 }
    );
  }
}
