"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminEmail } from "@/lib/admin/admin-config";
import { useAuth } from "@/hooks/useAuth";

export function useAdminGuard() {
  const router = useRouter();
  const { email: authEmail, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const admins = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";

    if (admins.includes("*")) {
      setIsAdmin(true);
      setIsLoading(false);
      return;
    }

    // Priorité : email Supabase > localStorage
    const email = authEmail ?? localStorage.getItem("multitasks-user-email");

    if (isAdminEmail(email)) {
      setIsAdmin(true);
    } else {
      router.push("/dashboard");
    }

    setIsLoading(false);
  }, [authEmail, authLoading, router]);

  return { isAdmin, isLoading, userEmail: authEmail };
}
