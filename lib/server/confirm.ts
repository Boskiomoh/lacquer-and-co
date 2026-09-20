import "server-only";
import { email } from "@/lib/providers/email";
import type { BookingPublic } from "@/lib/schemas/booking";
import { formatUsd, getService } from "@/lib/services";
import { formatDateLong, formatTime } from "@/lib/time";
import { getStoredBooking, toPublic, updateStoredBooking } from "./bookings-store";

type PaidSession = {
  sessionId: string;
  customerEmail: string | null;
  metadata: { bookingRef: string; serviceId: BookingPublic["serviceId"]; date: string; time: string };
  amountTotal: number | null;
};

/**
 * Marks a booking confirmed after Stripe reports the deposit paid. Shared by
 * the webhook and the confirmation page's session check, and idempotent, so
 * whichever arrives first wins and the email is only sent once.
 */
export async function confirmPaidBooking(session: PaidSession): Promise<BookingPublic> {
  const { bookingRef, serviceId, date, time } = session.metadata;
  const stored = getStoredBooking(bookingRef);

  if (!stored) {
    // Another serverless instance created it. Stripe metadata is enough to
    // show an accurate confirmation.
    return {
      ref: bookingRef,
      serviceId,
      date,
      time,
      status: "confirmed",
      depositCents: session.amountTotal ?? getService(serviceId)?.depositCents ?? 0,
    };
  }

  const booking = updateStoredBooking(bookingRef, {
    status: "confirmed",
    checkoutSessionId: session.sessionId,
  })!;

  if (!booking.confirmationEmailSent) {
    updateStoredBooking(bookingRef, { confirmationEmailSent: true });
    const service = getService(booking.serviceId);
    const result = await email
      .sendBookingConfirmation({
        to: session.customerEmail ?? booking.details.email,
        name: booking.details.name,
        ref: booking.ref,
        serviceName: service?.name ?? booking.serviceId,
        dateLabel: formatDateLong(booking.date),
        timeLabel: formatTime(booking.time),
        depositLabel: formatUsd(booking.depositCents),
      })
      .catch(() => ({ sent: false }));
    if (!result.sent) updateStoredBooking(bookingRef, { confirmationEmailSent: false });
  }

  return toPublic(booking);
}
