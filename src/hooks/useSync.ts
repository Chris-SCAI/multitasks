"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getSyncStatus,
  pushChanges,
  pullChanges,
  startAutoSync,
  stopAutoSync,
  type SyncStatus,
} from "@/lib/db/sync-engine";
import { useAuth } from "./useAuth";
import { useSubscriptionStore } from "@/stores/subscription-store";
import { isFeatureAvailable } from "@/lib/stripe/plans";

interface UseSyncReturn {
  syncStatus: SyncStatus;
  syncNow: () => Promise<void>;
  startSync: () => void;
  stopSync: () => void;
  isProUser: boolean;
}

const AUTO_SYNC_INTERVAL_MS = 30_000; // 30 secondes
const DEBOUNCE_MS = 5_000; // 5 secondes

export function useSync(): UseSyncReturn {
  const { user, isAuthenticated } = useAuth();
  const currentPlan = useSubscriptionStore((s) => s.currentPlan);
  const isProUser = isFeatureAvailable(currentPlan, "sync");

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSyncActiveRef = useRef(false);

  // Rafraîchir le statut périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(getSyncStatus());
    }, 2_000);
    return () => clearInterval(interval);
  }, []);

  // Sync manuelle immédiate
  const syncNow = useCallback(async () => {
    if (!isAuthenticated || !user || !isProUser) return;

    try {
      await pushChanges(user.id);
      await pullChanges(user.id);
      setSyncStatus(getSyncStatus());
    } catch (error) {
      console.error("Manual sync failed:", error);
      setSyncStatus(getSyncStatus());
    }
  }, [isAuthenticated, user, isProUser]);

  // Démarrer le sync automatique
  const startSync = useCallback(() => {
    if (!isAuthenticated || !user || !isProUser || autoSyncActiveRef.current)
      return;

    autoSyncActiveRef.current = true;
    startAutoSync(user.id, AUTO_SYNC_INTERVAL_MS);
  }, [isAuthenticated, user, isProUser]);

  // Arrêter le sync automatique
  const stopSync = useCallback(() => {
    autoSyncActiveRef.current = false;
    stopAutoSync();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  // Auto-start si Pro et authentifié
  useEffect(() => {
    if (isAuthenticated && isProUser && user) {
      startSync();
    }

    return () => {
      stopSync();
    };
  }, [isAuthenticated, isProUser, user, startSync, stopSync]);

  return {
    syncStatus,
    syncNow,
    startSync,
    stopSync,
    isProUser,
  };
}
