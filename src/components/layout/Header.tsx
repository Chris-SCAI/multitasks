"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, CheckSquare, Calendar, Tags, Settings, Bell, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/db/supabase-client";
import type { Reminder } from "@/lib/reminders/scheduler";

async function handleSignOut() {
  try {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
  } catch { /* ignore */ }
  localStorage.removeItem("displayName");
  localStorage.removeItem("multitasks-user-email");
  window.location.href = "/login";
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Tâches",
  "/dashboard/calendar": "Calendrier",
  "/dashboard/domains": "Domaines",
  "/dashboard/settings": "Paramètres",
};

const navItems = [
  { href: "/dashboard", label: "Tâches", icon: CheckSquare },
  { href: "/dashboard/calendar", label: "Calendrier", icon: Calendar },
  { href: "/dashboard/domains", label: "Domaines", icon: Tags },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const minutes = Math.floor(absDiffMs / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diffMs > 0) {
    // Futur
    if (minutes < 1) return "dans moins d'1 min";
    if (minutes < 60) return `dans ${minutes} min`;
    if (hours < 24) return `dans ${hours}h${minutes % 60 > 0 ? String(minutes % 60).padStart(2, "0") : ""}`;
    return `dans ${days}j`;
  }
  // Passé
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${days}j`;
}

interface HeaderProps {
  onAddTask?: () => void;
  pendingReminders?: number;
  reminders?: Reminder[];
  onDismissReminder?: (id: string) => void;
  displayName?: string | null;
  onSignOut?: () => Promise<void>;
  isAuthenticated?: boolean;
}

export function Header({
  onAddTask,
  pendingReminders = 0,
  reminders = [],
  onDismissReminder,
  displayName,
  onSignOut,
  isAuthenticated,
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const title = pageTitles[pathname] ?? "Multitasks";

  const [greeting, setGreeting] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setGreeting(hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir");
    const formatted = now.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    setToday(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  // Fermer le panneau au clic extérieur
  useEffect(() => {
    if (!notifOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  // Tri : en attente (futur) en premier, puis déclenchés (passé), par date
  const sortedReminders = [...reminders].sort((a, b) => {
    const now = Date.now();
    const aFuture = new Date(a.scheduledAt).getTime() > now;
    const bFuture = new Date(b.scheduledAt).getTime() > now;
    if (aFuture !== bFuture) return aFuture ? -1 : 1;
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 bg-background/80 px-4 backdrop-blur-xl md:h-24 md:px-8 lg:px-12 relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-foreground hover:bg-muted md:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-6" />
      </Button>

      <div className="flex-1">
        {pathname === "/dashboard" ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
              {displayName ? `${greeting}, ${displayName}` : greeting}
            </h1>
            <p className="text-sm text-muted-foreground">
              {today}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {today}
            </p>
          </>
        )}
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground hover:bg-muted"
          aria-label={`${pendingReminders} rappel${pendingReminders !== 1 ? "s" : ""} en attente`}
          onClick={() => setNotifOpen((v) => !v)}
        >
          <Bell className="size-6" />
          {pendingReminders > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
              {pendingReminders > 9 ? "9+" : pendingReminders}
            </span>
          )}
        </Button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-border bg-background shadow-xl shadow-black/20 z-50">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              {reminders.length > 0 && (
                <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-xs font-medium text-violet-400">
                  {pendingReminders} en attente
                </span>
              )}
            </div>

            {sortedReminders.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <Bell className="size-8 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">Aucune notification</p>
                <p className="text-xs text-muted-foreground/70">
                  Les rappels apparaîtront ici lorsque vos tâches auront une échéance.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {sortedReminders.map((reminder) => {
                  const isPending = !reminder.triggered && new Date(reminder.scheduledAt) > new Date();
                  const isTriggered = reminder.triggered;
                  return (
                    <li
                      key={reminder.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 transition-colors",
                        isPending && "bg-violet-500/5"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                          isPending
                            ? "bg-violet-500/15 text-violet-400"
                            : isTriggered
                              ? "bg-green-500/15 text-green-400"
                              : "bg-amber-500/15 text-amber-400"
                        )}
                      >
                        <Bell className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {reminder.taskTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isPending
                            ? formatRelativeTime(reminder.scheduledAt)
                            : isTriggered
                              ? `Envoyé ${formatRelativeTime(reminder.scheduledAt)}`
                              : `Manqué ${formatRelativeTime(reminder.scheduledAt)}`}
                        </p>
                      </div>
                      {onDismissReminder && (
                        <button
                          type="button"
                          onClick={() => onDismissReminder(reminder.id)}
                          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label="Supprimer la notification"
                        >
                          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {isAuthenticated && (
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted hover:text-red-400"
          aria-label="Se déconnecter"
        >
          <LogOut className="size-5" />
        </button>
      )}

      {onAddTask && (
        <Button
          onClick={onAddTask}
          className="group relative gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative flex items-center gap-2">
            <Plus className="size-5" />
            <span className="hidden sm:inline">Nouvelle tâche</span>
          </span>
        </Button>
      )}

      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 border-border bg-background p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex h-20 items-center gap-3 border-b border-border px-7">
              <Sparkles className="size-8 text-yellow-400" />
              <span className="text-3xl font-bold">
                <span className="text-white">Multi</span>
                <span className="text-violet-400">Tasks</span>
              </span>
            </div>
            <nav className="flex-1 space-y-1.5 px-4 py-6">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-3 text-xl font-semibold transition-colors",
                      active
                        ? "bg-violet-500/15 text-violet-600 dark:text-violet-400"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="size-6" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {isAuthenticated && (
              <div className="border-t border-border px-4 py-4">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xl font-semibold text-foreground transition-colors hover:text-red-400"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="size-6" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
