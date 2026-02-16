"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, CheckSquare, Calendar, Tags, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(localStorage.getItem("displayName"));
  }, []);

  const title = pageTitles[pathname] ?? "Multitasks";
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const today = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
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
              {today.charAt(0).toUpperCase() + today.slice(1)}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {today.charAt(0).toUpperCase() + today.slice(1)}
            </p>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="relative text-foreground hover:bg-muted"
        aria-label={`${pendingReminders} rappel${pendingReminders !== 1 ? "s" : ""} en attente`}
      >
        <Bell className="size-6" />
        {pendingReminders > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
            {pendingReminders > 9 ? "9+" : pendingReminders}
          </span>
        )}
      </Button>

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
            <div className="flex h-20 items-center border-b border-border px-7">
              <span className="text-3xl font-bold text-foreground">
                Multitasks
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
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
