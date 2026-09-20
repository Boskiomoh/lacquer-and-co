import { expect, test } from "@playwright/test";
import { calcomBookingResponseSchema, calcomSlotsResponseSchema } from "../lib/schemas/calcom";

// Unit tests for the Cal.com boundary: a vendor payload that changes shape must
// fail here, loudly, instead of leaking undefined into the booking UI.

test.describe("Cal.com slots parser", () => {
  test("accepts the documented v2 shape", () => {
    const parsed = calcomSlotsResponseSchema.parse({
      status: "success",
      data: {
        "2026-09-22": [{ start: "2026-09-22T08:00:00.000-05:00" }, { start: "2026-09-22T09:30:00.000-05:00" }],
        "2026-09-23": [],
      },
    });
    expect(parsed.data["2026-09-22"]).toHaveLength(2);
  });

  test("accepts range format entries with an end time", () => {
    const parsed = calcomSlotsResponseSchema.parse({
      status: "success",
      data: { "2026-09-22": [{ start: "2026-09-22T08:00:00.000-05:00", end: "2026-09-22T14:00:00.000-05:00" }] },
    });
    expect(parsed.data["2026-09-22"][0].end).toBeDefined();
  });

  test("rejects a malformed payload", () => {
    const malformed = [
      { status: "error", data: {} },
      { status: "success", data: { "22/09/2026": [{ start: "2026-09-22T08:00:00Z" }] } },
      { status: "success", data: { "2026-09-22": [{ time: "08:00" }] } },
      { status: "success", data: { "2026-09-22": [{ start: "tomorrow at eight" }] } },
      { status: "success", slots: [] },
    ];
    for (const payload of malformed) {
      expect(calcomSlotsResponseSchema.safeParse(payload).success, JSON.stringify(payload)).toBe(false);
    }
  });
});

test.describe("Cal.com booking parser", () => {
  test("keeps only the fields the app uses", () => {
    const parsed = calcomBookingResponseSchema.parse({
      status: "success",
      data: { id: 1, uid: "abc123", status: "accepted", start: "2026-09-22T13:00:00Z", title: "ignored" },
    });
    expect(parsed.data).toEqual({ uid: "abc123", status: "accepted", start: "2026-09-22T13:00:00Z" });
  });

  test("rejects a booking without a uid", () => {
    expect(
      calcomBookingResponseSchema.safeParse({ status: "success", data: { status: "accepted", start: "2026-09-22T13:00:00Z" } })
        .success,
    ).toBe(false);
  });
});
