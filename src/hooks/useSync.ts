"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getSyncStatus,
  pushChanges,
  pullChanges,
  startAutoSync,
  stopAutoSync,
  clearSyncStatus,
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

const CLEAN_STATUS: SyncStatus = {
  lastSyncAt: null,
  isSyncing: false,
  error: null,
  pendingChanges: 0,
};

export function useSync(): UseSyncReturn {
  const { user, isAuthenticated } = useAuth();
  const currentPlan = useSubscriptionStore((s) => s.currentPlan);
  const isProUser = isFeatureAvailable(currentPlan, "sync");

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    typeof window !== "undefined" ? getSyncStatus() : CLEAN_STATUS
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSyncActiveRef = useRef(false);

  // Nettoyer les erreurs stales quand l'utilisateur n'est pas Pro
  useEffect(() => {
    if (!isProUser) {
      clearSyncStatus();
      setSyncStatus(CLEAN_STATUS);
    }
  }, [isProUser]);

  // Rafraîchir le statut périodiquement (seulement si Pro)
  useEffect(() => {
    if (!isProUser) return;
    const interval = setInterval(() => {
      setSyncStatus(getSyncStatus());
    }, 2_000);
    return () => clearInterval(interval);
  }, [isProUser]);

  // Sync manuelle immédiate
  const syncNow = useCallback(async () => {
    if (!isAuthenticated || !user || !isProUser) return;

    try {
      await pushChanges(user.id);
      await pullChanges(user.id);
      setSyncStatus(getSyncStatus());
    } catch (error) {
      setSyncStatus(getSyncStatus());
      // Si le serveur rejette avec 403, arrêter le sync
      if (error instanceof Error && error.message.includes("403")) {
        stopAutoSync();
        autoSyncActiveRef.current = false;
      }
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
