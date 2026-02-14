import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import { isFeatureAvailable } from "@/lib/stripe/plans";
import { generateTasksPDF } from "@/lib/export/pdf-generator";
import type { Task } from "@/types/task";
import type { Domain } from "@/types/domain";
import type { AnalysisResponse } from "@/lib/ai/response-parser";

const uuidSchema = z.string().uuid();

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Vérification de l'utilisateur (stub avec header)
    const userId = request.headers.get("x-user-id");
    if (!userId || !uuidSchema.safeParse(userId).success) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérification du plan Pro
    const userPlan = request.headers.get("x-plan") || "free";
    if (!isFeatureAvailable(userPlan, "export")) {
      return NextResponse.json(
        { error: "Cette fonctionnalité nécessite un abonnement Pro" },
        { status: 403 }
      );
    }

    // Vérifier si Supabase est configuré
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Service d'export non disponible" },
        { status: 503 }
      );
    }

    // Stub : données vides car Supabase n'est pas configuré
    const tasks: Task[] = [];
    const domains: Domain[] = [];

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Aucune tâche à exporter" },
        { status: 404 }
      );
    }

    const analysisResult: AnalysisResponse | undefined = undefined;

    // Générer le HTML/PDF
    const html = generateTasksPDF({
      tasks,
      domains,
      analysisResult,
    });

    // Générer le nom de fichier avec la date
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const filename = `multitasks-rapport-${dateStr}.html`;

    // Retourner le HTML avec les headers appropriés
    // Le client pourra utiliser window.print() ou une lib PDF côté client
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(JSON.stringify({ action: "pdf_export", error: error instanceof Error ? error.message : "Unknown error", timestamp: new Date().toISOString() }));
    return NextResponse.json(
      { error: "Erreur lors de l'export PDF" },
      { status: 500 }
    );
  }
}
