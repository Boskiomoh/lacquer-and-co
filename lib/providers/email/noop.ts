import "server-only";
import type { EmailProvider } from "./types";

/** Demo fallback: logs instead of sending, so the flow never fails on email. */
export const noopEmail: EmailProvider = {
  mode: "demo",
  async sendBookingConfirmation(email) {
    console.info(`[email:demo] booking confirmation for ${email.ref} not sent (RESEND_API_KEY unset)`);
    return { sent: false };
  },
  async subscribe() {
    console.info("[email:demo] newsletter signup queued (RESEND_API_KEY unset)");
    return "queued";
  },
};
