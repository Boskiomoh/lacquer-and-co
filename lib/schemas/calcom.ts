import { z } from "zod";

/**
 * Cal.com API v2 payloads, parsed at the boundary so a vendor shape change
 * fails loudly here instead of leaking undefined into the UI.
 * GET /v2/slots (cal-api-version 2024-09-04), default "time" format.
 */
export const calcomSlotsResponseSchema = z.object({
  status: z.literal("success"),
  data: z.record(
    z.iso.date(),
    z.array(
      z.object({
        start: z.iso.datetime({ offset: true }),
        end: z.iso.datetime({ offset: true }).optional(),
      }),
    ),
  ),
});
export type CalcomSlotsResponse = z.infer<typeof calcomSlotsResponseSchema>;

/** POST /v2/bookings (cal-api-version 2026-02-25), only the fields we use. */
export const calcomBookingResponseSchema = z.object({
  status: z.literal("success"),
  data: z.object({
    uid: z.string().min(1),
    status: z.string(),
    start: z.iso.datetime({ offset: true }),
  }),
});
export type CalcomBookingResponse = z.infer<typeof calcomBookingResponseSchema>;
