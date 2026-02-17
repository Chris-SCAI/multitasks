"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/supabase-client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  displayName: string | null;
  email: string | null;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Récupérer l'utilisateur initial
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        syncToLocalStorage(user);
        // Fallback : chercher display_name dans la table profiles
        const metaName = getMetadataName(user);
        if (!metaName) {
          const name = await fetchProfileName(supabase, user.id);
          if (name) {
            setProfileName(name);
            localStorage.setItem("displayName", name);
          }
        }
      }
      setIsLoading(false);
    });

    // Écouter les changements d'auth (login, logout, token refresh, magic link)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        syncToLocalStorage(newUser);
        const metaName = getMetadataName(newUser);
        if (!metaName) {
          const name = await fetchProfileName(supabase, newUser.id);
          if (name) {
            setProfileName(name);
            localStorage.setItem("displayName", name);
          }
        }
      } else {
        setProfileName(null);
        clearAuthLocalStorage();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient();
      if (!supabase) return;
      await supabase.auth.signOut();
    } catch {
      // Continuer même si signOut échoue côté Supabase
    }
    clearAuthLocalStorage();
    window.location.href = "/login";
  }, []);

  const displayName =
    getMetadataName(user) ??
    profileName ??
    null;
  const email = user?.email ?? null;

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    displayName,
    email,
    signOut,
  };
}

function getMetadataName(user: User | null): string | null {
  if (!user) return null;
  return (
    user.user_metadata?.display_name ??
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    null
  );
}

async function fetchProfileName(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();
  return data?.display_name ?? null;
}

function syncToLocalStorage(user: User) {
  const name = getMetadataName(user);
  if (name) localStorage.setItem("displayName", name);
  if (user.email) localStorage.setItem("multitasks-user-email", user.email);
}

function clearAuthLocalStorage() {
  localStorage.removeItem("displayName");
  localStorage.removeItem("multitasks-user-email");
}
