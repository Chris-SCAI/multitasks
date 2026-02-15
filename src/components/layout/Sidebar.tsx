"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Calendar, Tags, Settings, Moon, Sun, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const navItems = [
  { href: "/dashboard", label: "Tâches", icon: CheckSquare },
  { href: "/dashboard/calendar", label: "Calendrier", icon: Calendar },
  { href: "/dashboard/analysis", label: "Analyse IA", icon: Sparkles, badge: "IA" },
  { href: "/dashboard/domains", label: "Domaines", icon: Tags },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme, sidebarOpen } = useUIStore();

  const isDark = theme === "dark";

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 z-30 hidden w-[280px] flex-col border-r border-[#1E293B] bg-[#0B1120] md:flex overflow-hidden"
        >
          {/* Glow décoratif en haut */}
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-violet-600/10 blur-[80px]" />

          {/* Logo premium */}
          <div className="relative flex h-16 items-center px-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
                <CheckSquare className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Multitasks
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-semibold transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-violet-500/15 to-transparent text-violet-400"
                      : "text-white hover:bg-[#151D2E] hover:translate-x-0.5"
                  )}
                >
                  {/* Barre latérale lumineuse pour l'item actif */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-gradient-to-b from-violet-500 to-blue-500 shadow-[0_0_12px_rgba(139,92,246,0.4)]" />
                  )}
                  <item.icon className={cn("size-5", active && "text-violet-400")} />
                  {item.label}
                  {"badge" in item && item.badge && (
                    <span className="ml-auto rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-2 py-0.5 text-xs font-bold text-white animate-pulse opacity-90">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Séparateur décoratif gradient */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />

          {/* Footer avec toggle thème visuel + version badge */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[#151D2E] p-1">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  !isDark
                    ? "bg-[#1C2640] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <Sun className="size-4" />
                Clair
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isDark
                    ? "bg-[#1C2640] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <Moon className="size-4" />
                Sombre
              </button>
            </div>
            <span className="text-xs text-neutral-600">v1.0</span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
