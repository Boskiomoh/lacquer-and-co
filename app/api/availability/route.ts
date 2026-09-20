import { z } from "zod";
import { scheduling } from "@/lib/providers/scheduling";
import {
  dateSchema,
  monthSchema,
  serviceIdSchema,
  type AvailabilityResponse,
  type MonthAvailabilityResponse,
} from "@/lib/schemas/booking";

// GET /api/availability?service=signature&date=2026-09-22  -> slots for a day
// GET /api/availability?service=signature&month=2026-09     -> open days in a month
// Proxies the scheduling provider so the Cal.com key never leaves the server.
const querySchema = z.union([
  z.object({ service: serviceIdSchema, date: dateSchema }),
  z.object({ service: serviceIdSchema, month: monthSchema }),
]);

const headers = { "Cache-Control": "private, max-age=30" };

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return Response.json({ error: "Pass service plus a date (YYYY-MM-DD) or month (YYYY-MM)." }, { status: 400 });
  }

  try {
    if ("date" in parsed.data) {
      const { service, date } = parsed.data;
      const body: AvailabilityResponse = {
        mode: scheduling.mode,
        serviceId: service,
        date,
        slots: await scheduling.getAvailability(service, date),
      };
      return Response.json(body, { headers });
    }
    const { service, month } = parsed.data;
    const body: MonthAvailabilityResponse = {
      mode: scheduling.mode,
      serviceId: service,
      month,
      openDates: await scheduling.getOpenDates(service, month),
    };
    return Response.json(body, { headers });
  } catch (error) {
    console.error("[availability]", error);
    return Response.json(
      { error: "The booking diary did not respond. Try again, or call the studio." },
      { status: 502 },
    );
  }
}
