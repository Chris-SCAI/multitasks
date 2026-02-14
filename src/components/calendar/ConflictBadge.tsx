"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ConflictInfo } from "@/hooks/useCalendar";

interface ConflictBadgeProps {
  conflict: ConflictInfo;
  size?: "sm" | "md";
}

export function ConflictBadge({ conflict, size = "sm" }: ConflictBadgeProps) {
  if (!conflict.hasConflict) return null;

  const isOverloaded = conflict.reason === "overloaded";

  const tooltipText = isOverloaded
    ? `Journée surchargée : ${Math.round(conflict.totalMinutes / 60)}h estimées (${conflict.taskCount} tâches)`
    : `${conflict.taskCount} tâches avec deadline ce jour`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full animate-pulse",
              isOverloaded
                ? "bg-red-900/30 text-red-400"
                : "bg-orange-900/30 text-orange-400",
              size === "sm" && "size-5",
              size === "md" && "size-6"
            )}
          >
            <AlertTriangle
              className={cn(
                size === "sm" && "size-3",
                size === "md" && "size-3.5"
              )}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
