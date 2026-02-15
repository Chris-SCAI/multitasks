"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { trackEvent, EVENTS } from "@/lib/analytics/track";

function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Comment ça marche", href: "#how-it-works" },
    { label: "Tarifs", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="relative z-50 mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-6 sm:px-8 sm:py-7 lg:px-12 lg:py-8">
      <Link href="/" className="flex items-center gap-4">
        <Sparkles className="size-10 text-yellow-400" />
        <span className="text-5xl font-bold">
          <span className="text-white">Multi</span>
          <span className="text-violet-400">Tasks</span>
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden items-center gap-11 md:flex">
        {links.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            className="text-2xl font-semibold text-white transition-colors hover:text-violet-400"
          >
            {link.label}
          </button>
        ))}
        <Link
          href="/login"
          className="text-2xl font-semibold text-white transition-colors hover:text-violet-400"
        >
          Connexion
        </Link>
        <Button
          asChild
          size="lg"
          className="rounded-full bg-violet-600 px-9 py-4 text-xl text-white hover:bg-violet-500"
        >
          <Link href="/register">Commencer</Link>
        </Button>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex size-10 items-center justify-center rounded-lg text-neutral-400 hover:text-white md:hidden"
        aria-label="Menu"
      >
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-[#1E293B] bg-[#0B1120] p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-lg px-3 py-2.5 text-left text-base text-neutral-300 hover:bg-[#151D2E]"
              >
                {link.label}
              </button>
            ))}
            <Link href="/login" className="rounded-lg px-3 py-2.5 text-base text-neutral-300 hover:bg-[#151D2E]">
              Connexion
            </Link>
            <Button asChild className="mt-2 w-full rounded-full bg-violet-600 text-base text-white hover:bg-violet-500">
              <Link href="/register">Commencer</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

function AvantApresCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#1E293B] bg-[#151D2E] shadow-2xl shadow-violet-500/10 transition-all duration-300 hover:shadow-[0_25px_60px_-12px_rgba(124,58,237,0.35)]"
    >
      {/* AVANT — zone de chaos */}
      <div className="relative bg-gradient-to-br from-red-950/30 to-transparent p-8 lg:p-10">
        <div className="absolute right-4 top-4 size-24 rounded-full bg-red-500/5 blur-2xl" />
        <div className="mb-5 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-widest text-red-300">AVANT</span>
          <span className="animate-pulse rounded-full bg-red-500/25 px-4 py-1.5 text-sm font-bold text-red-400 ring-1 ring-red-500/30">
            2 deadlines
          </span>
        </div>
        <div className="mb-4 flex items-baseline gap-6">
          <div>
            <span className="text-6xl font-extrabold text-red-400 lg:text-7xl">47</span>
            <span className="ml-2 text-lg font-semibold text-neutral-300">tâches</span>
          </div>
          <div>
            <span className="text-6xl font-extrabold text-red-400 lg:text-7xl">4</span>
            <span className="ml-2 text-lg font-semibold text-neutral-300">apps</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="size-3 animate-pulse rounded-full bg-amber-500" />
          <span className="text-base font-semibold text-amber-300">Priorités floues</span>
        </div>
      </div>

      {/* Separator gradient */}
      <div className="h-px bg-gradient-to-r from-red-500/30 via-[#1E293B] to-emerald-500/30" />

      {/* APRÈS — zone de clarté */}
      <div className="relative bg-gradient-to-br from-emerald-950/20 to-transparent p-8 lg:p-10">
        <div className="absolute right-4 top-4 size-24 rounded-full bg-emerald-500/5 blur-2xl" />
        <div className="mb-5 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-widest text-emerald-300">APRÈS</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/30">
            <svg className="size-4" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Faire maintenant
          </span>
        </div>

        <div className="rounded-xl border border-emerald-500/10 bg-[#0B1120] p-5 shadow-lg shadow-emerald-500/5">
          <p className="mb-2.5 text-xl font-semibold text-white">Relancer devis client A</p>
          <div className="flex items-center gap-4 text-base font-semibold text-emerald-300">
            <span className="inline-flex items-center gap-2">
              <svg className="size-5" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1"/>
                <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              ~12 min
            </span>
            <span>17h00</span>
          </div>
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-4 text-lg font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-xl hover:shadow-violet-600/30 active:scale-[0.98]">
          <svg className="size-6" viewBox="0 0 16 16" fill="none">
            <path d="M2 8l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Appliquer
        </button>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const scrollToDemo = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[600px] w-[800px] rounded-full bg-violet-600/8 blur-[120px]" />
        </div>
      </div>

      <LandingNav />

      <div className="relative mx-auto max-w-screen-2xl px-6 pb-20 pt-12 sm:px-8 lg:px-12 lg:pb-28 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              To-do partout.
              <br />
              <span className="text-violet-400 sm:whitespace-nowrap">Priorités nulle part.</span>
            </h1>
            <p className="mt-6 text-3xl font-semibold text-[#3B5CFF] sm:text-4xl lg:text-5xl">
              On tranche. Tu avances.
            </p>
            <p className="mt-8 max-w-2xl text-xl font-bold leading-relaxed text-neutral-300 lg:text-2xl">
              20 tâches en vrac ? L&apos;IA les trie, les priorise et te donne
              un plan d&apos;attaque en 10 secondes.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-violet-600 px-10 py-7 text-xl text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/30 active:scale-95"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3"
                  onClick={() => trackEvent(EVENTS.CTA_HERO_CLICK)}
                >
                  Commencer gratuitement
                  <ArrowRight className="size-6" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={scrollToDemo}
                className="rounded-full border border-[#1E293B] px-10 py-7 text-xl font-semibold text-white hover:bg-[#151D2E] active:scale-95"
              >
                <Play className="mr-2 size-6" />
                Voir la démo
              </Button>
            </div>
          </motion.div>

          {/* Right: AVANT/APRES Card */}
          <div className="flex justify-center lg:justify-end">
            <AvantApresCard />
          </div>
        </div>
      </div>
    </section>
  );
}
