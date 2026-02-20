import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  if (stripeInstance) return stripeInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  stripeInstance = new Stripe(secretKey, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
    timeout: 30000,
    maxNetworkRetries: 2,
  });

  return stripeInstance;
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}
