import type { ServiceId } from "@/lib/schemas/booking";

export const qk = {
  availability: (serviceId: ServiceId, date: string) => ["availability", serviceId, date] as const,
  openDates: (serviceId: ServiceId, month: string) => ["open-dates", serviceId, month] as const,
  booking: (ref: string) => ["booking", ref] as const,
};

/** Only these roots are written to sessionStorage; nothing holding customer details. */
export const persistedRoots = new Set(["availability", "open-dates"]);
