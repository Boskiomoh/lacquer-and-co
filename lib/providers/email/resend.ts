import "server-only";
import { Resend } from "resend";
import type { ConfirmationEmail, EmailProvider } from "./types";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function confirmationHtml(e: ConfirmationEmail): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#4e5257">${label}</td><td style="padding:6px 0;font-family:ui-monospace,monospace">${escapeHtml(value)}</td></tr>`;
  return `<div style="font-family:Arial,sans-serif;color:#191a1c;max-width:520px">
  <p>Hi ${escapeHtml(e.name)},</p>
  <p>Your deposit is in and your drop-off is confirmed.</p>
  <table style="border-collapse:collapse">
    ${row("Reference", e.ref)}
    ${row("Package", e.serviceName)}
    ${row("Drop-off", `${e.dateLabel}, ${e.timeLabel}`)}
    ${row("Deposit paid", e.depositLabel)}
  </table>
  <p>Unit 3, 2150 W Carroll Ave, Chicago. Reply to this email if anything changes.</p>
  <p>Lacquer &amp; Co.</p>
</div>`;
}

export function createResendEmail(apiKey: string, from: string): EmailProvider {
  const resend = new Resend(apiKey);
  return {
    mode: "live",
    async sendBookingConfirmation(email) {
      const { error } = await resend.emails.send({
        from,
        to: [email.to],
        subject: `Booking confirmed: ${email.ref}`,
        html: confirmationHtml(email),
      });
      if (error) {
        console.error("[email] confirmation failed", error.message);
        return { sent: false };
      }
      return { sent: true };
    },
    async subscribe(email) {
      const { error } = await resend.contacts.create({ email, unsubscribed: false });
      if (error) throw new Error(error.message);
      return "subscribed";
    },
  };
}
