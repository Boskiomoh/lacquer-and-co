import "server-only";
import Stripe from "stripe";

/*
  Stripe has no fallback implementation on purpose: a payment provider that
  silently no-ops is a bad idea even in a demo. Without a key, checkout holds
  the booking as deposit_pending and the UI says so.

  This is a demo that must never take real money, so a live key is refused.
*/
const raw = process.env.STRIPE_SECRET_KEY;
const isTestKey = !!raw && (raw.startsWith("sk_test_") || raw.startsWith("rk_test_"));

if (raw && !isTestKey) {
  console.error("[stripe] STRIPE_SECRET_KEY is not a test key; Stripe is disabled for this demo.");
}

export const stripe = isTestKey ? new Stripe(raw) : null;
