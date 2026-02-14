import { db } from "./local";
import type { DBTask, DBDomain } from "./local";

export interface SyncStatus {
  lastSyncAt: string | null;
  pendingChanges: number;
  isSyncing: boolean;
  error: string | null;
}

export interface SyncResult {
  pushed: number;
  pulled: number;
  conflicts: number;
  resolvedBy: "local" | "remote";
}

interface SyncConfig {
  apiBaseUrl: string;
  userId: string;
}

let syncIntervalId: number | null = null;
let currentSyncStatus: SyncStatus = {
  lastSyncAt: null,
  pendingChanges: 0,
  isSyncing: false,
  error: null,
};

const SYNC_STATUS_KEY = "multitasks-sync-status";

/**
 * Initialise le statut de sync depuis le localStorage
 */
function loadSyncStatus(): void {
  try {
    const stored = localStorage.getItem(SYNC_STATUS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as SyncStatus;
      currentSyncStatus = {
        ...parsed,
        isSyncing: false, // Ne jamais restaurer isSyncing à true
      };
    }
  } catch (error) {
    console.error("Failed to load sync status:", error);
  }
}

/**
 * Sauvegarde le statut de sync dans le localStorage
 */
function saveSyncStatus(): void {
  try {
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(currentSyncStatus));
  } catch (error) {
    console.error("Failed to save sync status:", error);
  }
}

/**
 * Calcule le nombre de changements en attente basé sur updated_at
 */
async function countPendingChanges(lastSyncAt: string | null): Promise<number> {
  try {
    if (!lastSyncAt) {
      const taskCount = await db.tasks.count();
      const domainCount = await db.domains.count();
      return taskCount + domainCount;
    }

    const tasksChanged = await db.tasks
      .filter((task) => task.updatedAt > lastSyncAt)
      .count();

    const domainsChanged = await db.domains
      .filter((domain) => domain.updatedAt > lastSyncAt)
      .count();

    return tasksChanged + domainsChanged;
  } catch (error) {
    console.error("Failed to count pending changes:", error);
    return 0;
  }
}

/**
 * Résout un conflit entre données locales et distantes
 * Stratégie : Last-write-wins basé sur updated_at
 */
function resolveConflict<T extends { updatedAt: string }>(
  local: T,
  remote: T
): T {
  return new Date(local.updatedAt) > new Date(remote.updatedAt)
    ? local
    : remote;
}

/**
 * Envoie les changements locaux vers Supabase
 */
export async function pushChanges(userId: string): Promise<SyncResult> {
  const config: SyncConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_APP_URL || "",
    userId,
  };

  currentSyncStatus.isSyncing = true;
  currentSyncStatus.error = null;
  saveSyncStatus();

  try {
    const lastSyncAt = currentSyncStatus.lastSyncAt;

    // Récupérer les tâches modifiées
    const tasks = lastSyncAt
      ? await db.tasks.filter((task) => task.updatedAt > lastSyncAt).toArray()
      : await db.tasks.toArray();

    // Récupérer les domaines modifiés
    const domains = lastSyncAt
      ? await db.domains
          .filter((domain) => domain.updatedAt > lastSyncAt)
          .toArray()
      : await db.domains.toArray();

    if (tasks.length === 0 && domains.length === 0) {
      currentSyncStatus.isSyncing = false;
      saveSyncStatus();
      return {
        pushed: 0,
        pulled: 0,
        conflicts: 0,
        resolvedBy: "local",
      };
    }

    // Envoyer les changements vers le serveur
    const response = await fetch(`${config.apiBaseUrl}/api/sync/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({
        tasks,
        domains,
        lastSyncAt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Push failed: ${response.status} ${errorText}`);
    }

    const result: { pushed: number; conflicts: number } = await response.json();

    currentSyncStatus.lastSyncAt = new Date().toISOString();
    currentSyncStatus.pendingChanges = await countPendingChanges(
      currentSyncStatus.lastSyncAt
    );
    currentSyncStatus.isSyncing = false;
    saveSyncStatus();

    return {
      pushed: result.pushed,
      pulled: 0,
      conflicts: result.conflicts,
      resolvedBy: "remote",
    };
  } catch (error) {
    currentSyncStatus.error =
      error instanceof Error ? error.message : "Push failed";
    currentSyncStatus.isSyncing = false;
    saveSyncStatus();
    throw error;
  }
}

