import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe/client";
import { getApiUser } from "@/lib/auth/get-api-user";

export async function POST() {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe non configuré" },
      { status: 503 }
    );
  }

  const authResult = await getApiUser();
  if (!authResult.ok) {
    return authResult.response;
  }

  const { user, supabase } = authResult.data;

  // Retrieve stripe_customer_id from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Aucun abonnement Stripe trouvé" },
      { status: 400 }
    );
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/dashboard/settings?tab=abonnement`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[portal] Failed to create portal session", {
      userId: user.id,
      error: err instanceof Error ? err.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Impossible de créer la session du portail" },
      { status: 500 }
    );
  }
}
