"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { isFeatureAvailable } from "@/lib/stripe/plans";
import { PlanBadge } from "./PlanBadge";

type GatedFeature = "sync" | "export" | "month_calendar";

interface FeatureGateProps {
  feature: GatedFeature;
  children: React.ReactNode;
  requiredPlan?: "ia_quotidienne" | "pro_sync";
}

const featurePlanMap: Record<GatedFeature, "ia_quotidienne" | "pro_sync"> = {
  sync: "pro_sync",
  export: "pro_sync",
  month_calendar: "ia_quotidienne",
};

const featureLabel: Record<GatedFeature, string> = {
  sync: "Sync cloud",
  export: "Export CSV + PDF",
  month_calendar: "Vue mensuelle",
};

export function FeatureGate({ feature, children, requiredPlan }: FeatureGateProps) {
  const currentPlan = useSubscriptionStore((s) => s.currentPlan);
  const available = isFeatureAvailable(currentPlan, feature);

  if (available) {
    return <>{children}</>;
  }

  const required = requiredPlan ?? featurePlanMap[feature];

  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-50 blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#0B1120]/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Lock className="size-5 text-neutral-500" />
          <PlanBadge planId={required} size="md" />
        </div>
        <p className="text-center text-base font-medium text-neutral-300">
          Disponible avec le plan{" "}
          {required === "pro_sync" ? "Pro Sync" : "IA Quotidienne"}
        </p>
        <Button
          size="sm"
          className="bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600"
          onClick={() => {
            window.location.href = "/dashboard/pricing";
          }}
        >
          Débloquer
        </Button>
      </div>
    </div>
  );
}
