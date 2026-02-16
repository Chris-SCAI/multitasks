"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminEmail } from "@/lib/admin/admin-config";

export function useAdminGuard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const admins = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";

    if (admins.includes("*")) {
      setIsAdmin(true);
      setUserEmail("*");
      setIsLoading(false);
      return;
    }

    const storedEmail = localStorage.getItem("multitasks-user-email");
    setUserEmail(storedEmail);

    if (isAdminEmail(storedEmail)) {
      setIsAdmin(true);
    } else {
      router.push("/dashboard");
    }

    setIsLoading(false);
  }, [router]);

  return { isAdmin, isLoading, userEmail };
}
