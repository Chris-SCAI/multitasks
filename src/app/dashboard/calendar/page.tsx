"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useCalendar } from "@/hooks/useCalendar";
import { useTaskStore } from "@/stores/task-store";
import { useDomainStore } from "@/stores/domain-store";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";

function CalendarSkeleton({ view }: { view: "week" | "month" }) {
  const cols = 7;
  const rows = view === "week" ? 1 : 5;

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {Array.from({ length: cols * rows }, (_, i) => (
        <div
          key={i}
          className="min-h-[80px] skeleton-shimmer rounded-lg border border-[#1E293B] bg-[#151D2E] sm:min-h-[120px]"
        />
      ))}
    </div>
  );
}

export default function CalendarPage() {
  const {
    view,
    setView,
    navigateWeek,
    navigateMonth,
    goToToday,
    getWeekDays,
    getMonthDays,
    getTasksForDay,
    getDayLoad,
    getConflicts,
    updateTaskDeadline,
    weekLabel,
    monthLabel,
  } = useCalendar();

  const tasksLoading = useTaskStore((s) => s.isLoading);
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const domainsLoading = useDomainStore((s) => s.isLoading);
  const loadDomains = useDomainStore((s) => s.loadDomains);
  const domains = useDomainStore((s) => s.domains);

  useEffect(() => {
    loadTasks();
    loadDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = tasksLoading || domainsLoading;
  const label = view === "week" ? weekLabel : monthLabel;
  const onNavigate = view === "week" ? navigateWeek : navigateMonth;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-600/20">
          <Calendar className="size-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Calendrier
          </h1>
          <p className="text-sm text-neutral-300">
            Visualisez vos tâches par semaine ou par mois
          </p>
        </div>
      </div>

      <CalendarHeader
        view={view}
        label={label}
        onViewChange={setView}
        onNavigate={onNavigate}
        onToday={goToToday}
      />

      {!isLoading && getWeekDays().every(day => getTasksForDay(day.date).length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1E293B] py-12 text-center">
          <svg className="mb-4 size-16 text-violet-400/50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="12" width="48" height="44" rx="4" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="24" x2="56" y2="24" stroke="currentColor" strokeWidth="2"/>
            <circle cx="24" cy="38" r="3" fill="currentColor" opacity="0.3"/>
            <circle cx="40" cy="38" r="3" fill="currentColor" opacity="0.3"/>
            <circle cx="32" cy="48" r="3" fill="currentColor" opacity="0.3"/>
          </svg>
          <h3 className="mb-1 text-lg font-semibold text-white">Aucune deadline cette semaine</h3>
          <p className="text-sm text-neutral-400">Ajoutez des deadlines à vos tâches pour les voir ici</p>
        </div>
      )}

      {isLoading ? (
        <CalendarSkeleton view={view} />
      ) : (
        <AnimatePresence mode="wait">
          {view === "week" ? (
            <motion.div
              key="week"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CalendarWeek
                days={getWeekDays()}
                getTasksForDay={getTasksForDay}
                getDayLoad={getDayLoad}
                getConflicts={getConflicts}
                updateTaskDeadline={updateTaskDeadline}
                domains={domains}
              />
            </motion.div>
          ) : (
            <motion.div
              key="month"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CalendarMonth
                days={getMonthDays()}
                getTasksForDay={getTasksForDay}
                getDayLoad={getDayLoad}
                getConflicts={getConflicts}
                domains={domains}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
