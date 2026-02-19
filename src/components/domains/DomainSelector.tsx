"use client";

import type { Domain } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DomainSelectorProps {
  domains: Domain[];
  value: string;
  onChange: (value: string) => void;
  triggerClassName?: string;
}

export function DomainSelector({
  domains,
  value,
  onChange,
  triggerClassName,
}: DomainSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder="Choisir un domaine" />
      </SelectTrigger>
      <SelectContent>
        {domains.map((domain) => (
          <SelectItem key={domain.id} value={domain.id}>
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: domain.color }}
              />
              {domain.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
