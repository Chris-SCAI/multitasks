import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser } from "@/lib/auth/get-api-user";
import { isFeatureAvailable } from "@/lib/stripe/plans";
import {
  mapTaskFromDb,
  mapDomainFromDb,
  type DbTask,
  type DbDomain,
} from "@/lib/db/field-mapper";

const pullRequestSchema = z.object({
  lastSyncAt: z.string().nullable(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Auth via session Supabase
    const auth = await getApiUser();
    if (!auth.ok) return auth.response;

    const { user, supabase, plan } = auth.data;

    // Vérification du plan Pro
    if (!isFeatureAvailable(plan, "sync")) {
      return NextResponse.json(
        { error: "Cette fonctionnalité nécessite un abonnement Pro" },
        { status: 403 }
      );
    }

    // Validation des entrées
    const body: unknown = await request.json();
    const validated = pullRequestSchema.parse(body);

    // Récupérer les tâches
    let taskQuery = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id);

    if (validated.lastSyncAt) {
      taskQuery = taskQuery.gt("updated_at", validated.lastSyncAt);
    }

    const { data: dbTasks, error: taskError } = await taskQuery;

    if (taskError) {
      console.error(
        JSON.stringify({
          action: "sync_pull_tasks",
          error: taskError.message,
        })
      );
      return NextResponse.json(
        { error: "Erreur lors de la récupération des tâches" },
        { status: 500 }
      );
    }

    // Récupérer les domaines
    let domainQuery = supabase
      .from("domains")
      .select("*")
      .eq("user_id", user.id);

    if (validated.lastSyncAt) {
      domainQuery = domainQuery.gt("updated_at", validated.lastSyncAt);
    }

    const { data: dbDomains, error: domainError } = await domainQuery;

    if (domainError) {
      console.error(
        JSON.stringify({
          action: "sync_pull_domains",
          error: domainError.message,
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
