"use client";

import { motion } from "framer-motion";
import { Tags } from "lucide-react";
import { useDomains } from "@/hooks/useDomains";
import { DomainManager } from "@/components/domains/DomainManager";

function DomainSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded-lg border border-[#1E293B] bg-[#151D2E] p-4"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-[#1E293B]" />
            <div className="h-5 w-32 rounded bg-[#1E293B]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DomainsPage() {
  const { domains, isLoading, createDomain, updateDomain, deleteDomain } =
    useDomains();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-600/20">
            <Tags className="size-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Mes domaines</h1>
            <p className="text-sm text-neutral-300">
              Organisez vos tâches par domaine de responsabilité
            </p>
          </div>
        </div>
        <div className="mt-6">
          <DomainSkeleton />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-600/20">
          <Tags className="size-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Mes domaines</h1>
          <p className="text-sm text-neutral-300">
            Organisez vos tâches par domaine de responsabilité
          </p>
        </div>
      </div>

      {domains.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1E293B] bg-[#151D2E]/50 px-6 py-12 text-center">
          <svg
            className="mb-4 size-16 text-neutral-500"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M8 20h48" stroke="currentColor" strokeWidth="2" />
            <rect x="16" y="28" width="14" height="6" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="34" y="28" width="14" height="6" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="16" y="38" width="14" height="6" rx="2" fill="currentColor" opacity="0.3" />
          </svg>
          <h3 className="text-lg font-semibold text-white">
            Aucun domaine
          </h3>
          <p className="mt-1 max-w-sm text-sm text-neutral-400">
            Créez votre premier domaine pour organiser vos tâches par catégorie (Pro, Perso, Urgent...).
          </p>
        </div>
      ) : (
        <div className="mt-6 max-w-lg">
          <DomainManager
            domains={domains}
            onCreateDomain={createDomain}
            onUpdateDomain={updateDomain}
            onDeleteDomain={deleteDomain}
          />
        </div>
      )}
    </motion.div>
  );
}
