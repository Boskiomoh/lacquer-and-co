import "server-only";
import { createHash } from "node:crypto";
import type { ServiceId, Slot } from "@/lib/schemas/booking";
import { getService } from "@/lib/services";
import { site } from "@/lib/site";
import { takenSlots } from "@/lib/server/bookings-store";
import { addDays, daysInMonth, todayInZone, weekday, zonedIso } from "@/lib/time";
import type { SchedulingProvider } from "./types";

/*
  Demo availability that behaves like a real diary: closed Sunday and Monday,
  bookable from tomorrow for 60 days, multi-day packages need the next day
  open, and a stable pseudo-random share of slots is already taken so the
  calendar is never suspiciously empty. Slots booked in this instance disappear.
*/
const HORIZON_DAYS = 60;

function score(key: string): number {
  return createHash("sha256").update(key).digest().readUInt32BE(0) / 0xffffffff;
}

function isOpenDay(date: string): boolean {
  const d = weekday(date);
  return d >= 2 && d <= 6;
}

function inWindow(date: string): boolean {
  const today = todayInZone(site.timeZone);
  return date > today && date <= addDays(today, HORIZON_DAYS);
}

function slotsFor(serviceId: ServiceId, date: string): Slot[] {
  const service = getService(serviceId);
  if (!service || !inWindow(date) || !isOpenDay(date)) return [];
  for (let i = 1; i < service.days; i++) {
    if (!isOpenDay(addDays(date, i))) return [];
  }
  // Roughly one day in nine is fully booked.
  if (score(`full:${date}`) < 0.11) return [];

  const taken = takenSlots(serviceId, date);
  return service.dropOffTimes
    .filter((time) => score(`${serviceId}:${date}:${time}`) > 0.3 && !taken.has(time))
    .map((time) => ({ time, start: zonedIso(date, time, site.timeZone) }));
}

export const localScheduling: SchedulingProvider = {
  mode: "demo",
  async getAvailability(serviceId, date) {
    return slotsFor(serviceId, date);
  },
  async getOpenDates(serviceId, month) {
    return daysInMonth(month).filter((date) => slotsFor(serviceId, date).length > 0);
  },
  async createBooking(input) {
    const open = slotsFor(input.serviceId, input.date).some((s) => s.time === input.time);
    if (!open) throw new SlotUnavailableError();
    return { providerId: `local_${input.bookingRef}` };
  },
};

export class SlotUnavailableError extends Error {
  constructor() {
    super("That drop-off time has just been taken.");
    this.name = "SlotUnavailableError";
  }
}
