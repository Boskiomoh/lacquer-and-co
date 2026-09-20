"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { openDatesQuery, slotsQuery } from "@/lib/query/booking-queries";
import { getService } from "@/lib/services";
import { site } from "@/lib/site";
import { addDays, formatDateLong, monthOf, todayInZone } from "@/lib/time";
import { useBookingDraft } from "./DraftContext";
import { DemoAvailabilityNote, StepLayout } from "./StepLayout";

export function DateStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { draft, updateDraft } = useBookingDraft();
  const queryClient = useQueryClient();
  const serviceId = draft.serviceId!;
  const today = todayInZone(site.timeZone);
  const minMonth = monthOf(today);
  const maxMonth = monthOf(addDays(today, 60));
  const [month, setMonth] = useState(draft.date ? monthOf(draft.date) : minMonth);

  const { data, isPending, isError, refetch } = useQuery(openDatesQuery(serviceId, month));
  const openDates = new Set(data?.openDates ?? []);

  return (
    <StepLayout
      title="Which day suits you?"
      intro={`${getService(serviceId)?.name} needs ${getService(serviceId)?.durationLabel}. Struck-through days are full or closed.`}
      onBack={onBack}
      action={
        <Button onClick={onNext} disabled={!draft.date}>
          Continue
        </Button>
      }
    >
      {data?.mode === "demo" && <DemoAvailabilityNote />}

      {isError ? (
        <div className="rounded-(--radius-panel) border border-line p-5">
          <p className="font-semibold">The booking diary did not load.</p>
          <p className="mt-1 text-ink-soft">
            Check your connection and try again, or call {site.phoneDisplay} and we will book you in by phone.
          </p>
          <Button variant="secondary" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <Calendar
          month={month}
          onMonthChange={setMonth}
          minMonth={minMonth}
          maxMonth={maxMonth}
          openDates={openDates}
          selected={draft.date}
          loading={isPending}
          onSelect={(date) => {
            updateDraft((prev) => (prev.date === date ? prev : { ...prev, date, time: null, ref: null }));
            // Warm the next step so the slot grid is instant.
            void queryClient.prefetchQuery(slotsQuery(serviceId, date));
          }}
        />
      )}

      <p className="mt-5 min-h-6 text-[0.9375rem] text-ink-soft" aria-live="polite">
        {draft.date ? (
          <>
            Selected: <strong className="font-semibold text-ink">{formatDateLong(draft.date)}</strong>
          </>
        ) : null}
      </p>
    </StepLayout>
  );
}
