import "server-only";
import type { ServiceId } from "@/lib/schemas/booking";
import { createCalcomScheduling } from "./calcom";
import { localScheduling } from "./local";
import type { SchedulingProvider } from "./types";

export { SlotUnavailableError } from "./local";
export type { SchedulingProvider } from "./types";

function readEventTypeIds(): Record<ServiceId, number> | null {
  const ids = {
    correction: Number(process.env.CALCOM_EVENT_TYPE_CORRECTION),
    signature: Number(process.env.CALCOM_EVENT_TYPE_SIGNATURE),
    interior: Number(process.env.CALCOM_EVENT_TYPE_INTERIOR),
  };
  return Object.values(ids).every((n) => Number.isInteger(n) && n > 0) ? ids : null;
}

/** Cal.com when the key and all three event type ids are set, demo otherwise. */
function createScheduling(): SchedulingProvider {
  const apiKey = process.env.CALCOM_API_KEY;
  const eventTypeIds = readEventTypeIds();
  if (apiKey && eventTypeIds) return createCalcomScheduling({ apiKey, eventTypeIds });
  return localScheduling;
}

export const scheduling = createScheduling();
