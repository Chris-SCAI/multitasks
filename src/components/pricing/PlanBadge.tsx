"use client";

import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  planId: "free" | "ia_quotidienne" | "pro_sync";
  size?: "sm" | "md";
}

export function PlanBadge({ planId, size = "sm" }: PlanBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  if (planId === "free") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full font-semibold",
          "bg-neutral-700 text-neutral-300",
          sizeClasses
        )}
      >
        Gratuit
      </span>
    );
  }

  if (planId === "ia_quotidienne") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full font-semibold",
          "bg-blue-900/30 text-blue-400",
          sizeClasses
        )}
      >
        IA Quotidienne
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-flex items-center overflow-hidden rounded-full font-semibold text-white",
        "bg-gradient-to-r from-violet-500 to-blue-500",
        sizeClasses
      )}
    >
      <span className="relative z-10">Pro</span>
      <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </span>
  );
}
