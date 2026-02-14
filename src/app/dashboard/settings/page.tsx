"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Tags, CreditCard, Download, AlertTriangle, Check } from "lucide-react";
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
import { useUIStore } from "@/stores/ui-store";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { useAnalysisStore } from "@/stores/analysis-store";

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Utilisateur");
  const [language, setLanguage] = useState("fr");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const { theme, setTheme } = useUIStore();
  const { domains, createDomain, updateDomain, deleteDomain } =
    useDomainStore();
  const { currentPlan, setPlan } = useSubscriptionStore();
  const quotaInfo = useAnalysisStore((s) => s.quotaInfo);
  const planId = currentPlan as "free" | "ia_quotidienne" | "pro_sync";
  const isPaid = planId !== "free";

  const tasks = useTaskStore((s) => s.tasks);
  const loadTasks = useTaskStore((s) => s.loadTasks);

  // Charger le nom depuis localStorage + charger les tâches si vide
  useEffect(() => {
    const saved = localStorage.getItem("multitasks-display-name");
    if (saved) setDisplayName(saved);
    if (tasks.length === 0) loadTasks();
  }, [tasks.length, loadTasks]);

  function handleSaveProfile() {
    localStorage.setItem("multitasks-display-name", displayName);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
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
    await db.tasks.clear();
    await db.domains.clear();
    localStorage.removeItem("multitasks-ui");
    localStorage.removeItem("multitasks-subscription");
    localStorage.removeItem("multitasks-quota");
    localStorage.removeItem("multitasks-display-name");
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Paramètres
        </h1>
        <p className="mt-1 text-base font-medium text-neutral-300">
          Gérez votre profil, vos domaines et vos préférences.
        </p>
      </div>

      <Tabs defaultValue="profil">
        <TabsList className="w-full border-[#1E293B] bg-[#151D2E] sm:w-auto">
          <TabsTrigger value="profil" className="gap-1.5 data-[state=active]:bg-violet-600/20 data-[state=active]:text-violet-400">
            <User className="size-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="domaines" className="gap-1.5 data-[state=active]:bg-violet-600/20 data-[state=active]:text-violet-400">
            <Tags className="size-4" />
            <span className="hidden sm:inline">Domaines</span>
          </TabsTrigger>
          <TabsTrigger value="abonnement" className="gap-1.5 data-[state=active]:bg-violet-600/20 data-[state=active]:text-violet-400">
            <CreditCard className="size-4" />
            <span className="hidden sm:inline">Abonnement</span>
          </TabsTrigger>
          <TabsTrigger value="donnees" className="gap-1.5 data-[state=active]:bg-violet-600/20 data-[state=active]:text-violet-400">
            <Download className="size-4" />
            <span className="hidden sm:inline">Données</span>
          </TabsTrigger>
          <TabsTrigger value="compte" className="gap-1.5 data-[state=active]:bg-violet-600/20 data-[state=active]:text-violet-400">
            <AlertTriangle className="size-4" />
            <span className="hidden sm:inline">Compte</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="mt-6">
          <div className="max-w-lg space-y-6 rounded-lg border border-[#1E293B] bg-[#151D2E] p-6">
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
              <Label className="text-base font-semibold text-white">Thème</Label>
              <Select
                value={theme}
                onValueChange={(v) =>
                  setTheme(v as "light" | "dark" | "system")
                }
              >
                <SelectTrigger className="w-full border-[#1E293B] bg-[#0B1120] text-white focus:ring-2 focus:ring-violet-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#1E293B] bg-[#151D2E]">
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
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
              className="rounded-full bg-violet-600 text-white hover:bg-violet-500"
              onClick={handleSaveProfile}
            >
              {profileSaved ? (
                <>
                  <Check className="size-4" />
                  Sauvegardé !
                </>
              ) : (
                "Sauvegarder"
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="domaines" className="mt-6">
          <div className="max-w-lg rounded-lg border border-[#1E293B] bg-[#151D2E] p-6">
            <DomainManager
              domains={domains}
              onCreateDomain={createDomain}
              onUpdateDomain={updateDomain}
              onDeleteDomain={deleteDomain}
            />
          </div>
        </TabsContent>

        <TabsContent value="abonnement" className="mt-6">
          <div className="max-w-lg space-y-6 rounded-lg border border-[#1E293B] bg-[#151D2E] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">
                  Plan actuel
                </h3>
                <p className="mt-1 text-base text-neutral-300">
                  Gérez votre abonnement Multitasks.
                </p>
              </div>
              <PlanBadge planId={planId} size="md" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-neutral-300">
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
                className="flex-1 bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:from-violet-600 hover:to-blue-600"
                onClick={() => router.push("/dashboard/pricing")}
              >
                Changer de plan
              </Button>
              {isPaid && (
                <Button
                  variant="outline"
                  className="flex-1 border-red-900/50 text-red-400 hover:bg-red-900/10 hover:text-red-300"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Annuler l&apos;abonnement
                </Button>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="donnees" className="mt-6">
          <div className="max-w-lg space-y-4 rounded-lg border border-[#1E293B] bg-[#151D2E] p-6">
            <h3 className="font-semibold text-white">
              Export de données
            </h3>
            <p className="text-base text-neutral-300">
              Exportez vos tâches et analyses dans le format de votre choix.
            </p>
            <FeatureGate feature="export">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1 border-[#1E293B] text-white hover:bg-[#1C2640]"
                  onClick={handleExportCSV}
                >
                  <Download className="size-4" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-[#1E293B] text-white hover:bg-[#1C2640]"
                  onClick={handleExportPDF}
                >
                  <Download className="size-4" />
                  Export PDF
                </Button>
              </div>
            </FeatureGate>
          </div>
        </TabsContent>

        <TabsContent value="compte" className="mt-6">
          <div className="max-w-lg space-y-4 rounded-lg border border-red-900/50 bg-[#151D2E] p-6">
            <h3 className="font-semibold text-red-400">
              Zone dangereuse
            </h3>
            <p className="text-base text-neutral-300">
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
    </div>
  );
}
