import "server-only";
import { noopEmail } from "./noop";
import { createResendEmail } from "./resend";
import type { EmailProvider } from "./types";

export type { EmailProvider } from "./types";

function createEmail(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return noopEmail;
  // The sandbox sender works without a verified domain.
  return createResendEmail(apiKey, process.env.RESEND_FROM ?? "Lacquer & Co. <onboarding@resend.dev>");
}

export const email = createEmail();
