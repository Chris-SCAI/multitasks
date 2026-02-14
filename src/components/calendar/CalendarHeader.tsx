"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CalendarView } from "@/hooks/useCalendar";

interface CalendarHeaderProps {
  view: CalendarView;
  label: string;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: 1 | -1) => void;
  onToday: () => void;
}

export function CalendarHeader({
  view,
  label,
  onViewChange,
  onNavigate,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(-1)}
          aria-label="Précédent"
          className="size-8 border-[#1E293B] text-white hover:bg-[#1C2640]"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(1)}
          aria-label="Suivant"
          className="size-8 border-[#1E293B] text-white hover:bg-[#1C2640]"
        >
          <ChevronRight className="size-4" />
        </Button>
        <h2 className="text-base font-semibold text-white sm:text-lg">
          {label}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-sm border-[#1E293B] text-white hover:bg-[#1C2640]"
        >
          Aujourd&apos;hui
        </Button>
        <Tabs
          value={view}
          onValueChange={(v) => onViewChange(v as CalendarView)}
        >
          <TabsList className="h-8 bg-[#0B1120] border border-[#1E293B]">
            <TabsTrigger value="week" className="px-3 text-sm text-neutral-300 data-[state=active]:bg-[#1C2640] data-[state=active]:text-white">
              Semaine
            </TabsTrigger>
            <TabsTrigger value="month" className="px-3 text-sm text-neutral-300 data-[state=active]:bg-[#1C2640] data-[state=active]:text-white">
              Mois
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
