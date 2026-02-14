"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Calendar, Tags, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Tâches", icon: CheckSquare },
  { href: "/dashboard/calendar", label: "Calendrier", icon: Calendar },
  { href: "/dashboard/analysis", label: "Analyse IA", icon: Sparkles, badge: "IA" },
  { href: "/dashboard/domains", label: "Domaines", icon: Tags },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#1E293B] bg-[#0B1120]/95 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "text-violet-400"
                  : "text-neutral-300"
              )}
            >
              <span className="relative">
                <item.icon className={cn("size-5", active && "stroke-[2.5]")} />
                {"badge" in item && item.badge && (
                  <span className="absolute -right-2.5 -top-1.5 rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
