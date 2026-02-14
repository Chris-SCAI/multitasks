import { create } from "zustand";
import { db, seedDefaultDomains } from "@/lib/db/local";
import type { Domain, CreateDomainInput, UpdateDomainInput } from "@/types";

interface DomainState {
  domains: Domain[];
  isLoading: boolean;
  error: string | null;

  loadDomains: () => Promise<void>;
  createDomain: (input: CreateDomainInput) => Promise<Domain>;
  updateDomain: (id: string, input: UpdateDomainInput) => Promise<void>;
  deleteDomain: (id: string) => Promise<void>;
  getDomainById: (id: string) => Domain | undefined;
}

export const useDomainStore = create<DomainState>((set, get) => ({
  domains: [],
  isLoading: false,
  error: null,

  loadDomains: async () => {
    set({ isLoading: true, error: null });
    try {
      await seedDefaultDomains();
      const dbDomains = await db.domains.orderBy("order").toArray();
      const domains: Domain[] = dbDomains.map((d) => ({ ...d, id: d.id! }));
      set({ domains, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  createDomain: async (input) => {
    const now = new Date().toISOString();
    const maxOrder = get().domains.reduce(
      (max, d) => Math.max(max, d.order),
      -1
    );
    const id = crypto.randomUUID();
    const newDomain = {
      id,
      name: input.name,
      color: input.color,
      icon: input.icon ?? "folder",
      description: input.description ?? "",
      isDefault: false,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };
    await db.domains.add(newDomain);
    const domain: Domain = { ...newDomain, id };
    set((state) => ({ domains: [...state.domains, domain] }));
    return domain;
  },

  updateDomain: async (id, input) => {
    const now = new Date().toISOString();
    const updates = { ...input, updatedAt: now };
    await db.domains.update(id, updates);
    set((state) => ({
      domains: state.domains.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));
  },

  deleteDomain: async (id) => {
    await db.domains.delete(id);
    set((state) => ({
      domains: state.domains.filter((d) => d.id !== id),
    }));
  },

  getDomainById: (id) => {
    return get().domains.find((d) => d.id === id);
  },
}));
