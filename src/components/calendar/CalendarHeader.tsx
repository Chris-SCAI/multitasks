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
          className="size-9 border-[#1E293B] text-white hover:border-violet-500/50 hover:text-violet-400 transition-all duration-200"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(1)}
          aria-label="Suivant"
          className="size-9 border-[#1E293B] text-white hover:border-violet-500/50 hover:text-violet-400 transition-all duration-200"
        >
          <ChevronRight className="size-4" />
        </Button>
        <h2 className="text-lg font-bold text-white sm:text-xl">
          {label}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="text-sm border-[#1E293B] text-white hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400 transition-all duration-200"
        >
          Aujourd&apos;hui
        </Button>
        <Tabs
          value={view}
          onValueChange={(v) => onViewChange(v as CalendarView)}
        >
          <TabsList className="h-9 bg-[#151D2E] border border-[#1E293B]">
            <TabsTrigger value="week" className="px-3 text-sm text-neutral-300 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/30 data-[state=active]:to-blue-600/20 data-[state=active]:text-white data-[state=active]:shadow-sm">
              Semaine
            </TabsTrigger>
            <TabsTrigger value="month" className="px-3 text-sm text-neutral-300 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/30 data-[state=active]:to-blue-600/20 data-[state=active]:text-white data-[state=active]:shadow-sm">
              Mois
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
