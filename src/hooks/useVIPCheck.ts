"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/stores/admin-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { VIP_PLAN } from "@/lib/admin/admin-config";

export function useVIPCheck(email: string | null) {
  const isVIP = useAdminStore((s) => s.isVIP);
  const setPlan = useSubscriptionStore((s) => s.setPlan);

  useEffect(() => {
    if (email && isVIP(email)) {
      setPlan(VIP_PLAN);
    }
  }, [email, isVIP, setPlan]);
}
