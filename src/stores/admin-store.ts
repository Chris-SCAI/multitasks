import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VIP_STORAGE_KEY } from "@/lib/admin/admin-config";

interface VIPEntry {
  email: string;
  addedAt: string;
  note?: string;
}

interface AdminState {
  vipEmails: VIPEntry[];
  addVIPEmail: (email: string, note?: string) => void;
  removeVIPEmail: (email: string) => void;
  isVIP: (email: string) => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      vipEmails: [],
      addVIPEmail: (email, note) =>
        set((state) => {
          const lower = email.toLowerCase();
          if (state.vipEmails.some((v) => v.email === lower)) return state;
          return {
            vipEmails: [
              ...state.vipEmails,
              { email: lower, addedAt: new Date().toISOString(), note },
            ],
          };
        }),
      removeVIPEmail: (email) =>
        set((state) => ({
          vipEmails: state.vipEmails.filter(
            (v) => v.email !== email.toLowerCase()
          ),
        })),
      isVIP: (email) =>
        get().vipEmails.some((v) => v.email === email.toLowerCase()),
    }),
    { name: VIP_STORAGE_KEY }
  )
);
