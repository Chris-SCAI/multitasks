"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, Moon, Sun, CheckSquare, Calendar, Tags, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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

export function Header({
  onAddTask,
  pendingReminders = 0,
}: {
  onAddTask?: () => void;
  pendingReminders?: number;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(localStorage.getItem("displayName"));
  }, []);

  const title = pageTitles[pathname] ?? "Multitasks";
  const isDark = theme === "dark";
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const today = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 bg-[#0B1120]/80 px-4 backdrop-blur-xl md:h-20 md:px-8 lg:px-12 relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-[#1C2640] md:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex-1">
        {pathname === "/dashboard" ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-4xl">
              {displayName ? `${greeting}, ${displayName}` : greeting}
            </h1>
            <p className="text-sm text-neutral-400">
              {today.charAt(0).toUpperCase() + today.slice(1)}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h1>
            <p className="text-sm text-neutral-400">
              {today.charAt(0).toUpperCase() + today.slice(1)}
            </p>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="relative text-white hover:bg-[#1C2640]"
        aria-label={`${pendingReminders} rappel${pendingReminders !== 1 ? "s" : ""} en attente`}
      >
        <Bell className="size-5" />
        {pendingReminders > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
            {pendingReminders > 9 ? "9+" : pendingReminders}
          </span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-[#1C2640] md:hidden"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? "Mode clair" : "Mode sombre"}
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>

      {onAddTask && (
        <Button
          onClick={onAddTask}
          size="sm"
          className="group relative gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative flex items-center gap-1.5">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nouvelle tâche</span>
          </span>
        </Button>
      )}

      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] border-[#1E293B] bg-[#0B1120] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b border-[#1E293B] px-6">
              <span className="text-2xl font-bold text-white">
                Multitasks
              </span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-semibold transition-colors",
                      active
                        ? "bg-violet-600/20 text-violet-400"
                        : "text-white hover:bg-[#1C2640]"
                    )}
                  >
                    <item.icon className="size-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
