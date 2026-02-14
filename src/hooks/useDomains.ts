"use client";

import { useEffect } from "react";
import { useDomainStore } from "@/stores/domain-store";

export function useDomains() {
  const store = useDomainStore();

  useEffect(() => {
    store.loadDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    domains: store.domains,
    isLoading: store.isLoading,
    error: store.error,
    createDomain: store.createDomain,
    updateDomain: store.updateDomain,
    deleteDomain: store.deleteDomain,
    getDomainById: store.getDomainById,
  };
}
