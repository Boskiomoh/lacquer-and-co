import { availabilityResponseSchema, monthAvailabilityResponseSchema, type ServiceId } from "@/lib/schemas/booking";
import { fetchJson } from "./fetch-json";
import { qk } from "./keys";

export function openDatesQuery(serviceId: ServiceId, month: string) {
  return {
    queryKey: qk.openDates(serviceId, month),
    queryFn: () => fetchJson(`/api/availability?service=${serviceId}&month=${month}`, monthAvailabilityResponseSchema),
  };
}

export function slotsQuery(serviceId: ServiceId, date: string) {
  return {
    queryKey: qk.availability(serviceId, date),
    queryFn: () => fetchJson(`/api/availability?service=${serviceId}&date=${date}`, availabilityResponseSchema),
  };
}
