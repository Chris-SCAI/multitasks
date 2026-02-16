"use client";

import {
  Users,
  CheckSquare,
  Sparkles,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RotateCcw,
} from "lucide-react";
import { getMockKPIs } from "@/lib/admin/mock-data";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  CheckSquare,
  Sparkles,
  DollarSign,
  TrendingUp,
  RotateCcw,
};

export function AdminDashboard() {
  const kpis = getMockKPIs();

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
        <span className="size-1.5 rounded-full bg-amber-400" />
        Données de démonstration
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = iconMap[kpi.icon] ?? TrendingUp;
          const isPositive = kpi.trend >= 0;
          return (
            <div key={kpi.label} className="relative rounded-2xl">
              <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-b ${kpi.gradient} opacity-30`}
              />
              <div className="relative overflow-hidden rounded-2xl bg-[#151D2E] p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-white opacity-[0.03] blur-2xl" />
                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.gradient} shadow-lg`}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                    {isPositive ? "+" : ""}
                    {kpi.trend}%
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="mt-1 text-sm text-neutral-400">{kpi.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
