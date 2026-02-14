import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { isFeatureAvailable } from "@/lib/stripe/plans";
import type { DBTask, DBDomain } from "@/lib/db/local";

const pullRequestSchema = z.object({
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
    const userPlan = request.headers.get("x-plan") || "free";
    if (!isFeatureAvailable(userPlan, "sync")) {
      return NextResponse.json(
        { error: "Cette fonctionnalité nécessite un abonnement Pro" },
        { status: 403 }
      );
    }

    // Validation des entrées
    const body: unknown = await request.json();
    const validated = pullRequestSchema.parse(body);

    // Vérifier si Supabase est configuré
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Service de synchronisation non disponible" },
        { status: 503 }
      );
    }

    // Stub : retourner des données vides car Supabase n'est pas configuré
    const domains: DBDomain[] = [];
    const tasks: DBTask[] = [];

    return NextResponse.json({
      tasks,
      domains,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    console.error("Pull sync error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la synchronisation" },
      { status: 500 }
    );
  }
}
