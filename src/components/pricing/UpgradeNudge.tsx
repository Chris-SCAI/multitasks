"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type NudgeFeature = "sync" | "export" | "month_calendar" | "analyses";

interface UpgradeNudgeProps {
  feature: NudgeFeature;
  onDismiss: () => void;
  onViewPricing: () => void;
  visible?: boolean;
}

const featureMessages: Record<NudgeFeature, { label: string; plan: string }> = {
  sync: { label: "la sync cloud", plan: "Pro" },
  export: { label: "les exports", plan: "Pro" },
  month_calendar: { label: "la vue mensuelle", plan: "Étudiant" },
  analyses: { label: "plus d'analyses IA", plan: "Pro" },
};

export function UpgradeNudge({
  feature,
  onDismiss,
  onViewPricing,
  visible = true,
}: UpgradeNudgeProps) {
  const msg = featureMessages[feature];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-50 p-4 md:bottom-4 md:left-auto md:right-4 md:max-w-md"
        >
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 shadow-xl">
            <p className="flex-1 text-sm font-medium text-white">
              Débloquez {msg.label} avec le plan {msg.plan}
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="shrink-0 bg-white text-violet-700 hover:bg-neutral-100"
              onClick={onViewPricing}
            >
              Voir les offres
            </Button>
            <button
              onClick={onDismiss}
              className="shrink-0 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
