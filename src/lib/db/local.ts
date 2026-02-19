import Dexie, { type Table } from "dexie";

export interface DBTask {
  id?: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  domainId: string | null;
  tags: string[];
  dueDate: string | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  recurrenceRule: { frequency: "daily" | "weekly" | "monthly" | "yearly" } | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface DBDomain {
  id?: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  isDefault: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

class MultitasksDB extends Dexie {
  tasks!: Table<DBTask, string>;
  domains!: Table<DBDomain, string>;

  constructor() {
    super("MultitasksDB");

    this.version(1).stores({
      tasks: "id, status, priority, domainId, dueDate, order, createdAt",
      domains: "id, name, order, isDefault",
    });

    this.version(2).stores({
      tasks: "id, status, priority, domainId, dueDate, order, createdAt",
      domains: "id, name, order, isDefault",
    }).upgrade((tx) => {
      return tx.table("tasks").toCollection().modify((task) => {
        if (task.recurrenceRule === undefined) {
          task.recurrenceRule = null;
        }
      });
    });
  }
}

export const db = new MultitasksDB();

let seedingPromise: Promise<void> | null = null;

export function seedDefaultDomains(): Promise<void> {
  if (!seedingPromise) {
    seedingPromise = _seedDefaultDomains().finally(() => {
      seedingPromise = null;
    });
  }
  return seedingPromise;
}

async function _seedDefaultDomains(): Promise<void> {
  await db.transaction("rw", db.domains, async () => {
    const count = await db.domains.count();
    if (count > 0) return;

    const now = new Date().toISOString();
    await db.domains.bulkAdd([
      {
        id: crypto.randomUUID(),
        name: "Personnel",
        color: "#3B82F6",
        icon: "user",
        description: "Tâches personnelles et vie quotidienne",
        isDefault: true,
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: "Professionnel",
        color: "#10B981",
        icon: "briefcase",
        description: "Travail et projets professionnels",
        isDefault: true,
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: "Études",
        color: "#8B5CF6",
        icon: "graduation-cap",
        description: "Formation et apprentissage",
        isDefault: true,
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  });
}

export async function deduplicateDomains(): Promise<void> {
  const all = await db.domains.orderBy("order").toArray();
  const seen = new Map<string, string>();
  const toDelete: string[] = [];

  for (const d of all) {
    if (seen.has(d.name)) {
      toDelete.push(d.id!);
    } else {
      seen.set(d.name, d.id!);
    }
  }

  if (toDelete.length > 0) {
    await db.domains.bulkDelete(toDelete);
  }
}
