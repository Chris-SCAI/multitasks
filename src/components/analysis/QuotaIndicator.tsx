"use client";

import { cn } from "@/lib/utils";

interface QuotaIndicatorProps {
  used: number;
  limit: number;
  plan: "free" | "etudiant" | "pro" | "equipe" | string;
}

export function QuotaIndicator({ used, limit, plan }: QuotaIndicatorProps) {
  const remaining = Math.max(0, limit - used);
  const isUnlimited = plan === "equipe" && limit >= 9999;
  const isLow = remaining <= 2 && !isUnlimited;
  const isExhausted = remaining === 0 && !isUnlimited;
  const percentage = isUnlimited ? 100 : Math.round((remaining / limit) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="mb-1.5 flex items-center justify-between text-base">
          <span className="font-medium text-neutral-300">
            {isUnlimited
              ? "Analyses illimitées"
              : `${remaining}/${limit} analyses restantes`}
          </span>
          {isExhausted && (
            <button
              type="button"
              className="text-base font-semibold text-violet-400"
            >
              Débloquer
            </button>
          )}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E293B]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isExhausted
                ? "bg-red-500"
                : isLow
                  ? "animate-pulse bg-violet-500"
                  : "bg-gradient-to-r from-violet-500 to-blue-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
