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
          className="skeleton-shimmer rounded-xl border border-[#1E293B] bg-[#151D2E] p-4"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#1E293B]" />
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
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25">
            <Tags className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Mes domaines</h1>
            <p className="text-lg text-neutral-300">
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
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25">
          <Tags className="size-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Mes domaines</h1>
          <p className="text-lg text-neutral-300">
            Organisez vos tâches par domaine de responsabilité
          </p>
        </div>
      </div>

      {domains.length === 0 ? (
        <div className="relative mt-6 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#1E293B] bg-[#151D2E]/50 px-6 py-16 text-center">
          {/* Multiple gradient glows */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-violet-600/15 blur-[100px]" />
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-600/10 blur-[80px]" />
            <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-purple-600/10 blur-[80px]" />
          </div>

          {/* Rich SVG illustration with floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mb-8"
          >
            <svg
              className="w-[20rem] h-auto"
              viewBox="0 0 240 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main folder card — blue */}
              <rect x="30" y="50" width="80" height="55" rx="10" fill="#151D2E" stroke="#3B82F6" strokeWidth="1.5" />
              <rect x="30" y="50" width="35" height="12" rx="6" fill="#3B82F6" opacity="0.3" />
              <rect x="30" y="56" width="80" height="6" fill="#3B82F6" opacity="0.15" />
              <circle cx="50" cy="78" r="6" fill="#3B82F6" opacity="0.3" />
              <rect x="62" y="73" width="35" height="5" rx="2.5" fill="#334155" />
              <rect x="62" y="83" width="25" height="4" rx="2" fill="#1E293B" />

              {/* Second card — green */}
              <rect x="55" y="115" width="80" height="55" rx="10" fill="#151D2E" stroke="#10B981" strokeWidth="1.5" />
              <rect x="55" y="115" width="35" height="12" rx="6" fill="#10B981" opacity="0.3" />
              <rect x="55" y="121" width="80" height="6" fill="#10B981" opacity="0.15" />
              <circle cx="75" cy="143" r="6" fill="#10B981" opacity="0.3" />
              <rect x="87" y="138" width="35" height="5" rx="2.5" fill="#334155" />
              <rect x="87" y="148" width="25" height="4" rx="2" fill="#1E293B" />

              {/* Third card — dashed red (to create) */}
              <rect x="120" y="70" width="80" height="55" rx="10" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4" />
              <circle cx="140" cy="98" r="6" fill="#EF4444" opacity="0.15" />
              <rect x="152" y="93" width="35" height="5" rx="2.5" fill="#EF4444" opacity="0.12" />
              <rect x="152" y="103" width="25" height="4" rx="2" fill="#EF4444" opacity="0.08" />

              {/* Floating "+" button */}
              <g filter="url(#domShadow1)" className="animate-float">
                <circle cx="195" cy="40" r="18" fill="url(#domPlusGradient)" />
                <line x1="195" y1="32" x2="195" y2="48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="187" y1="40" x2="203" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Floating tag badge */}
              <g filter="url(#domShadow2)" className="animate-float-delayed">
                <rect x="0" y="25" width="50" height="24" rx="12" fill="url(#domTagGradient)" />
                <text x="11" y="41" fill="white" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">Tags</text>
              </g>

              {/* Floating color palette */}
              <g className="animate-float">
                <circle cx="210" cy="155" r="8" fill="#3B82F6" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="225" cy="145" r="6" fill="#10B981" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="220" cy="165" r="5" fill="#EF4444" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.5s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* Pulsing stars */}
              <circle cx="15" cy="140" r="2.5" fill="#7C3AED" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="185" cy="185" r="2" fill="#A78BFA" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="15" r="2" fill="#2563EB" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.2s" repeatCount="indefinite" />
              </circle>

              {/* Connecting lines (subtle) */}
              <line x1="110" y1="77" x2="120" y2="82" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <line x1="90" y1="105" x2="80" y2="115" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

              {/* Defs */}
              <defs>
                <linearGradient id="domPlusGradient" x1="177" y1="22" x2="213" y2="58">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="domTagGradient" x1="0" y1="25" x2="50" y2="49">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
                <filter id="domShadow1" x="167" y="14" width="56" height="56" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#7C3AED" floodOpacity="0.35" />
                </filter>
                <filter id="domShadow2" x="-10" y="17" width="70" height="42" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.25" />
                </filter>
              </defs>
            </svg>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative text-3xl font-extrabold tracking-tight text-white"
          >
            Organisez par domaine
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="relative mt-3 max-w-lg text-base text-neutral-400"
          >
            Créez votre premier domaine pour organiser vos tâches par catégorie (Pro, Perso, Urgent...).
          </motion.p>
        </div>
      ) : (
        <div className="mt-8 max-w-3xl">
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
