import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe/client";
import Stripe from "stripe";

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const _planId = session.metadata?.planId;
      // In local-first mode, the client updates localStorage plan after redirect
      // In cloud mode, would update Supabase profiles table
      break;
    }
    case "customer.subscription.updated": {
      // Handle plan change
      break;
    }
    case "customer.subscription.deleted": {
      // Handle cancellation - downgrade to free
      break;
    }
  }

  return NextResponse.json({ received: true });
}
