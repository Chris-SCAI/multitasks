"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Calendar, Tags, Settings, Sparkles, Shield, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAdminEmail } from "@/lib/admin/admin-config";

const navItems = [
  { href: "/dashboard", label: "Tâches", icon: CheckSquare },
  { href: "/dashboard/calendar", label: "Calendrier", icon: Calendar },
  { href: "/dashboard/focus", label: "Focus", icon: Timer },
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
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-base font-semibold transition-colors",
                active
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-muted-foreground"
              )}
            >
              <span className="relative">
                <item.icon className={cn("size-6", active && "stroke-[2.5]")} />
                {"badge" in item && item.badge && (
                  <span className="absolute -right-2.5 -top-1.5 rounded-full bg-violet-500 px-1.5 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        {/* Admin link — conditionnel */}
        {isAdminEmail(
          process.env.NEXT_PUBLIC_ADMIN_EMAILS?.includes("*")
            ? "*"
            : typeof window !== "undefined"
              ? localStorage.getItem("multitasks-user-email")
              : null
        ) && (
          <Link
            href="/dashboard/admin"
            className={cn(
              "flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-base font-semibold transition-colors",
              isActive("/dashboard/admin")
                ? "text-red-400"
                : "text-muted-foreground"
            )}
          >
            <Shield className={cn("size-6", isActive("/dashboard/admin") && "stroke-[2.5]")} />
            <span>Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
