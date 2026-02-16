"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";
import { useUIStore } from "@/stores/ui-store";
import { useDomainStore } from "@/stores/domain-store";
import { useTaskStore } from "@/stores/task-store";
import { useReminders } from "@/hooks/useReminders";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const theme = useUIStore((s) => s.theme);
  const loadDomains = useDomainStore((s) => s.loadDomains);
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const { pendingCount } = useReminders();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (theme === "light") {
      setIsDark(false);
    } else if (theme === "dark") {
      setIsDark(true);
    } else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(mq.matches);
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  useEffect(() => {
    loadDomains();
    loadTasks();
  }, [loadDomains, loadTasks]);

  return (
    <div className={cn(isDark && "dark", "min-h-screen bg-background text-foreground")}>
      <Sidebar />
      <div
        className={`flex min-h-screen flex-col transition-[margin] duration-250 ease-in-out ${
          sidebarOpen ? "md:ml-80" : ""
        }`}
      >
        {/* Dot grid texture */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? "#fff" : "#000"} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <Header pendingReminders={pendingCount} />
        <main className="relative flex-1 px-4 py-8 pb-24 md:px-8 md:pb-8 lg:px-12">
          {/* Ambient glow orbs */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-32 right-1/4 size-[500px] rounded-full bg-violet-600/[0.03] blur-[120px]" />
            <div className="absolute -bottom-32 left-1/4 size-[400px] rounded-full bg-blue-600/[0.03] blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
