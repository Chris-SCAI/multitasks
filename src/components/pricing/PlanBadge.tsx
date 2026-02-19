"use client";

import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  planId: "free" | "etudiant" | "pro" | "equipe" | string;
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

  if (planId === "etudiant") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full font-semibold",
          "bg-emerald-900/30 text-emerald-400",
          sizeClasses
        )}
      >
        Étudiant
      </span>
    );
  }

  if (planId === "equipe") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full font-semibold",
          "bg-blue-900/30 text-blue-400",
          sizeClasses
        )}
      >
        Équipe
      </span>
    );
  }

  // Pro (default for pro and any unknown)
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
