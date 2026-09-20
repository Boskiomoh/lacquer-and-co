export type ConfirmationEmail = {
  to: string;
  name: string;
  ref: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  depositLabel: string;
};

export interface EmailProvider {
  readonly mode: "live" | "demo";
  sendBookingConfirmation(email: ConfirmationEmail): Promise<{ sent: boolean }>;
  /** Returns "subscribed" when the provider accepted it, "queued" in demo mode. */
  subscribe(email: string): Promise<"subscribed" | "queued">;
}
