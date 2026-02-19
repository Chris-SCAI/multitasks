"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, SkipForward, Settings2, Clock, Flame, Coffee, ChevronDown, Volume2 } from "lucide-react";
import { usePomodoroStore } from "@/stores/pomodoro-store";
import { useTaskStore } from "@/stores/task-store";
import { useDomainStore } from "@/stores/domain-store";
import { cn } from "@/lib/utils";
import { SOUND_LABELS, playNotificationSound } from "@/lib/reminders/sounds";
import type { NotificationSound } from "@/lib/reminders/sounds";

// --- Timer Circle SVG ---

function TimerCircle({ progress, sessionType }: { progress: number; sessionType: string }) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const strokeColor =
    sessionType === "work"
      ? "url(#focusGradient)"
      : sessionType === "longBreak"
        ? "url(#longBreakGradient)"
        : "url(#breakGradient)";

  return (
    <svg width="280" height="280" viewBox="0 0 280 280" className="drop-shadow-lg">
      <defs>
        <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle
        cx="140"
        cy="140"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-border"
      />
      {/* Progress arc */}
      <circle
        cx="140"
        cy="140"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 140 140)"
        className="transition-all duration-1000 ease-linear"
      />
    </svg>
  );
}

// --- Format time ---

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// --- Session badge ---

function SessionBadge({ type }: { type: "work" | "break" | "longBreak" }) {
  const config = {
    work: { label: "Travail", icon: Flame, className: "bg-violet-500/15 text-violet-400 border-violet-500/30" },
    break: { label: "Pause", icon: Coffee, className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    longBreak: { label: "Pause longue", icon: Coffee, className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  };
  const c = config[type];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium", c.className)}>
      <c.icon className="size-3.5" />
      {c.label}
    </span>
  );
}

// --- Progress dots ---

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "size-2.5 rounded-full transition-all duration-300",
            i < current
              ? "bg-emerald-400 scale-110"
              : "bg-border"
          )}
        />
      ))}
    </div>
  );
}

// --- Settings panel ---

function SettingsPanel() {
  const { settings, updateSettings } = usePomodoroStore();
  const [open, setOpen] = useState(false);

  const workOptions = [15, 20, 25, 30, 45, 60];
  const breakOptions = [3, 5, 10];
  const longBreakOptions = [10, 15, 20, 30];

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Settings2 className="size-4 text-muted-foreground" />
          Reglages
        </div>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border px-5 pb-5 pt-4">
              {/* Duree travail */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Travail (min)
                </label>
                <div className="flex flex-wrap gap-2">
                  {workOptions.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateSettings({ workDuration: v })}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        settings.workDuration === v
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duree pause */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Pause (min)
                </label>
                <div className="flex flex-wrap gap-2">
                  {breakOptions.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateSettings({ breakDuration: v })}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        settings.breakDuration === v
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duree longue pause */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Pause longue (min)
                </label>
                <div className="flex flex-wrap gap-2">
                  {longBreakOptions.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateSettings({ longBreakDuration: v })}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        settings.longBreakDuration === v
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Son de fin */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Volume2 className="size-3.5" />
                  Son de fin de session
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(SOUND_LABELS) as NotificationSound[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        updateSettings({ timerSound: key });
                        if (key !== "none") playNotificationSound(key);
                      }}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        settings.timerSound === key
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {SOUND_LABELS[key]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Demarrage auto pause</span>
                  <button
                    type="button"
                    onClick={() => updateSettings({ autoStartBreak: !settings.autoStartBreak })}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      settings.autoStartBreak ? "bg-emerald-500" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform",
                        settings.autoStartBreak && "translate-x-5"
                      )}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Demarrage auto travail</span>
                  <button
                    type="button"
                    onClick={() => updateSettings({ autoStartWork: !settings.autoStartWork })}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      settings.autoStartWork ? "bg-emerald-500" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform",
                        settings.autoStartWork && "translate-x-5"
                      )}
                    />
                  </button>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Stats bar chart ---

