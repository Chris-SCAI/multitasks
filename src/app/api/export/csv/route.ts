import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/get-api-user";
import { isFeatureAvailable } from "@/lib/stripe/plans";
import { generateTasksCSV } from "@/lib/export/csv-generator";
import { mapTaskFromDb, type DbTask } from "@/lib/db/field-mapper";

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
    const { data: dbTasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        JSON.stringify({
          action: "csv_export",
          error: error.message,
          timestamp: new Date().toISOString(),
        })
      );
      return NextResponse.json(
        { error: "Erreur lors de la récupération des tâches" },
        { status: 500 }
      );
    }

    // Mapper les résultats DB → format client
    const tasks = (dbTasks as DbTask[]).map(mapTaskFromDb);

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "Aucune tâche à exporter" },
        { status: 404 }
      );
    }

    // Générer le CSV
    const csv = generateTasksCSV(tasks);

    // Générer le nom de fichier avec la date
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const filename = `multitasks-export-${dateStr}.csv`;

    // Retourner le CSV avec les headers appropriés
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        action: "csv_export",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    );
    return NextResponse.json(
      { error: "Erreur lors de l'export CSV" },
      { status: 500 }
    );
  }
}
