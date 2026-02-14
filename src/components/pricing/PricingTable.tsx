"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PLANS, STUDENT_DISCOUNT, type PlanConfig } from "@/lib/stripe/plans";
import { PlanBadge } from "./PlanBadge";

interface PricingTableProps {
  currentPlan: string;
  billingPeriod: "monthly" | "annual";
  onSelectPlan: (planId: string) => void;
  onToggleBilling: (period: "monthly" | "annual") => void;
}

const allFeatures = [
  { key: "domains", label: "Domaines" },
  { key: "tasks", label: "Tâches" },
  { key: "analyses", label: "Analyses IA" },
  { key: "reminders", label: "Rappels" },
  { key: "calendar", label: "Calendrier" },
  { key: "sync", label: "Sync cloud" },
  { key: "export", label: "Export CSV + PDF" },
  { key: "support", label: "Support prioritaire" },
] as const;

function getFeatureValue(
  plan: PlanConfig,
  key: (typeof allFeatures)[number]["key"]
): { available: boolean; label: string } {
  switch (key) {
    case "domains":
      return {
        available: true,
        label: plan.limits.domains ? `${plan.limits.domains} domaines` : "Illimités",
      };
    case "tasks":
      return {
        available: true,
        label: plan.limits.tasks ? `${plan.limits.tasks} tâches` : "Illimitées",
      };
    case "analyses": {
      const periodLabel =
        plan.limits.analysisPeriod === "lifetime"
          ? "à vie"
          : plan.limits.analysisPeriod === "monthly"
            ? "/ mois"
            : "/ jour";
      return {
        available: true,
        label: `${plan.limits.analysesPerPeriod} ${periodLabel}`,
      };
    }
    case "reminders":
      return {
        available: true,
        label: plan.limits.remindersPerDay
          ? `${plan.limits.remindersPerDay} / jour`
          : "Illimités",
      };
    case "calendar":
      return {
        available: true,
        label: plan.limits.calendarViews.includes("month")
          ? "Semaine + Mois"
          : "Semaine",
      };
    case "sync":
      return { available: plan.limits.sync, label: plan.limits.sync ? "Multi-appareils" : "" };
    case "export":
      return { available: plan.limits.export, label: plan.limits.export ? "CSV + PDF" : "" };
    case "support":
      return {
        available: plan.id === "pro_sync",
        label: plan.id === "pro_sync" ? "Prioritaire" : "",
      };
    default:
      return { available: false, label: "" };
  }
}

const planOrder: PlanConfig["id"][] = ["free", "ia_quotidienne", "pro_sync"];

export function PricingTable({
  currentPlan,
  billingPeriod,
  onSelectPlan,
  onToggleBilling,
}: PricingTableProps) {
  const isAnnual = billingPeriod === "annual";

  return (
    <div className="space-y-8">
      {/* Toggle mensuel/annuel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center gap-3"
      >
        <Label
          htmlFor="billing-toggle"
          className={cn(
            "cursor-pointer text-base font-medium transition-colors",
            !isAnnual
              ? "text-white"
              : "text-neutral-500"
          )}
        >
          Mensuel
        </Label>
        <Switch
          id="billing-toggle"
          checked={isAnnual}
          onCheckedChange={(checked) =>
            onToggleBilling(checked ? "annual" : "monthly")
          }
        />
        <Label
          htmlFor="billing-toggle"
          className={cn(
            "cursor-pointer text-base font-medium transition-colors",
            isAnnual
              ? "text-white"
              : "text-neutral-500"
          )}
        >
          Annuel
        </Label>
        {isAnnual && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full bg-green-900/30 px-2 py-0.5 text-xs font-semibold text-green-400"
          >
            ~2 mois offerts
          </motion.span>
        )}
      </motion.div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {planOrder.map((planId, index) => {
          const plan = PLANS[planId];
          const isPro = planId === "pro_sync";
          const isCurrent = currentPlan === planId;
          const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
          const monthlyEquivalent = isAnnual
            ? Math.round((plan.priceAnnual / 12) * 100) / 100
            : plan.priceMonthly;

          return (
            <motion.div
              key={planId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-6 transition-shadow",
                isPro
                  ? "scale-[1.02] border-transparent bg-[#151D2E] shadow-xl"
                  : "border-[#1E293B] bg-[#151D2E] shadow-sm"
              )}
            >
              {/* Gradient border for Pro */}
              {isPro && (
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500 to-blue-500 opacity-100" style={{ zIndex: -1 }} />
              )}
              {isPro && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[#151D2E]" style={{ zIndex: -1, margin: "1px" }} />
              )}

              {/* Badge "Meilleur choix" */}
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-3 py-1 text-sm font-semibold text-white shadow-md">
                    <Sparkles className="size-3" />
                    Meilleur choix
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-white">
                    {plan.name}
                  </h3>
                  <PlanBadge planId={planId} size="sm" />
                </div>
                <p className="text-base text-neutral-300">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={`${planId}-${billingPeriod}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "text-4xl font-bold",
                      isPro
                        ? "bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent"
                        : "text-white"
                    )}
                  >
                    {price === 0 ? "0" : isAnnual ? `${price}` : `${price.toFixed(2).replace(".", ",")}`}
                  </motion.span>
                  <span className="text-xl font-medium text-neutral-400">
                    {price === 0 ? "€" : isAnnual ? "€/an" : "€/mois"}
                  </span>
                </div>
                {isAnnual && price > 0 && (
                  <div className="mt-1 space-y-0.5">
                    <p className="text-base text-neutral-500 line-through">
                      {(plan.priceMonthly * 12).toFixed(2).replace(".", ",")}€/an
                    </p>
                    <p className="text-sm font-medium text-green-400">
                      soit {monthlyEquivalent.toFixed(2).replace(".", ",")}€/mois
                    </p>
                  </div>
                )}
                {isPro && (
                  <p className="mt-2 text-sm font-medium text-violet-400">
                    {STUDENT_DISCOUNT.annualPriceWithDiscount}€/an (offre étudiante)
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mb-6 flex-1 space-y-3">
                {allFeatures.map((feature) => {
                  const val = getFeatureValue(plan, feature.key);
                  return (
                    <li key={feature.key} className="flex items-center gap-2.5 text-base">
                      {val.available ? (
                        <Check className="size-4 shrink-0 text-green-500" />
                      ) : (
                        <X className="size-4 shrink-0 text-neutral-600" />
                      )}
                      <span
                        className={cn(
                          val.available
                            ? "text-neutral-300"
                            : "text-neutral-600"
                        )}
                      >
                        {val.available ? val.label || feature.label : feature.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <Button variant="outline" disabled className="w-full">
                  Plan actuel
                </Button>
              ) : isPro ? (
                <Button
                  className="w-full bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg transition-shadow hover:from-violet-600 hover:to-blue-600 hover:shadow-xl"
                  onClick={() => onSelectPlan(planId)}
                >
                  Choisir
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => onSelectPlan(planId)}
                >
                  Choisir
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
