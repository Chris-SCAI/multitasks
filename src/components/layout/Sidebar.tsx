"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Calendar, Tags, Settings, Sparkles, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { isAdminEmail } from "@/lib/admin/admin-config";

const navItems = [
  { href: "/dashboard", label: "Tâches", icon: CheckSquare },
  { href: "/dashboard/calendar", label: "Calendrier", icon: Calendar },
  { href: "/dashboard/analysis", label: "Analyse IA", icon: Sparkles, badge: "IA" },
  { href: "/dashboard/domains", label: "Domaines", icon: Tags },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

interface SidebarProps {
  onSignOut?: () => Promise<void>;
  userEmail?: string | null;
  userDisplayName?: string | null;
}

export function Sidebar({ onSignOut, userEmail, userDisplayName }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen } = useUIStore();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 z-30 hidden w-80 flex-col border-r border-border bg-background md:flex overflow-hidden"
        >
          {/* Glow décoratif en haut (dark only) */}
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-violet-600/10 blur-[80px] hidden dark:block" />

          {/* Logo premium */}
          <div className="relative flex h-20 items-center px-7">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
                <CheckSquare className="size-6 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-foreground dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-blue-200 dark:bg-clip-text">
                Multitasks
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 px-4 py-6">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-xl font-semibold transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-violet-500/15 to-transparent text-violet-600 dark:text-violet-400"
                      : "text-foreground hover:bg-muted hover:translate-x-0.5"
                  )}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full bg-gradient-to-b from-violet-500 to-blue-500 shadow-[0_0_12px_rgba(139,92,246,0.4)]" />
                  )}
                  <item.icon className={cn("size-6", active && "text-violet-600 dark:text-violet-400")} />
                  {item.label}
                  {"badge" in item && item.badge && (
                    <span className="ml-auto rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-2.5 py-0.5 text-sm font-bold text-white animate-pulse opacity-90">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            {/* Admin link — conditionnel */}
            {isAdminEmail(
              process.env.NEXT_PUBLIC_ADMIN_EMAILS?.includes("*")
                ? "*"
                : userEmail ?? null
            ) && (
              <Link
                href="/dashboard/admin"
                className={cn(
                  "relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-xl font-semibold transition-all duration-200",
                  isActive("/dashboard/admin")
                    ? "bg-gradient-to-r from-red-500/15 to-transparent text-red-400"
                    : "text-foreground hover:bg-muted hover:translate-x-0.5"
                )}
              >
                {isActive("/dashboard/admin") && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full bg-gradient-to-b from-red-500 to-orange-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]" />
                )}
                <Shield
                  className={cn(
                    "size-6",
                    isActive("/dashboard/admin") && "text-red-400"
                  )}
                />
                Admin
              </Link>
            )}
          </nav>

          {/* Séparateur décoratif gradient */}
          <div className="mx-7 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Section utilisateur */}
          {userEmail && (
            <div className="px-5 py-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white">
                  {(userDisplayName ?? userEmail)[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{userDisplayName ?? "Utilisateur"}</p>
                  <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
              {onSignOut && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSignOut}
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-red-400"
                >
                  <LogOut className="size-4" />
                  Déconnexion
                </Button>
              )}
            </div>
          )}

          {/* Footer version badge */}
          <div className="p-5">
            <span className="text-sm text-muted-foreground">v1.0</span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
