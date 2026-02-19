"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PricingTable } from "@/components/pricing/PricingTable";
import { useSubscriptionStore } from "@/stores/subscription-store";

const faqItems = [
  {
    question: "Puis-je changer de plan ?",
    answer:
      "Oui, à tout moment. Si vous passez à un plan supérieur, la différence est calculée au prorata. Si vous passez à un plan inférieur, le changement prend effet à la fin de la période de facturation en cours.",
  },
  {
    question: "Comment fonctionne l'offre étudiante ?",
    answer:
      "Le plan Étudiant à 2,99\u00a0€/mois (29\u00a0€/an) offre toutes les fonctionnalités premium : domaines illimités, 30 analyses IA/mois, calendrier complet. Vérification par email académique (.edu ou .ac.fr).",
  },
  {
    question: "Que se passe-t-il si j'annule ?",
    answer:
      "Vous conservez l'accès à votre plan jusqu'à la fin de la période payée, puis vous repassez automatiquement au plan Gratuit. Toutes vos données sont conservées, seules les fonctionnalités premium sont désactivées.",
  },
  {
    question: "Les paiements sont-ils sécurisés ?",
    answer:
      "Oui, tous les paiements sont traités par Stripe, leader mondial du paiement en ligne. Nous ne stockons jamais vos informations bancaires.",
  },
  {
    question: "Y a-t-il un engagement ?",
    answer:
      "Aucun engagement. Vous pouvez annuler à tout moment en 2 clics depuis vos paramètres. Pas de frais cachés, pas de pénalités.",
  },
];

export default function PricingPage() {
  const { currentPlan, billingPeriod, setBillingPeriod } = useSubscriptionStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelectPlan(planId: string) {
    if (planId === "free" || planId === currentPlan) return;

    setLoadingPlan(planId);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billing: billingPeriod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Impossible de contacter le serveur. Réessayez plus tard.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Choisir votre plan
        </h1>
        <p className="mt-2 font-semibold text-neutral-300">
          Trouvez le plan qui correspond à vos besoins. Changez à tout moment.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md rounded-xl border border-red-900/50 bg-red-900/20 p-4 text-center text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}

      <PricingTable
        currentPlan={currentPlan}
        billingPeriod={billingPeriod}
        onSelectPlan={handleSelectPlan}
        onToggleBilling={setBillingPeriod}
        loadingPlan={loadingPlan}
      />

      {/* Guarantee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-2 text-base font-semibold text-neutral-300"
      >
        <ShieldCheck className="size-5 text-green-500" />
        <span>30 jours satisfait ou remboursé</span>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mx-auto max-w-2xl"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-white">
          Questions fréquentes
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold text-white">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base font-semibold text-neutral-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}
