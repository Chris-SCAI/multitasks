"use client";

import { motion } from "framer-motion";
import { Shield, BarChart3, Users, Crown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminVIPManager } from "@/components/admin/AdminVIPManager";

function AdminSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-2xl bg-[#1C2640]" />
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-[#1C2640]" />
          <div className="h-5 w-72 rounded-lg bg-[#1C2640]" />
        </div>
      </div>
      <div className="h-10 w-full max-w-md rounded-lg bg-[#1C2640]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-[#1C2640]" />
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin, isLoading } = useAdminGuard();

  if (isLoading) return <AdminSkeleton />;
  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 shadow-lg shadow-red-500/30">
          <Shield className="size-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Administration
          </h1>
          <p className="mt-1 text-lg font-medium text-neutral-300">
            Pilotez Multitasks.fr depuis un tableau de bord centralisé.
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" aria-label="Sections administration">
        <TabsList className="w-full border-[#1E293B] bg-[#151D2E] sm:w-auto">
          <TabsTrigger
            value="dashboard"
            className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-orange-600/20 data-[state=active]:text-red-400"
          >
            <BarChart3 className="size-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger
            value="utilisateurs"
            className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-orange-600/20 data-[state=active]:text-red-400"
          >
            <Users className="size-5" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger
            value="vip"
            className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600/20 data-[state=active]:to-orange-600/20 data-[state=active]:text-amber-400"
          >
            <Crown className="size-5" />
            <span className="hidden sm:inline">VIP</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminDashboard />
          </motion.div>
        </TabsContent>

        <TabsContent value="utilisateurs" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminUserManagement />
          </motion.div>
        </TabsContent>

        <TabsContent value="vip" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminVIPManager />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
