import "server-only";
import type { ServiceId, Slot } from "@/lib/schemas/booking";
import { calcomBookingResponseSchema, calcomSlotsResponseSchema } from "@/lib/schemas/calcom";
import { site } from "@/lib/site";
import { addDays, addMonths, dateInZone, timeInZone } from "@/lib/time";
import { SlotUnavailableError } from "./local";
import type { SchedulingProvider } from "./types";

const API = "https://api.cal.com/v2";

export type CalcomConfig = {
  apiKey: string;
  eventTypeIds: Record<ServiceId, number>;
};

async function calFetch(path: string, init: RequestInit & { apiVersion: string }, apiKey: string) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": init.apiVersion,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  const body: unknown = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}

export function createCalcomScheduling(config: CalcomConfig): SchedulingProvider {
  async function slotsInRange(serviceId: ServiceId, start: string, end: string) {
    const params = new URLSearchParams({
      eventTypeId: String(config.eventTypeIds[serviceId]),
      start,
      end,
      timeZone: site.timeZone,
    });
    const res = await calFetch(`/slots?${params}`, { method: "GET", apiVersion: "2024-09-04" }, config.apiKey);
    if (!res.ok) throw new Error(`Cal.com slots request failed with ${res.status}`);
    // Throws a ZodError if Cal.com changes the payload shape.
    return calcomSlotsResponseSchema.parse(res.body).data;
  }

  return {
    mode: "live",
    async getAvailability(serviceId, date) {
      const data = await slotsInRange(serviceId, date, addDays(date, 1));
      const slots: Slot[] = (data[date] ?? [])
        .filter((s) => dateInZone(s.start, site.timeZone) === date)
        .map((s) => ({ time: timeInZone(s.start, site.timeZone), start: s.start }));
      return slots;
    },
    async getOpenDates(serviceId, month) {
      const end = `${addMonths(month, 1)}-01`;
      const data = await slotsInRange(serviceId, `${month}-01`, end);
      return Object.entries(data)
        .filter(([date, slots]) => date.startsWith(month) && slots.length > 0)
        .map(([date]) => date)
        .sort();
    },
    async createBooking(input) {
      const res = await calFetch(
        "/bookings",
        {
          method: "POST",
          apiVersion: "2026-02-25",
          body: JSON.stringify({
            start: new Date(input.start).toISOString(),
            eventTypeId: config.eventTypeIds[input.serviceId],
            attendee: {
              name: input.details.name,
              email: input.details.email,
              timeZone: site.timeZone,
            },
            metadata: { bookingRef: input.bookingRef, vehicle: input.details.vehicle.slice(0, 500) },
          }),
        },
        config.apiKey,
      );
      if (res.status === 400 || res.status === 409) throw new SlotUnavailableError();
      if (!res.ok) throw new Error(`Cal.com booking request failed with ${res.status}`);
      const parsed = calcomBookingResponseSchema.parse(res.body);
      return { providerId: parsed.data.uid };
    },
  };
}
