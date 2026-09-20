import { z } from "zod";
import { email } from "@/lib/providers/email";
import { scheduling, SlotUnavailableError } from "@/lib/providers/scheduling";
import { bookingRefSchema, createBookingSchema } from "@/lib/schemas/booking";
import { checkoutMetadataSchema } from "@/lib/schemas/stripe";
import { getService } from "@/lib/services";
import { createStoredBooking, getStoredBooking, newRef, toPublic } from "@/lib/server/bookings-store";
import { confirmPaidBooking } from "@/lib/server/confirm";
import { stripe } from "@/lib/server/stripe";
import { site } from "@/lib/site";
import { zonedIso } from "@/lib/time";

const noStore = { "Cache-Control": "no-store" };

// POST /api/bookings: re-validates with the shared schema, reserves the slot
// with the scheduling provider, and creates a pending booking.
export async function POST(request: Request) {
  const parsed = createBookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Some booking details are missing or invalid.", issues: z.flattenError(parsed.error).fieldErrors },
      { status: 400, headers: noStore },
    );
  }
  const { serviceId, date, time, details } = parsed.data;
  const service = getService(serviceId)!;

  const ref = newRef();
  let providerId: string;
  try {
    ({ providerId } = await scheduling.createBooking({
      serviceId,
      date,
      time,
      start: zonedIso(date, time, site.timeZone),
      details,
      bookingRef: ref,
    }));
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return Response.json({ error: error.message, code: "slot_taken" }, { status: 409, headers: noStore });
    }
    console.error("[bookings]", error);
    return Response.json(
      { error: "We could not reach the booking diary. Nothing was charged. Try again in a minute." },
      { status: 502, headers: noStore },
    );
  }

  const booking = createStoredBooking({
    ref,
    serviceId,
    date,
    time,
    depositCents: service.depositCents,
    details,
    providerId,
  });

  return Response.json(
    { booking: toPublic(booking), schedulingMode: scheduling.mode },
    { status: 201, headers: noStore },
  );
}

// GET /api/bookings?ref=LQ-XXXXXX[&session_id=cs_...]: public status for the
// confirmation page. With a session id, Stripe is asked directly, so the page
// can confirm even when the webhook is slow or never arrives.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const ref = bookingRefSchema.safeParse(url.searchParams.get("ref"));
  if (!ref.success) return Response.json({ error: "Invalid booking reference." }, { status: 400, headers: noStore });

  const sessionId = url.searchParams.get("session_id");
  const stored = getStoredBooking(ref.data);
  const modes = { emailMode: email.mode, paymentMode: stripe ? "stripe" : "demo" } as const;

  if (stripe && sessionId && stored?.status !== "confirmed") {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const metadata = checkoutMetadataSchema.safeParse(session.metadata);
      if (metadata.success && metadata.data.bookingRef === ref.data && session.payment_status === "paid") {
        const booking = await confirmPaidBooking({
          sessionId: session.id,
          customerEmail: session.customer_details?.email ?? null,
          metadata: metadata.data,
          amountTotal: session.amount_total,
        });
        return Response.json({ booking, ...modes }, { headers: noStore });
      }
      if (!stored && metadata.success && metadata.data.bookingRef === ref.data) {
        return Response.json(
          {
            booking: { ...metadata.data, ref: ref.data, status: "deposit_pending", depositCents: session.amount_total ?? 0 },
            ...modes,
          },
          { headers: noStore },
        );
      }
    } catch (error) {
      console.error("[bookings] session lookup failed", error);
    }
  }

  if (!stored) return Response.json({ error: "Booking not found." }, { status: 404, headers: noStore });
  return Response.json({ booking: toPublic(stored), ...modes }, { headers: noStore });
}
