import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/get-api-user";
import { isFeatureAvailable } from "@/lib/stripe/plans";
import { generateTasksPDF } from "@/lib/export/pdf-generator";
import {
  mapTaskFromDb,
  mapDomainFromDb,
  type DbTask,
  type DbDomain,
} from "@/lib/db/field-mapper";
import type { AnalysisResponse } from "@/lib/ai/response-parser";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Auth via session Supabase
    const auth = await getApiUser();
    if (!auth.ok) return auth.response;

    const { user, supabase, plan } = auth.data;

    // Vérification du plan Pro
    if (!isFeatureAvailable(plan, "export")) {
      return NextResponse.json(
        { error: "Cette fonctionnalité nécessite un abonnement Pro" },
        { status: 403 }
      );
    }

    // Récupérer les tâches de l'utilisateur
    const { data: dbTasks, error: taskError } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true });

    if (taskError) {
      console.error(
        JSON.stringify({
          action: "pdf_export",
          error: taskError.message,
          timestamp: new Date().toISOString(),
        })
      );
      return NextResponse.json(
        { error: "Erreur lors de la récupération des tâches" },
        { status: 500 }
      );
    }

    // Récupérer les domaines de l'utilisateur
    const { data: dbDomains, error: domainError } = await supabase
      .from("domains")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true });

    if (domainError) {
      console.error(
        JSON.stringify({
          action: "pdf_export",
          error: domainError.message,
          timestamp: new Date().toISOString(),
        })
      );
      return NextResponse.json(
        { error: "Erreur lors de la récupération des domaines" },
        { status: 500 }
      );
    }

    // Mapper les résultats DB → format client
    const tasks = (dbTasks as DbTask[]).map(mapTaskFromDb);
    const domains = (dbDomains as DbDomain[]).map(mapDomainFromDb);

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Aucune tâche à exporter" },
        { status: 404 }
      );
    }

    // Récupérer la dernière analyse (optionnelle)
    let analysisResult: AnalysisResponse | undefined;
    const { data: latestAnalysis } = await supabase
      .from("analyses")
      .select("results")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (latestAnalysis?.results) {
      analysisResult = latestAnalysis.results as AnalysisResponse;
    }

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
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        action: "pdf_export",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    );
    return NextResponse.json(
      { error: "Erreur lors de l'export PDF" },
      { status: 500 }
    );
  }
}
