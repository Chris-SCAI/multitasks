"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";
import { useUIStore } from "@/stores/ui-store";
import { useDomainStore } from "@/stores/domain-store";
import { useTaskStore } from "@/stores/task-store";
import { useReminders } from "@/hooks/useReminders";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const loadDomains = useDomainStore((s) => s.loadDomains);
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const { pendingCount } = useReminders();

  useEffect(() => {
    loadDomains();
    loadTasks();
  }, [loadDomains, loadTasks]);

  return (
    <div className="dark min-h-screen bg-[#0B1120] text-white">
      <Sidebar />
      <div
        className={`flex min-h-screen flex-col transition-[margin] duration-250 ease-in-out ${
          sidebarOpen ? "md:ml-[280px]" : ""
        }`}
      >
        <Header pendingReminders={pendingCount} />
        <main className="flex-1 px-4 py-6 pb-24 md:px-6 md:pb-6">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