function WeekChart({ sessions }: { sessions: { date: string; minutes: number }[] }) {
  const max = Math.max(...sessions.map((s) => s.minutes), 1);
  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="flex items-end justify-between gap-2 h-24">
      {sessions.map((s, i) => (
        <div key={s.date} className="flex flex-1 flex-col items-center gap-1">
          <div className="relative w-full flex justify-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: max > 0 ? `${(s.minutes / max) * 64}px` : "2px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={cn(
                "w-5 rounded-t-md",
                s.minutes > 0
                  ? "bg-gradient-to-t from-emerald-500 to-teal-400"
                  : "bg-border"
              )}
              style={{ minHeight: "2px" }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{dayLabels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function getWeekData(sessions: { type: string; duration: number; completedAt: string }[]) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // getDay: 0=dim, we want monday=0
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const weekDays: { date: string; minutes: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayMinutes = sessions
      .filter((s) => s.type === "work" && s.completedAt.startsWith(dateStr))
      .reduce((acc, s) => acc + s.duration / 60, 0);
    weekDays.push({ date: dateStr, minutes: Math.round(dayMinutes) });
  }
  return weekDays;
}

// --- Main Page ---

export default function FocusPage() {
  const {
    activeTaskId,
    activeTaskTitle,
    timeRemaining,
    isRunning,
    sessionType,
    workSessionCount,
    sessions,
    settings,
    startSession,
    pause,
    resume,
    stop,
    tick,
    skipSession,
  } = usePomodoroStore();

  const { tasks } = useTaskStore();
  const { domains } = useDomainStore();

  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick each second
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  // Filter tasks for selection
  const availableTasks = tasks.filter((t) => {
    if (t.status !== "todo" && t.status !== "in_progress") return false;
    if (domainFilter && t.domainId !== domainFilter) return false;
    return true;
  });

  // Timer progress
  const totalDuration =
    sessionType === "work"
      ? settings.workDuration * 60
      : sessionType === "break"
        ? settings.breakDuration * 60
        : settings.longBreakDuration * 60;
  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 0;

  // Stats
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayWorkSessions = sessions.filter(
    (s) => s.type === "work" && s.completedAt.startsWith(todayStr)
  );
  const todaySessions = todayWorkSessions.length;
  const todayMinutes = Math.round(
    todayWorkSessions.reduce((acc, s) => acc + s.duration / 60, 0)
  );

  const weekData = getWeekData(sessions);

  const hasActiveSession = activeTaskId !== null;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6 pb-28 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mode Focus</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Concentre-toi avec la technique Pomodoro
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: Timer */}
        <div className="space-y-6">
          {/* Timer card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
            {/* Glow decoratif */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-emerald-500/10 blur-[60px] dark:block hidden" />

            <div className="flex flex-col items-center gap-6">
              {/* Session badge */}
              <SessionBadge type={sessionType} />

              {/* Timer circle */}
              <div className="relative">
                <motion.div
                  animate={isRunning ? { scale: [1, 1.01, 1] } : {}}
                  transition={isRunning ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                >
                  <TimerCircle progress={progress} sessionType={sessionType} />
                </motion.div>
                {/* Time display overlaid */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold tabular-nums text-foreground">
                    {formatTime(timeRemaining)}
                  </span>
                  {hasActiveSession && (
                    <span className="mt-2 max-w-[180px] truncate text-sm text-muted-foreground">
                      {activeTaskTitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress dots */}
              <ProgressDots
                current={workSessionCount % settings.sessionsBeforeLongBreak}
                total={settings.sessionsBeforeLongBreak}
              />

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Stop */}
                {hasActiveSession && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    type="button"
                    onClick={stop}
                    className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                    title="Arreter"
                  >
                    <Square className="size-5" />
                  </motion.button>
                )}

                {/* Play/Pause */}
                <button
                  type="button"
                  onClick={() => {
                    if (!hasActiveSession) return;
                    if (isRunning) pause();
                    else resume();
                  }}
                  disabled={!hasActiveSession}
                  className={cn(
                    "flex size-16 items-center justify-center rounded-full text-white transition-all",
                    hasActiveSession
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isRunning ? (
                      <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Pause className="size-6" />
                      </motion.div>
                    ) : (
                      <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Play className="size-6 ml-0.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Skip */}
                {hasActiveSession && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    type="button"
                    onClick={skipSession}
                    className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Passer"
                  >
                    <SkipForward className="size-5" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Stats du jour */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Stats du jour</h2>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{todaySessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-teal-400">{todayMinutes}<span className="text-base font-normal"> min</span></p>
                <p className="text-xs text-muted-foreground">Temps focus</p>
              </div>
            </div>

            <h3 className="mb-3 text-xs font-medium text-muted-foreground">Cette semaine</h3>
            <WeekChart sessions={weekData} />
          </div>
        </div>

        {/* Right: Task selection + Settings */}
        <div className="space-y-4">
          {/* Task list */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Choisir une tache</h2>
              {/* Domain filter */}
              {domains.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDomainFilter(null)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                      domainFilter === null
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Toutes
                  </button>
                  {domains.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDomainFilter(d.id)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        domainFilter === d.id
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {availableTasks.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <Clock className="mx-auto size-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">Aucune tache disponible</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {availableTasks.map((task) => {
                    const isSelected = activeTaskId === task.id;
                    const domain = domains.find((d) => d.id === task.domainId);
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => {
                          if (!isRunning) {
                            startSession(task.id, task.title);
                          }
                        }}
                        disabled={isRunning}
                        className={cn(
                          "flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors",
                          isSelected
                            ? "bg-emerald-500/10"
                            : "hover:bg-muted/50",
                          isRunning && !isSelected && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "truncate text-sm font-medium",
                            isSelected ? "text-emerald-400" : "text-foreground"
                          )}>
                            {task.title}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            {domain && (
                              <span
                                className="inline-block size-2 rounded-full"
                                style={{ backgroundColor: domain.color }}
                              />
                            )}
                            {task.estimatedMinutes && (
                              <span className="text-xs text-muted-foreground">
                                ~{task.estimatedMinutes} min
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <SettingsPanel />
        </div>
      </div>
    </div>
  );
}
