"use client";

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
      <div>
        <h2 className="mb-6 text-2xl font-bold text-white">Mes domaines</h2>
        <DomainSkeleton />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Mes domaines</h2>
      <div className="max-w-lg">
        <DomainManager
          domains={domains}
          onCreateDomain={createDomain}
          onUpdateDomain={updateDomain}
          onDeleteDomain={deleteDomain}
        />
      </div>
    </div>
  );
}
