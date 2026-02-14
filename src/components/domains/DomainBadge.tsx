"use client";

import { cn } from "@/lib/utils";
import { sanitizeText } from "@/lib/sanitize";
import type { Domain } from "@/types";

interface DomainBadgeProps {
  domain?: Domain;
  name?: string;
  color?: string;
  size?: "sm" | "md";
}

export function DomainBadge({
  domain,
  name,
  color,
  size = "sm",
}: DomainBadgeProps) {
  const displayName = domain?.name ?? name ?? "";
  const displayColor = domain?.color ?? color ?? "#94A3B8";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" && "px-2 py-0.5 text-sm",
        size === "md" && "px-3 py-1 text-base"
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full",
          size === "sm" && "size-2",
          size === "md" && "size-2.5"
        )}
        style={{ backgroundColor: displayColor }}
      />
      <span className="text-neutral-300">{sanitizeText(displayName)}</span>
    </span>
  );
}
