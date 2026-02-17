import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/supabase-server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

interface ApiUserSuccess {
  user: User;
  supabase: SupabaseClient;
  plan: string;
}

type ApiUserResult =
  | { ok: true; data: ApiUserSuccess }
  | { ok: false; response: NextResponse };

/**
 * Vérifie l'authentification via la session Supabase (cookies)
 * et récupère le plan de l'utilisateur depuis profiles.
 * Réutilisable par toutes les routes API (sync, export).
 */
export async function getApiUser(): Promise<ApiUserResult> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Service non disponible" },
        { status: 503 }
      ),
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      ),
    };
  }

  // Récupérer le plan depuis la table profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";

  return {
    ok: true,
    data: { user, supabase, plan },
  };
}
