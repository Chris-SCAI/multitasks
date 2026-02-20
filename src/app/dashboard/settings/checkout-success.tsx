"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useSubscriptionStore } from "@/stores/subscription-store";

export function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loadPlanFromServer = useSubscriptionStore((s) => s.loadPlanFromServer);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") !== "success") return;
    let cancelled = false;

    async function refreshPlan() {
      // Retry up to 3 times with 2s delay (webhook may arrive late)
      for (let attempt = 0; attempt < 3; attempt++) {
        if (cancelled) return;
        const updated = await loadPlanFromServer();
        if (updated) break;
        if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
      }
      if (cancelled) return;
      setVisible(true);

      // Clean URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      router.replace(url.pathname + url.search, { scroll: false });
    }

    refreshPlan();

    const timer = setTimeout(() => setVisible(false), 5000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchParams, router, loadPlanFromServer]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-900/50 bg-emerald-900/20 p-4"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500">
            <Check className="size-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-emerald-400">
              Abonnement activé !
            </p>
            <p className="text-sm text-emerald-300/70">
              Votre plan a été mis à jour. Profitez de toutes vos nouvelles
              fonctionnalités.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="ml-auto text-emerald-400/60 transition-colors hover:text-emerald-400"
            aria-label="Fermer"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
