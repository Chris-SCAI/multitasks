"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Bell, Tags, CreditCard, Cloud, Download, AlertTriangle, Check, Settings, RefreshCw, Loader2, Play, ExternalLink } from "lucide-react";
import { generateTasksCSV } from "@/lib/export/csv-generator";
import { generateTasksPDF } from "@/lib/export/pdf-generator";
import { useTaskStore } from "@/stores/task-store";
import { db } from "@/lib/db/local";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DomainManager } from "@/components/domains/DomainManager";
import { PlanBadge } from "@/components/pricing/PlanBadge";
import { FeatureGate } from "@/components/pricing/FeatureGate";
import { QuotaIndicator } from "@/components/analysis/QuotaIndicator";
import { useDomainStore } from "@/stores/domain-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { CheckoutSuccess } from "./checkout-success";
import { useAnalysisStore } from "@/stores/analysis-store";
import { useSync } from "@/hooks/useSync";
import { useUIStore } from "@/stores/ui-store";
import {
  type NotificationSound,
  SOUND_LABELS,
  playNotificationSound,
} from "@/lib/reminders/sounds";

function GradientCard({
  children,
  gradient = "from-violet-500/30 via-blue-500/10 to-transparent",
  glowColor = "bg-violet-500",
}: {
  children: React.ReactNode;
  gradient?: string;
  glowColor?: string;
}) {
  return (
    <div className="relative max-w-3xl rounded-2xl">
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-b ${gradient}`} />
      <div className="relative overflow-hidden rounded-2xl bg-[#151D2E] p-6 md:p-8">
        <div className={`pointer-events-none absolute -right-20 -top-20 size-40 rounded-full ${glowColor} opacity-[0.04] blur-3xl`} />
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Utilisateur");
  const [language, setLanguage] = useState("fr");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const { domains, createDomain, updateDomain, deleteDomain } =
    useDomainStore();
  const { currentPlan, setPlan, stripeCustomerId } = useSubscriptionStore();
  const loadPlanFromServer = useSubscriptionStore((s) => s.loadPlanFromServer);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const quotaInfo = useAnalysisStore((s) => s.quotaInfo);
  const planId = currentPlan as "free" | "etudiant" | "pro" | "equipe";
  const isPaid = planId !== "free";

  const notificationSound = useUIStore((s) => s.notificationSound);
  const setNotificationSound = useUIStore((s) => s.setNotificationSound);

  const { syncStatus, syncNow, isProUser } = useSync();
  const [isSyncingManual, setIsSyncingManual] = useState(false);

  const tasks = useTaskStore((s) => s.tasks);
  const loadTasks = useTaskStore((s) => s.loadTasks);

  // Charger le nom depuis localStorage + charger les tâches si vide
  useEffect(() => {
    const saved = localStorage.getItem("multitasks-display-name");
    if (saved) setDisplayName(saved);
    if (tasks.length === 0) loadTasks();
  }, [tasks.length, loadTasks]);

  // Refresh plan on mount (covers portal return via ?tab=abonnement)
  // and when tab becomes visible again (portal opens in another tab)
  useEffect(() => {
    loadPlanFromServer();

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        loadPlanFromServer();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [loadPlanFromServer]);

  function handleSaveProfile() {
    localStorage.setItem("multitasks-display-name", displayName);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  async function handleSyncNow() {
    setIsSyncingManual(true);
    try {
      await syncNow();
    } finally {
      setIsSyncingManual(false);
    }
  }

  function handleExportCSV() {
    const csv = generateTasksCSV(tasks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `multitasks-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleExportPDF() {
    const html = generateTasksPDF({ tasks, domains });
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.addEventListener("load", () => win.print());
    }
  }

  async function handleDeleteAccount() {
    try {
      await db.tasks.clear();
      await db.domains.clear();
      localStorage.removeItem("multitasks-ui");
      localStorage.removeItem("multitasks-subscription");
      localStorage.removeItem("multitasks-quota");
      localStorage.removeItem("multitasks-display-name");
      router.push("/");
    } catch {
      router.push("/");
    }
  }

  async function handleOpenPortal() {
    setIsPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        // Fallback: show local cancel dialog if portal unavailable
        setShowCancelDialog(true);
      }
    } catch {
      setShowCancelDialog(true);
    } finally {
      setIsPortalLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Suspense fallback={null}>
        <CheckoutSuccess />
      </Suspense>

      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
          <Settings className="size-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Paramètres
          </h1>
          <p className="mt-1 text-lg font-medium text-neutral-300">
            Gérez votre profil, vos domaines et vos préférences.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profil" aria-label="Sections des paramètres">
        <TabsList className="w-full border-[#1E293B] bg-[#151D2E] sm:w-auto">
          <TabsTrigger value="profil" aria-label="Profil" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-violet-400">
            <User className="size-5" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" aria-label="Notifications" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-violet-400">
            <Bell className="size-5" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="domaines" aria-label="Domaines" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-violet-400">
            <Tags className="size-5" />
            <span className="hidden sm:inline">Domaines</span>
          </TabsTrigger>
          <TabsTrigger value="abonnement" aria-label="Abonnement" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-violet-400">
            <CreditCard className="size-5" />
            <span className="hidden sm:inline">Abonnement</span>
          </TabsTrigger>
          <TabsTrigger value="sync" aria-label="Sync" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-violet-400">
            <Cloud className="size-5" />
            <span className="hidden sm:inline">Sync</span>
          </TabsTrigger>
          <TabsTrigger value="donnees" aria-label="Données" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-violet-400">
            <Download className="size-5" />
            <span className="hidden sm:inline">Données</span>
          </TabsTrigger>
          <TabsTrigger value="compte" aria-label="Compte" className="gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/20 data-[state=active]:to-red-600/10 data-[state=active]:text-red-400">
            <AlertTriangle className="size-5" />
            <span className="hidden sm:inline">Compte</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="display-name" className="text-base font-semibold text-white">Nom d&apos;affichage</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={50}
                    className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-display" className="text-base font-semibold text-white">Email</Label>
                  <Input
                    id="email-display"
                    value="utilisateur@example.com"
                    readOnly
                    className="border-[#1E293B] bg-[#0B1120] text-neutral-400"
                  />
                  <p className="text-sm text-neutral-400">
                    L&apos;email ne peut pas être modifié.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-white">Langue</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full border-[#1E293B] bg-[#0B1120] text-white focus:ring-2 focus:ring-violet-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[#1E293B] bg-[#151D2E]">
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="group/btn relative overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40"
                  onClick={handleSaveProfile}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                  <span className="relative flex items-center gap-2">
                    {profileSaved ? (
                      <>
                        <Check className="size-4" />
                        Sauvegardé !
                      </>
                    ) : (
                      "Sauvegarder"
                    )}
                  </span>
                </Button>
              </div>
            </GradientCard>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Notifications
                  </h3>
                  <p className="mt-1 text-lg text-neutral-300">
                    Choisissez le son joué lors des rappels de tâches.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-white">Son de notification</Label>
                  <Select
                    value={notificationSound}
                    onValueChange={(v) => setNotificationSound(v as NotificationSound)}
                  >
                    <SelectTrigger className="w-full border-[#1E293B] bg-[#0B1120] text-white focus:ring-2 focus:ring-violet-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[#1E293B] bg-[#151D2E]">
                      {(Object.entries(SOUND_LABELS) as [NotificationSound, string][]).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value} className="text-white hover:bg-[#1C2640] focus:bg-[#1C2640] focus:text-white">
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="group/btn relative overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40"
                  onClick={() => playNotificationSound(notificationSound)}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                  <span className="relative flex items-center gap-2">
                    <Play className="size-4" />
                    Tester
                  </span>
                </Button>
              </div>
            </GradientCard>
          </motion.div>
        </TabsContent>

        <TabsContent value="domaines" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard>
              <DomainManager
                domains={domains}
                onCreateDomain={createDomain}
                onUpdateDomain={updateDomain}
                onDeleteDomain={deleteDomain}
              />
            </GradientCard>
          </motion.div>
        </TabsContent>

        <TabsContent value="abonnement" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Plan actuel
                    </h3>
                    <p className="mt-1 text-lg text-neutral-300">
                      Gérez votre abonnement Multitasks.
                    </p>
                  </div>
                  <PlanBadge planId={planId} size="md" />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium text-neutral-300">
                    Analyses restantes
                  </Label>
                  <QuotaIndicator
                    used={quotaInfo.used}
                    limit={quotaInfo.limit}
                    plan={quotaInfo.plan}
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    className="group relative flex-1 overflow-hidden bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40"
                    onClick={() => router.push("/dashboard/pricing")}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Changer de plan</span>
                  </Button>
                  {isPaid && (
                    <Button
                      variant="outline"
                      className="flex-1 border-red-900/50 text-red-400 hover:bg-red-900/10 hover:text-red-300"
                      onClick={stripeCustomerId ? handleOpenPortal : () => setShowCancelDialog(true)}
                      disabled={isPortalLoading}
                    >
                      {isPortalLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          Redirection...
                        </span>
                      ) : stripeCustomerId ? (
                        <span className="flex items-center gap-2">
                          Gérer l&apos;abonnement
                          <ExternalLink className="size-3.5" />
                        </span>
                      ) : (
                        "Annuler l\u0027abonnement"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </GradientCard>
          </motion.div>
        </TabsContent>

        <TabsContent value="sync" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard>
              <FeatureGate feature="sync">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Synchronisation cloud
                    </h3>
                    <p className="mt-1 text-lg text-neutral-300">
                      Synchronisez vos tâches et domaines entre tous vos appareils.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-4">
                      <p className="text-sm font-medium text-neutral-400">Statut</p>
                      <p className="mt-1 flex items-center gap-2 text-base font-semibold text-white">
                        {syncStatus.isSyncing ? (
                          <>
                            <Loader2 className="size-4 animate-spin text-violet-400" />
                            En cours...
                          </>
                        ) : syncStatus.error ? (
                          <>
                            <span className="size-2 rounded-full bg-red-500" />
                            Erreur
                          </>
                        ) : syncStatus.lastSyncAt ? (
                          <>
                            <span className="size-2 rounded-full bg-emerald-500" />
                            Connecté
                          </>
                        ) : (
                          <>
                            <span className="size-2 rounded-full bg-neutral-500" />
                            Non synchronisé
                          </>
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-4">
                      <p className="text-sm font-medium text-neutral-400">Dernier sync</p>
                      <p className="mt-1 text-base font-semibold text-white">
                        {syncStatus.lastSyncAt
                          ? new Date(syncStatus.lastSyncAt).toLocaleString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "numeric",
                              month: "short",
                            })
                          : "Jamais"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-4">
                      <p className="text-sm font-medium text-neutral-400">En attente</p>
                      <p className="mt-1 text-base font-semibold text-white">
                        {syncStatus.pendingChanges} changement{syncStatus.pendingChanges !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {syncStatus.error && (
                    <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-3 text-sm text-red-400">
                      {syncStatus.error}
                    </div>
                  )}

                  <Button
                    className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40"
                    onClick={handleSyncNow}
                    disabled={isSyncingManual || syncStatus.isSyncing}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative flex items-center gap-2">
                      {isSyncingManual ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <RefreshCw className="size-4" />
                      )}
                      {isSyncingManual ? "Synchronisation..." : "Synchroniser maintenant"}
                    </span>
                  </Button>
                </div>
              </FeatureGate>
            </GradientCard>
          </motion.div>
        </TabsContent>

        <TabsContent value="donnees" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard>
              <FeatureGate feature="export">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Export de données
                  </h3>
                  <p className="text-lg text-neutral-300">
                    Exportez vos tâches et analyses dans le format de votre choix.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#1E293B] text-white transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
                      onClick={handleExportCSV}
                    >
                      <Download className="size-5" />
                      Export CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-[#1E293B] text-white transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
                      onClick={handleExportPDF}
                    >
                      <Download className="size-5" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </FeatureGate>
            </GradientCard>
          </motion.div>
        </TabsContent>

        <TabsContent value="compte" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard gradient="from-red-500/30 via-red-500/10 to-transparent" glowColor="bg-red-500">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-400">
                  Zone dangereuse
                </h3>
                <p className="text-lg text-neutral-300">
                  La suppression de votre compte est irréversible. Toutes vos
                  tâches, domaines et analyses seront définitivement supprimés.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Supprimer mon compte
                </Button>
              </div>
            </GradientCard>
          </motion.div>
        </TabsContent>
      </Tabs>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="border-[#1E293B] bg-[#151D2E]">
          <DialogHeader>
            <DialogTitle className="text-white">Annuler l&apos;abonnement</DialogTitle>
            <DialogDescription className="text-neutral-300">
              Vous conserverez l&apos;accès à votre plan jusqu&apos;à la fin de la
              période payée. Ensuite, vous repasserez au plan Gratuit. Vos
              données seront conservées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              className="text-white hover:bg-[#1C2640]"
              onClick={() => setShowCancelDialog(false)}
            >
              Garder mon abonnement
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setPlan("free");
                setShowCancelDialog(false);
              }}
            >
              Confirmer l&apos;annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="border-[#1E293B] bg-[#151D2E]">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              Supprimer votre compte
            </DialogTitle>
            <DialogDescription className="text-neutral-300">
              Cette action est irréversible. Tapez{" "}
              <span className="font-semibold text-white">SUPPRIMER</span> pour confirmer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="delete-confirm" className="text-base font-semibold text-white">Confirmation</Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Tapez "SUPPRIMER"'
              className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              className="text-white hover:bg-[#1C2640]"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmText("");
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== "SUPPRIMER"}
              onClick={handleDeleteAccount}
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
