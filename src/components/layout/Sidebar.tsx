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
          className="fixed inset-y-0 left-0 z-30 hidden w-[280px] flex-col border-r border-[#1E293B] bg-[#0B1120] md:flex"
        >
          <div className="flex h-16 items-center px-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-violet-600">
                <CheckSquare className="size-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Multitasks
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-semibold transition-colors",
                    active
                      ? "bg-violet-600/20 text-violet-400"
                      : "text-white hover:bg-[#1C2640]"
                  )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                  {"badge" in item && item.badge && (
                    <span className="ml-auto rounded-full bg-violet-600/30 px-2 py-0.5 text-xs font-bold text-violet-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#1E293B] p-4">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-[#1C2640]"
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
              {isDark ? "Mode clair" : "Mode sombre"}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
