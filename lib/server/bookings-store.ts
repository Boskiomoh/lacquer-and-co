import "server-only";
import { randomInt } from "node:crypto";
import type { BookingDetails, BookingPublic, BookingStatus, ServiceId } from "@/lib/schemas/booking";

export type StoredBooking = BookingPublic & {
  details: BookingDetails;
  providerId: string;
  checkoutSessionId: string | null;
  confirmationEmailSent: boolean;
  createdAt: string;
};

/*
  Demo persistence: an in-memory map that survives hot reloads in dev. On
  serverless hosting each instance has its own copy, which is why the
  confirmation flow can also recover state from Stripe session metadata and the
  visitor's session draft. A real studio would put this in a database.
*/
const globalStore = globalThis as unknown as { __lacquerBookings?: Map<string, StoredBooking> };
const store = (globalStore.__lacquerBookings ??= new Map<string, StoredBooking>());

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newRef(): string {
  let ref: string;
  do {
    ref = "LQ-" + Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  } while (store.has(ref));
  return ref;
}

export function createStoredBooking(input: {
  ref: string;
  serviceId: ServiceId;
  date: string;
  time: string;
  depositCents: number;
  details: BookingDetails;
  providerId: string;
}): StoredBooking {
  const booking: StoredBooking = {
    ref: input.ref,
    serviceId: input.serviceId,
    date: input.date,
    time: input.time,
    status: "pending",
    depositCents: input.depositCents,
    details: input.details,
    providerId: input.providerId,
    checkoutSessionId: null,
    confirmationEmailSent: false,
    createdAt: new Date().toISOString(),
  };
  store.set(booking.ref, booking);
  return booking;
}

export function getStoredBooking(ref: string): StoredBooking | undefined {
  return store.get(ref);
}

export function updateStoredBooking(ref: string, patch: Partial<StoredBooking>): StoredBooking | undefined {
  const current = store.get(ref);
  if (!current) return undefined;
  const next = { ...current, ...patch };
  store.set(ref, next);
  return next;
}

export function setStatus(ref: string, status: BookingStatus) {
  return updateStoredBooking(ref, { status });
}

/** Slots already taken in this instance, so the local provider can hide them. */
export function takenSlots(serviceId: ServiceId, date: string): Set<string> {
  const taken = new Set<string>();
  for (const b of store.values()) {
    if (b.date === date && b.serviceId === serviceId) taken.add(b.time);
  }
  return taken;
}

export function toPublic(b: StoredBooking): BookingPublic {
  return {
    ref: b.ref,
    serviceId: b.serviceId,
    date: b.date,
    time: b.time,
    status: b.status,
    depositCents: b.depositCents,
  };
}
