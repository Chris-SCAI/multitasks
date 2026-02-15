"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent, EVENTS } from "@/lib/analytics/track";

export function FinalCTASection() {
  return (
    <section className="relative overflow-hidden border-t border-[#1E293B]/50 px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[400px] w-[600px] rounded-full bg-violet-600/20 blur-[100px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-screen-xl text-center">
        <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
          Prêt à reprendre le contrôle ?
        </h2>
        <p className="mb-12 text-2xl font-bold text-neutral-300 md:text-3xl">
          2 analyses IA offertes. Pas de carte bancaire.
        </p>

        <Button
          asChild
          size="lg"
          className="rounded-full bg-violet-600 px-8 py-6 text-lg text-white shadow-2xl shadow-violet-600/25 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 active:scale-95 sm:px-12 sm:py-8 sm:text-2xl"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-3"
            onClick={() => trackEvent(EVENTS.CTA_FINAL_CLICK)}
          >
            Commencer gratuitement
            <ArrowRight className="size-7" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
