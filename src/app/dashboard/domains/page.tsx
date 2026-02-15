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
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25">
            <Tags className="size-5 text-white" />
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
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25">
          <Tags className="size-5 text-white" />
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
          {/* Glow décoratif */}
          <div className="pointer-events-none absolute size-32 rounded-full bg-violet-500/10 blur-3xl" />

          <svg
            className="relative mb-4 size-[120px]"
            viewBox="0 0 120 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Card bleue */}
            <rect x="10" y="20" width="45" height="24" rx="6" fill="#3B82F6" opacity="0.15" stroke="#3B82F6" strokeWidth="1.5" />
            <circle cx="22" cy="32" r="4" fill="#3B82F6" opacity="0.4" />
            <rect x="30" y="29" width="18" height="3" rx="1.5" fill="#3B82F6" opacity="0.3" />
            <rect x="30" y="35" width="12" height="2" rx="1" fill="#3B82F6" opacity="0.2" />

            {/* Card verte */}
            <rect x="20" y="50" width="45" height="24" rx="6" fill="#10B981" opacity="0.15" stroke="#10B981" strokeWidth="1.5" />
            <circle cx="32" cy="62" r="4" fill="#10B981" opacity="0.4" />
            <rect x="40" y="59" width="18" height="3" rx="1.5" fill="#10B981" opacity="0.3" />
            <rect x="40" y="65" width="12" height="2" rx="1" fill="#10B981" opacity="0.2" />

            {/* Card rouge dashed */}
            <rect x="55" y="35" width="45" height="24" rx="6" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
            <circle cx="67" cy="47" r="4" fill="#EF4444" opacity="0.2" />
            <rect x="75" y="44" width="18" height="3" rx="1.5" fill="#EF4444" opacity="0.15" />

            {/* Bouton + flottant */}
            <g>
              <circle cx="95" cy="22" r="14" fill="#7C3AED" opacity="0.15" />
              <circle cx="95" cy="22" r="10" fill="#7C3AED" opacity="0.25" />
              <line x1="95" y1="17" x2="95" y2="27" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
              <line x1="90" y1="22" x2="100" y2="22" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
            </g>
          </svg>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg font-semibold text-white"
          >
            Organisez par domaine
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-1 max-w-sm text-sm text-neutral-400"
          >
            Créez votre premier domaine pour organiser vos tâches par catégorie (Pro, Perso, Urgent...).
          </motion.p>
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
