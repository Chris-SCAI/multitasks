import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripeClient } from "@/lib/stripe/client";
import { PLANS } from "@/lib/stripe/plans";
import Stripe from "stripe";

/**
 * Build a reverse lookup: Stripe price ID → plan ID.
 */
function buildPriceToPlanMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [planId, plan] of Object.entries(PLANS)) {
    if (plan.stripePriceIdMonthly) map[plan.stripePriceIdMonthly] = planId;
    if (plan.stripePriceIdAnnual) map[plan.stripePriceIdAnnual] = planId;
  }
  return map;
}

/**
 * Create a Supabase admin client (service role) to bypass RLS.
 */
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const adminSupabase = getAdminSupabase();
  if (!adminSupabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      try {
        const session = event.data.object as Stripe.Checkout.Session;
        const planId = session.metadata?.planId;
        const userId = session.metadata?.userId;
        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;

        if (!planId) break;

        // Validate planId against known plans
        if (!PLANS[planId]) {
          console.error("[webhook] checkout.session.completed: unknown planId", {
            planId,
            customerId,
          });
          break;
        }

        // Find the user: prefer metadata userId, fallback to email lookup
        let targetUserId = userId;

        if (!targetUserId && session.customer_email) {
          // Paginated search for user by email
          let matchedUser = null;
          let page = 1;
          const perPage = 100;
          while (!matchedUser) {
            const { data } = await adminSupabase.auth.admin.listUsers({
              page,
              perPage,
            });
            if (!data?.users?.length) break;
            matchedUser = data.users.find(
              (u) => u.email === session.customer_email
            );
            if (data.users.length < perPage) break;
            page++;
          }
          if (matchedUser) {
            targetUserId = matchedUser.id;
          }
        }

        // Last fallback: find by stripe_customer_id
        if (!targetUserId && customerId) {
          const { data: profile } = await adminSupabase
            .from("profiles")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .single();
          if (profile) targetUserId = profile.id;
        }

        if (!targetUserId) {
          console.error(
            "[webhook] checkout.session.completed: user not found",
            { customerId }
          );
          break;
        }

        const { error: updateError } = await adminSupabase
          .from("profiles")
          .update({
            plan: planId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUserId);

        if (updateError) {
          console.error(
            "[webhook] checkout.session.completed: DB update failed",
            {
              userId: targetUserId,
              planId,
              error: updateError.message,
            }
          );
          return NextResponse.json(
            { error: "Database update failed" },
            { status: 500 }
          );
        }

        console.log("[webhook] checkout.session.completed: success", {
          userId: targetUserId,
          planId,
          customerId,
        });
      } catch (err) {
        console.error(
          "[webhook] checkout.session.completed: unexpected error",
          { error: err instanceof Error ? err.message : "Unknown" }
        );
        return NextResponse.json(
          { error: "Internal error" },
          { status: 500 }
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      try {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;

        if (!customerId) break;

        const priceId = subscription.items.data[0]?.price?.id;
        if (!priceId) break;

        const priceToPlan = buildPriceToPlanMap();
        const newPlanId = priceToPlan[priceId];
        if (!newPlanId) break;

        const { error: updateError } = await adminSupabase
          .from("profiles")
          .update({
            plan: newPlanId,
            stripe_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (updateError) {
          console.error(
            "[webhook] customer.subscription.updated: DB update failed",
            {
              customerId,
              newPlanId,
              error: updateError.message,
            }
          );
          return NextResponse.json(
            { error: "Database update failed" },
            { status: 500 }
          );
        }

        console.log("[webhook] customer.subscription.updated: success", {
          customerId,
          newPlanId,
        });
      } catch (err) {
        console.error(
          "[webhook] customer.subscription.updated: unexpected error",
          { error: err instanceof Error ? err.message : "Unknown" }
        );
        return NextResponse.json(
          { error: "Internal error" },
          { status: 500 }
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      try {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;

        if (!customerId) break;

        const { error: updateError } = await adminSupabase
          .from("profiles")
          .update({
            plan: "free",
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (updateError) {
          console.error(
            "[webhook] customer.subscription.deleted: DB update failed",
            {
              customerId,
              error: updateError.message,
            }
          );
          return NextResponse.json(
            { error: "Database update failed" },
            { status: 500 }
          );
        }

        console.log("[webhook] customer.subscription.deleted: success", {
          customerId,
        });
      } catch (err) {
        console.error(
          "[webhook] customer.subscription.deleted: unexpected error",
          { error: err instanceof Error ? err.message : "Unknown" }
        );
        return NextResponse.json(
          { error: "Internal error" },
          { status: 500 }
        );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
