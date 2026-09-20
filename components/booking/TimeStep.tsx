"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { openDatesQuery, slotsQuery } from "@/lib/query/booking-queries";
import { getService } from "@/lib/services";
import { site } from "@/lib/site";
import { addMonths, formatDateLong, formatDateShort, formatTime, monthOf } from "@/lib/time";
import { useBookingDraft } from "./DraftContext";
import { DemoAvailabilityNote, StepLayout } from "./StepLayout";

export function TimeStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { draft, updateDraft } = useBookingDraft();
  const serviceId = draft.serviceId!;
  const date = draft.date!;
  const service = getService(serviceId)!;

  const slots = useQuery(slotsQuery(serviceId, date));
  const empty = slots.isSuccess && slots.data.slots.length === 0;

  // Only needed when the chosen day has filled up: suggest the next open days.
  const thisMonth = useQuery({ ...openDatesQuery(serviceId, monthOf(date)), enabled: empty });
  const nextMonth = useQuery({ ...openDatesQuery(serviceId, addMonths(monthOf(date), 1)), enabled: empty });
  const alternatives = [...(thisMonth.data?.openDates ?? []), ...(nextMonth.data?.openDates ?? [])]
    .filter((d) => d > date)
    .slice(0, 3);

  return (
    <StepLayout
      title="What time will you drop off?"
      intro={
        <>
          {formatDateLong(date)}.{" "}
          {service.days > 1
            ? "Paint correction takes two days, so we collect the keys at 8:00 am."
            : `Ready the same day, about ${service.durationLabel} after drop-off.`}
        </>
      }
      onBack={onBack}
      action={
        <Button onClick={onNext} disabled={!draft.time}>
          Continue
        </Button>
      }
    >
      {slots.data?.mode === "demo" && <DemoAvailabilityNote />}

      {slots.isPending && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Loading drop-off times">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-full bg-surface-alt" />
          ))}
        </div>
      )}

      {slots.isError && (
        <div className="rounded-(--radius-panel) border border-line p-5">
          <p className="font-semibold">Drop-off times did not load.</p>
          <p className="mt-1 text-ink-soft">
            Try again, or call {site.phoneDisplay} and we will find you a slot.
          </p>
          <Button variant="secondary" className="mt-4" onClick={() => slots.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {slots.isSuccess && !empty && (
        <div role="radiogroup" aria-label="Drop-off time" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {slots.data.slots.map((slot) => {
            const checked = draft.time === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => updateDraft((prev) => ({ ...prev, time: slot.time, ref: null }))}
                className={`mono-num h-14 rounded-full border text-base font-medium transition-colors ${
                  checked
                    ? "border-accent bg-accent text-white"
                    : "border-ink/15 bg-surface text-ink hover:border-accent hover:bg-accent-soft hover:text-accent-ink"
                }`}
              >
                {formatTime(slot.time)}
              </button>
            );
          })}
        </div>
      )}

      {empty && (
        <div className="rounded-(--radius-panel) bg-surface-alt/60 p-5">
          <p className="font-semibold">That day has just filled up.</p>
          {alternatives.length > 0 ? (
            <>
              <p className="mt-1 text-ink-soft">These are the next days with a free drop-off:</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {alternatives.map((d) => (
                  <Button
                    key={d}
                    variant="secondary"
                    onClick={() => updateDraft((prev) => ({ ...prev, date: d, time: null, ref: null }))}
                  >
                    {formatDateShort(d)}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-1 text-ink-soft">
              Go back and pick another day, or call {site.phoneDisplay}.
            </p>
          )}
        </div>
      )}
    </StepLayout>
  );
}
