export interface MockKPI {
  label: string;
  value: string;
  trend: number;
  icon: string;
  gradient: string;
}

export function getMockKPIs(): MockKPI[] {
  return [
    {
      label: "Utilisateurs",
      value: "1 247",
      trend: 12.5,
      icon: "Users",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Tâches créées",
      value: "8 432",
      trend: 8.3,
      icon: "CheckSquare",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Analyses IA",
      value: "3 891",
      trend: 23.1,
      icon: "Sparkles",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Revenu MRR",
      value: "4 230 €",
      trend: 15.7,
      icon: "DollarSign",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Conversion",
      value: "5.2%",
      trend: -1.3,
      icon: "TrendingUp",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      label: "Rétention",
      value: "68%",
      trend: 3.4,
      icon: "RotateCcw",
      gradient: "from-indigo-500 to-blue-600",
    },
  ];
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  plan: "free" | "ia_quotidienne" | "pro_sync";
  tasksCount: number;
  lastActive: string;
}

export function getMockUsers(): MockUser[] {
  return [
    { id: "u1", name: "Marie Dupont", email: "marie@example.com", plan: "pro_sync", tasksCount: 87, lastActive: "2026-02-16" },
    { id: "u2", name: "Thomas Martin", email: "thomas@example.com", plan: "ia_quotidienne", tasksCount: 42, lastActive: "2026-02-15" },
    { id: "u3", name: "Sophie Bernard", email: "sophie@example.com", plan: "free", tasksCount: 15, lastActive: "2026-02-14" },
    { id: "u4", name: "Lucas Petit", email: "lucas@example.com", plan: "pro_sync", tasksCount: 103, lastActive: "2026-02-16" },
    { id: "u5", name: "Emma Leroy", email: "emma@example.com", plan: "ia_quotidienne", tasksCount: 56, lastActive: "2026-02-13" },
    { id: "u6", name: "Hugo Moreau", email: "hugo@example.com", plan: "free", tasksCount: 8, lastActive: "2026-02-12" },
    { id: "u7", name: "Léa Robert", email: "lea@example.com", plan: "pro_sync", tasksCount: 74, lastActive: "2026-02-16" },
    { id: "u8", name: "Nathan Simon", email: "nathan@example.com", plan: "free", tasksCount: 22, lastActive: "2026-02-10" },
    { id: "u9", name: "Chloé Laurent", email: "chloe@example.com", plan: "ia_quotidienne", tasksCount: 38, lastActive: "2026-02-15" },
    { id: "u10", name: "Maxime Girard", email: "maxime@example.com", plan: "free", tasksCount: 5, lastActive: "2026-02-08" },
  ];
}
