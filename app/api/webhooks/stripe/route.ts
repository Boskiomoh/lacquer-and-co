import { checkoutSessionCompletedSchema } from "@/lib/schemas/stripe";
import { confirmPaidBooking } from "@/lib/server/confirm";
import { stripe } from "@/lib/server/stripe";

// POST /api/webhooks/stripe. Order matters: verify the signature against the
// raw body first, only then parse the payload, only then act on it.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return Response.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });

  const rawBody = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const parsed = checkoutSessionCompletedSchema.safeParse(event);
  if (!parsed.success) {
    console.error("[webhook] unexpected checkout.session.completed shape", parsed.error.issues);
    return Response.json({ error: "Unexpected payload." }, { status: 400 });
  }

  const session = parsed.data.data.object;
  if (session.payment_status === "paid") {
    await confirmPaidBooking({
      sessionId: session.id,
      customerEmail: session.customer_details?.email ?? null,
      metadata: session.metadata,
      amountTotal: session.amount_total,
    });
  }
  return Response.json({ received: true });
}
