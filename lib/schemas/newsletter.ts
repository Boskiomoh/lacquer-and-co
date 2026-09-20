import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email("Enter an email address like name@example.com."),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const newsletterResponseSchema = z.object({
  /** subscribed: Resend accepted it. queued: demo mode, logged server-side. */
  status: z.enum(["subscribed", "queued"]),
});
export type NewsletterResponse = z.infer<typeof newsletterResponseSchema>;
