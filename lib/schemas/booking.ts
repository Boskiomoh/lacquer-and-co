import { z } from "zod";

export const serviceIdSchema = z.enum(["correction", "signature", "interior"]);
export type ServiceId = z.infer<typeof serviceIdSchema>;

/** A calendar day in studio local time, YYYY-MM-DD. */
export const dateSchema = z.iso.date();
/** A month in studio local time, YYYY-MM. */
export const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
/** A drop-off time in studio local time, HH:MM (24h). */
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const slotSchema = z.object({
  time: timeSchema,
  start: z.iso.datetime({ offset: true }),
});
export type Slot = z.infer<typeof slotSchema>;

export const schedulingModeSchema = z.enum(["live", "demo"]);
export type SchedulingMode = z.infer<typeof schedulingModeSchema>;

export const availabilityResponseSchema = z.object({
  mode: schedulingModeSchema,
  serviceId: serviceIdSchema,
  date: dateSchema,
  slots: z.array(slotSchema),
});
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;

export const monthAvailabilityResponseSchema = z.object({
  mode: schedulingModeSchema,
  serviceId: serviceIdSchema,
  month: monthSchema,
  /** Every bookable day in the month that has at least one open slot. */
  openDates: z.array(dateSchema),
});
export type MonthAvailabilityResponse = z.infer<typeof monthAvailabilityResponseSchema>;

export const detailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter an email address like name@example.com."),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{7,20}$/, "Enter a phone number we can text, digits only."),
  vehicle: z.string().trim().min(2, "Tell us the make and model, for example Mazda MX-5."),
  notes: z.string().trim().max(500, "Keep notes under 500 characters.").optional(),
});
export type BookingDetails = z.infer<typeof detailsSchema>;

export const createBookingSchema = z.object({
  serviceId: serviceIdSchema,
  date: dateSchema,
  time: timeSchema,
  details: detailsSchema,
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const bookingRefSchema = z.string().regex(/^LQ-[A-Z0-9]{6}$/);

export const bookingStatusSchema = z.enum(["pending", "deposit_pending", "confirmed"]);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

/** The public view of a booking. Never carries customer details. */
export const bookingPublicSchema = z.object({
  ref: bookingRefSchema,
  serviceId: serviceIdSchema,
  date: dateSchema,
  time: timeSchema,
  status: bookingStatusSchema,
  depositCents: z.number().int().nonnegative(),
});
export type BookingPublic = z.infer<typeof bookingPublicSchema>;

export const createBookingResponseSchema = z.object({
  booking: bookingPublicSchema,
  schedulingMode: schedulingModeSchema,
});

export const checkoutRequestSchema = z.object({ ref: bookingRefSchema });

export const checkoutResponseSchema = z.discriminatedUnion("kind", [
  /** Stripe is live: send the visitor to hosted Checkout. */
  z.object({ kind: z.literal("stripe"), url: z.url() }),
  /** No Stripe (demo) or Stripe failed: booking is held as deposit_pending. */
  z.object({
    kind: z.literal("held"),
    reason: z.enum(["demo", "stripe_error"]),
    redirect: z.string().startsWith("/"),
  }),
]);
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;

export const bookingStepSchema = z.enum(["service", "date", "time", "details", "deposit"]);
export type BookingStep = z.infer<typeof bookingStepSchema>;

/**
 * The session draft. Parsed on read, so a draft written by an older version of
 * this schema fails closed to an empty booking instead of crashing the modal.
 */
export const bookingDraftSchema = z.object({
  v: z.literal(1),
  step: bookingStepSchema,
  serviceId: serviceIdSchema.nullable(),
  date: dateSchema.nullable(),
  time: timeSchema.nullable(),
  details: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    vehicle: z.string(),
    notes: z.string(),
  }),
  ref: bookingRefSchema.nullable(),
});
export type BookingDraft = z.infer<typeof bookingDraftSchema>;

export const emptyDraft: BookingDraft = {
  v: 1,
  step: "service",
  serviceId: null,
  date: null,
  time: null,
  details: { name: "", email: "", phone: "", vehicle: "", notes: "" },
  ref: null,
};
