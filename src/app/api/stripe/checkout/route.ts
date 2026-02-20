import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe/client";
import { PLANS } from "@/lib/stripe/plans";
import { getApiUser } from "@/lib/auth/get-api-user";

const checkoutSchema = z.object({
  planId: z.string().min(1),
  billing: z.enum(["monthly", "annual"]),
});

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe non configuré. Contactez le support." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { planId, billing } = parsed.data;

    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId =
      billing === "annual"
        ? plan.stripePriceIdAnnual
        : plan.stripePriceIdMonthly;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured for this plan" },
        { status: 400 }
      );
    }

    // Try to get authenticated user for customer_email and metadata
    const authResult = await getApiUser();
    const userId = authResult.ok ? authResult.data.user.id : "anon";

    // Student plan requires academic email verification
    if (plan.requiresVerification) {
      if (!authResult.ok) {
        return NextResponse.json(
          { error: "Connexion requise pour le plan Étudiant" },
          { status: 401 }
        );
      }
      const email = authResult.data.user.email ?? "";
      const isAcademic = /\.(edu|ac\.\w{2,}|etu\.\w+|univ-\w+\.\w+|student\.\w+)$/i.test(
        email.split("@")[1] ?? ""
      );
      if (!isAcademic) {
        return NextResponse.json(
          { error: "Le plan Étudiant nécessite une adresse email académique (.edu, .ac.fr, etc.)" },
          { status: 403 }
        );
      }
    }
    const idempotencyKey = `checkout_${userId}_${planId}_${billing}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/settings?checkout=success`,
      cancel_url: `${appUrl}/dashboard/pricing`,
      metadata: { planId },
    };

    if (authResult.ok) {
      const { user, supabase } = authResult.data;

      // Add userId to metadata for webhook mapping
      sessionParams.metadata!.userId = user.id;

      // Check if user already has a stripe_customer_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", user.id)
        .single();

      if (profile?.stripe_customer_id) {
        // Existing Stripe customer — reuse
        sessionParams.customer = profile.stripe_customer_id;
      } else if (user.email) {
        // New customer — pass email for Stripe to create one
        sessionParams.customer_email = user.email;
      }
    }

    const session = await stripe.checkout.sessions.create(
      sessionParams,
      { idempotencyKey },
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Failed to create session", {
      error: err instanceof Error ? err.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