/**
 * Récupère les changements depuis Supabase
 */
export async function pullChanges(userId: string): Promise<SyncResult> {
  const config: SyncConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_APP_URL || "",
    userId,
  };

  currentSyncStatus.isSyncing = true;
  currentSyncStatus.error = null;
  saveSyncStatus();

  try {
    const lastSyncAt = currentSyncStatus.lastSyncAt;

    // Récupérer les changements depuis le serveur
    const response = await fetch(`${config.apiBaseUrl}/api/sync/pull`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({
        lastSyncAt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pull failed: ${response.status} ${errorText}`);
    }

    const data: {
      tasks: DBTask[];
      domains: DBDomain[];
    } = await response.json();

    let conflictsResolved = 0;

    // Appliquer les changements de domaines
    for (const remoteDomain of data.domains) {
      const localDomain = await db.domains.get(remoteDomain.id!);

      if (localDomain) {
        // Conflit : résoudre avec last-write-wins
        const resolved = resolveConflict(localDomain, remoteDomain);
        if (resolved === remoteDomain) {
          await db.domains.put(remoteDomain);
          conflictsResolved++;
        }
      } else {
        // Nouveau domaine distant
        await db.domains.put(remoteDomain);
      }
    }

    // Appliquer les changements de tâches
    for (const remoteTask of data.tasks) {
      const localTask = await db.tasks.get(remoteTask.id!);

      if (localTask) {
        // Conflit : résoudre avec last-write-wins
        const resolved = resolveConflict(localTask, remoteTask);
        if (resolved === remoteTask) {
          await db.tasks.put(remoteTask);
          conflictsResolved++;
        }
      } else {
        // Nouvelle tâche distante
        await db.tasks.put(remoteTask);
      }
    }

    currentSyncStatus.lastSyncAt = new Date().toISOString();
    currentSyncStatus.pendingChanges = await countPendingChanges(
      currentSyncStatus.lastSyncAt
    );
    currentSyncStatus.isSyncing = false;
    saveSyncStatus();

    return {
      pushed: 0,
      pulled: data.tasks.length + data.domains.length,
      conflicts: conflictsResolved,
      resolvedBy: "remote",
    };
  } catch (error) {
    currentSyncStatus.error =
      error instanceof Error ? error.message : "Pull failed";
    currentSyncStatus.isSyncing = false;
    saveSyncStatus();
    throw error;
  }
}

/**
 * Retourne l'état actuel du sync
 */
export function getSyncStatus(): SyncStatus {
  loadSyncStatus();
  return { ...currentSyncStatus };
}

/**
 * Démarre le sync automatique avec debounce
 */
export async function startAutoSync(
  userId: string,
  intervalMs: number = 5000
): Promise<void> {
  if (syncIntervalId !== null) {
    stopAutoSync();
  }

  loadSyncStatus();

  // Sync initial
  try {
    await pushChanges(userId);
    await pullChanges(userId);
  } catch (error) {
    console.error("Initial sync failed:", error);
  }

  // Sync périodique
  syncIntervalId = window.setInterval(async () => {
    try {
      if (!currentSyncStatus.isSyncing) {
        const pendingChanges = await countPendingChanges(
          currentSyncStatus.lastSyncAt
        );
        if (pendingChanges > 0) {
          await pushChanges(userId);
        }
        await pullChanges(userId);
      }
    } catch (error) {
      console.error("Auto sync failed:", error);
    }
  }, intervalMs);
}

/**
 * Arrête le sync automatique
 */
export function stopAutoSync(): void {
  if (syncIntervalId !== null) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
}

// Charger le statut au démarrage
if (typeof window !== "undefined") {
  loadSyncStatus();
}
