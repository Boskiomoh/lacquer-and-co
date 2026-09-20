import type { BookingDetails, SchedulingMode, ServiceId, Slot } from "@/lib/schemas/booking";

export type ProviderBookingInput = {
  serviceId: ServiceId;
  date: string;
  time: string;
  start: string;
  details: BookingDetails;
  bookingRef: string;
};

/**
 * The app depends on this interface, never on a vendor SDK. The factory in
 * ./index.ts picks Cal.com when its env vars are present and the local
 * provider otherwise, and `mode` tells the UI which one it got.
 */
export interface SchedulingProvider {
  readonly mode: SchedulingMode;
  /** Open slots for one studio-local day. */
  getAvailability(serviceId: ServiceId, date: string): Promise<Slot[]>;
  /** Studio-local days in a month (YYYY-MM) that have at least one open slot. */
  getOpenDates(serviceId: ServiceId, month: string): Promise<string[]>;
  /** Reserves the slot with the scheduler and returns its id there. */
  createBooking(input: ProviderBookingInput): Promise<{ providerId: string }>;
}
