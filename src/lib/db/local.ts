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
  }
}

export const db = new MultitasksDB();

export async function seedDefaultDomains(): Promise<void> {
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
}
