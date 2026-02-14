"use client";

import { useState } from "react";
import { PricingTable } from "@/components/pricing/PricingTable";

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  const handleSelectPlan = (planId: string) => {
    window.location.href = `/dashboard?plan=${planId}`;
  };

  return (
    <section id="pricing" className="border-t border-[#1E293B]/50 px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-16 text-center">
          <p className="mb-5 text-base font-bold uppercase tracking-widest text-violet-400">
            Tarification
          </p>
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Des tarifs simples et transparents
          </h2>
          <p className="mx-auto max-w-3xl text-xl font-medium text-neutral-300 lg:text-2xl">
            Commence gratuitement, upgrade quand tu veux.
          </p>
        </div>

        <div className="dark">
          <PricingTable
            currentPlan="free"
            billingPeriod={billingPeriod}
            onSelectPlan={handleSelectPlan}
            onToggleBilling={setBillingPeriod}
          />
        </div>
      </div>
    </section>
  );
}
