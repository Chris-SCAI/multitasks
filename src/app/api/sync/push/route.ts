import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getApiUser } from "@/lib/auth/get-api-user";
import { isFeatureAvailable } from "@/lib/stripe/plans";
import { mapTaskToDb, mapDomainToDb } from "@/lib/db/field-mapper";

const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200),
  description: z.string().max(2000),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  domainId: z.string().uuid().nullable(),
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
    const validated = pushRequestSchema.parse(body);

    let conflicts = 0;

    // Upsert des domaines
    if (validated.domains.length > 0) {
      const dbDomains = validated.domains.map((d) =>
        mapDomainToDb(d, user.id)
      );

      // Détection de conflits : vérifier les updated_at côté DB
      if (validated.lastSyncAt) {
        const { data: existing } = await supabase
          .from("domains")
          .select("id, updated_at")
          .eq("user_id", user.id)
          .in(
            "id",
            dbDomains.map((d) => d.id)
          );

        if (existing) {
          const existingMap = new Map(
            existing.map((e) => [e.id, e.updated_at])
          );
          for (const d of dbDomains) {
            const serverUpdatedAt = existingMap.get(d.id);
            if (
              serverUpdatedAt &&
              new Date(serverUpdatedAt) > new Date(d.updated_at)
            ) {
              conflicts++;
            }
          }
        }
      }

      const { error: domainError } = await supabase
        .from("domains")
        .upsert(dbDomains, { onConflict: "id" });

      if (domainError) {
        console.error(
          JSON.stringify({
            action: "sync_push_domains",
            error: domainError.message,
          })
        );
        return NextResponse.json(
          { error: "Erreur lors de la synchronisation des domaines" },
          { status: 500 }
        );
      }
    }

    // Upsert des tâches
    if (validated.tasks.length > 0) {
      const dbTasks = validated.tasks.map((t) => mapTaskToDb(t, user.id));

      // Détection de conflits
      if (validated.lastSyncAt) {
        const { data: existing } = await supabase
          .from("tasks")
          .select("id, updated_at")
          .eq("user_id", user.id)
          .in(
            "id",
            dbTasks.map((t) => t.id)
          );

        if (existing) {
          const existingMap = new Map(
            existing.map((e) => [e.id, e.updated_at])
          );
          for (const t of dbTasks) {
            const serverUpdatedAt = existingMap.get(t.id);
            if (
              serverUpdatedAt &&
              new Date(serverUpdatedAt) > new Date(t.updated_at)
            ) {
              conflicts++;
            }
          }
        }
      }

      const { error: taskError } = await supabase
        .from("tasks")
        .upsert(dbTasks, { onConflict: "id" });

      if (taskError) {
        console.error(
          JSON.stringify({
            action: "sync_push_tasks",
            error: taskError.message,
          })
        );
        return NextResponse.json(
          { error: "Erreur lors de la synchronisation des tâches" },
          { status: 500 }
        );
      }
    }

    const pushed = validated.tasks.length + validated.domains.length;

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
