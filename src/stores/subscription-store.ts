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
  loadPlanFromServer: () => Promise<boolean>;
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

      loadPlanFromServer: async (): Promise<boolean> => {
        try {
          const { createClient } = await import(
            "@/lib/db/supabase-client"
          );
          const supabase = createClient();
          if (!supabase) return false;

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return false;

          const { data: profile } = await supabase
            .from("profiles")
            .select("plan, stripe_customer_id, stripe_subscription_id")
            .eq("id", user.id)
            .single();

          if (profile) {
            set({
              currentPlan: profile.plan ?? "free",
              stripeCustomerId: profile.stripe_customer_id ?? null,
              stripeSubscriptionId: profile.stripe_subscription_id ?? null,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    { name: "multitasks-subscription" }
  )
);
