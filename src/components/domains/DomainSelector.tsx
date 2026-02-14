"use client";

import type { Domain } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DomainSelectorProps {
  domains: Domain[];
  value: string;
  onChange: (value: string) => void;
}

export function DomainSelector({
  domains,
  value,
  onChange,
}: DomainSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
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
