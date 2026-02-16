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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25">
          <Calendar className="size-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Calendrier
          </h1>
          <p className="text-lg text-neutral-300">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1E293B] py-16 text-center overflow-hidden"
        >
          {/* Ambient glow orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 left-1/4 size-32 rounded-full bg-violet-600/10 blur-[60px]" />
            <div className="absolute bottom-1/4 right-1/4 size-28 rounded-full bg-blue-600/10 blur-[50px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-24 rounded-full bg-purple-600/8 blur-[40px]" />
          </div>

          <svg className="relative mb-8 w-[18rem] h-auto" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Calendar body */}
            <rect x="30" y="30" width="140" height="110" rx="12" stroke="#7C3AED" strokeWidth="2" opacity="0.4" />
            <rect x="30" y="30" width="140" height="28" rx="12" fill="#7C3AED" opacity="0.1" />
            <line x1="30" y1="58" x2="170" y2="58" stroke="#7C3AED" strokeWidth="1" opacity="0.3" />
            {/* Calendar header dots */}
            <circle cx="60" cy="44" r="3" fill="#7C3AED" opacity="0.5" />
            <circle cx="100" cy="44" r="3" fill="#3B82F6" opacity="0.5" />
            <circle cx="140" cy="44" r="3" fill="#7C3AED" opacity="0.5" />
            {/* Grid lines */}
            <line x1="65" y1="58" x2="65" y2="140" stroke="#1E293B" strokeWidth="1" />
            <line x1="100" y1="58" x2="100" y2="140" stroke="#1E293B" strokeWidth="1" />
            <line x1="135" y1="58" x2="135" y2="140" stroke="#1E293B" strokeWidth="1" />
            <line x1="30" y1="85" x2="170" y2="85" stroke="#1E293B" strokeWidth="1" />
            <line x1="30" y1="112" x2="170" y2="112" stroke="#1E293B" strokeWidth="1" />
            {/* Colored task blocks */}
            <rect x="72" y="65" width="22" height="8" rx="2" fill="#7C3AED" opacity="0.3" className="animate-pulse" />
            <rect x="107" y="90" width="22" height="8" rx="2" fill="#3B82F6" opacity="0.3" className="animate-pulse" style={{ animationDelay: "0.5s" }} />
            <rect x="37" y="118" width="22" height="8" rx="2" fill="#7C3AED" opacity="0.3" className="animate-pulse" style={{ animationDelay: "1s" }} />
            {/* Floating elements */}
            <circle cx="185" cy="25" r="4" fill="#7C3AED" opacity="0.2" className="animate-float" />
            <circle cx="15" cy="80" r="3" fill="#3B82F6" opacity="0.2" className="animate-float-delayed" />
            {/* Plus cursor */}
            <g className="animate-float">
              <circle cx="145" cy="105" r="10" fill="#7C3AED" opacity="0.15" />
              <line x1="145" y1="100" x2="145" y2="110" stroke="#7C3AED" strokeWidth="2" opacity="0.5" />
              <line x1="140" y1="105" x2="150" y2="105" stroke="#7C3AED" strokeWidth="2" opacity="0.5" />
            </g>
          </svg>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative mb-3 text-3xl font-extrabold text-white"
          >
            Aucune deadline cette semaine
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="relative text-base text-neutral-400"
          >
            Ajoutez des deadlines à vos tâches pour les voir ici
          </motion.p>
        </motion.div>
      )}

      {isLoading ? (
        <CalendarSkeleton view={view} />
      ) : (
        <div className="relative rounded-xl">
          <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-violet-500/20 via-transparent to-blue-500/20 pointer-events-none" />
          <div className="relative">
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
          </div>
        </div>
      )}
    </div>
  );
}
