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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Récupérer l'utilisateur initial
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) syncToLocalStorage(user);
      setIsLoading(false);
    });

    // Écouter les changements d'auth (login, logout, token refresh, magic link)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        syncToLocalStorage(newUser);
      } else {
        clearAuthLocalStorage();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    clearAuthLocalStorage();
    router.push("/login");
  }, [router]);

  const displayName = user?.user_metadata?.display_name ?? null;
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

function syncToLocalStorage(user: User) {
  const name = user.user_metadata?.display_name;
  if (name) localStorage.setItem("displayName", name);
  if (user.email) localStorage.setItem("multitasks-user-email", user.email);
}

function clearAuthLocalStorage() {
  localStorage.removeItem("displayName");
  localStorage.removeItem("multitasks-user-email");
}
