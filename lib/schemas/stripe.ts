import { z } from "zod";
import { bookingRefSchema, dateSchema, serviceIdSchema, timeSchema } from "./booking";

/** Metadata we attach to every Checkout Session. */
export const checkoutMetadataSchema = z.object({
  bookingRef: bookingRefSchema,
  serviceId: serviceIdSchema,
  date: dateSchema,
  time: timeSchema,
});

/**
 * The part of a checkout.session.completed event we act on. Parsed only after
 * the Stripe signature has been verified.
 */
export const checkoutSessionCompletedSchema = z.object({
  type: z.literal("checkout.session.completed"),
  data: z.object({
    object: z.object({
      id: z.string().startsWith("cs_"),
      payment_status: z.enum(["paid", "unpaid", "no_payment_required"]),
      amount_total: z.number().int().nullable(),
      customer_details: z.object({ email: z.string().nullable() }).nullable().optional(),
      metadata: checkoutMetadataSchema,
    }),
  }),
});
