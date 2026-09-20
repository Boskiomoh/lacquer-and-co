import { checkoutRequestSchema, type CheckoutResponse } from "@/lib/schemas/booking";
import { getService } from "@/lib/services";
import { getStoredBooking, updateStoredBooking } from "@/lib/server/bookings-store";
import { stripe } from "@/lib/server/stripe";
import { formatDateLong, formatTime } from "@/lib/time";

const noStore = { "Cache-Control": "no-store" };

// POST /api/checkout: creates a Stripe Checkout Session for the deposit. With
// no Stripe key, or if Stripe fails, the booking is held as deposit_pending and
// the visitor lands on the confirmation page with a reference: never a dead end.
export async function POST(request: Request) {
  const parsed = checkoutRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid booking reference." }, { status: 400, headers: noStore });

  const booking = getStoredBooking(parsed.data.ref);
  if (!booking) {
    return Response.json(
      { error: "This booking has expired. Please start again, your details are still filled in." },
      { status: 404, headers: noStore },
    );
  }
  if (booking.status === "confirmed") {
    const body: CheckoutResponse = { kind: "held", reason: "demo", redirect: `/booking/confirmation?ref=${booking.ref}` };
    return Response.json(body, { headers: noStore });
  }

  const held = (reason: "demo" | "stripe_error"): CheckoutResponse => {
    updateStoredBooking(booking.ref, { status: "deposit_pending" });
    return { kind: "held", reason, redirect: `/booking/confirmation?ref=${booking.ref}` };
  };

  if (!stripe) return Response.json(held("demo"), { headers: noStore });

  const service = getService(booking.serviceId)!;
  const origin = new URL(request.url).origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.details.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: booking.depositCents,
            product_data: {
              name: `Deposit: ${service.name}`,
              description: `Drop-off ${formatDateLong(booking.date)} at ${formatTime(booking.time)}. Ref ${booking.ref}.`,
            },
          },
        },
      ],
      metadata: { bookingRef: booking.ref, serviceId: booking.serviceId, date: booking.date, time: booking.time },
      success_url: `${origin}/booking/confirmation?ref=${booking.ref}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?booking=resume#booking`,
    });
    updateStoredBooking(booking.ref, { status: "deposit_pending", checkoutSessionId: session.id });
    if (!session.url) return Response.json(held("stripe_error"), { headers: noStore });
    const body: CheckoutResponse = { kind: "stripe", url: session.url };
    return Response.json(body, { headers: noStore });
  } catch (error) {
    console.error("[checkout]", error);
    return Response.json(held("stripe_error"), { headers: noStore });
  }
}
