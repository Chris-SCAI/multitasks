import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getPlan, type PlanConfig } from "@/lib/stripe/plans";

interface SubscriptionState {
  currentPlan: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  billingPeriod: "monthly" | "annual";

  getPlanConfig: () => PlanConfig;
  setPlan: (planId: string) => void;
  setStripeIds: (customerId: string, subscriptionId: string) => void;
  setBillingPeriod: (period: "monthly" | "annual") => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      currentPlan: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      billingPeriod: "monthly",

      getPlanConfig: () => getPlan(get().currentPlan),
      setPlan: (planId) => set({ currentPlan: planId }),
      setStripeIds: (customerId, subscriptionId) =>
        set({
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
        }),
      setBillingPeriod: (period) => set({ billingPeriod: period }),
    }),
    { name: "multitasks-subscription" }
  )
);
