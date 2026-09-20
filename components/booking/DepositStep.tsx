"use client";

import { LockSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ApiError, fetchJson } from "@/lib/query/fetch-json";
import { checkoutResponseSchema, createBookingResponseSchema } from "@/lib/schemas/booking";
import { formatUsd, getService } from "@/lib/services";
import { formatDateLong, formatTime } from "@/lib/time";
import { useBookingDraft } from "./DraftContext";
import { StepLayout } from "./StepLayout";

export function DepositStep({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const { draft, updateDraft, flushDraft } = useBookingDraft();
  const router = useRouter();
  const service = getService(draft.serviceId!)!;

  const pay = useMutation({
    mutationFn: async () => {
      let ref = draft.ref;
      if (!ref) {
        const created = await fetchJson("/api/bookings", createBookingResponseSchema, {
          method: "POST",
          body: JSON.stringify({
            serviceId: draft.serviceId,
            date: draft.date,
            time: draft.time,
            details: { ...draft.details, notes: draft.details.notes || undefined },
          }),
        });
        ref = created.booking.ref;
        updateDraft((prev) => ({ ...prev, ref: created.booking.ref }));
      }
      return fetchJson("/api/checkout", checkoutResponseSchema, {
        method: "POST",
        body: JSON.stringify({ ref }),
      });
    },
    onSuccess: (result) => {
      // Write the draft now: the next thing that happens may be leaving the site.
      flushDraft();
      if (result.kind === "stripe") {
        window.location.assign(result.url);
      } else {
        onDone();
        router.push(result.redirect);
      }
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 404) updateDraft((prev) => ({ ...prev, ref: null }));
    },
  });

  const slotTaken = pay.error instanceof ApiError && pay.error.code === "slot_taken";

  const rows: [string, string][] = [
    ["Package", service.name],
    ["Drop-off", `${formatDateLong(draft.date!)}, ${formatTime(draft.time!)}`],
    ["Vehicle", draft.details.vehicle],
    ["Name", draft.details.name],
    ["Total on collection", formatUsd(service.priceCents)],
  ];

  return (
    <StepLayout
      title="Hold the slot with a deposit"
      intro={`${formatUsd(service.depositCents)} now, taken off the ${formatUsd(service.priceCents)} total when you collect.`}
      onBack={onBack}
      action={
        <Button onClick={() => pay.mutate()} disabled={pay.isPending || pay.isSuccess} aria-busy={pay.isPending}>
          {pay.isPending || pay.isSuccess ? "Holding your slot..." : `Pay ${formatUsd(service.depositCents)} deposit`}
        </Button>
      }
    >
      <dl className="divide-y divide-line rounded-(--radius-panel) border border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[9rem_1fr] gap-3 px-4 py-3 text-[0.9375rem] sm:px-5">
            <dt className="text-ink-soft">{label}</dt>
            <dd className="font-medium text-ink">{value}</dd>
          </div>
        ))}
        <div className="grid grid-cols-[9rem_1fr] gap-3 bg-accent-soft/60 px-4 py-3 sm:px-5">
          <dt className="font-semibold text-accent-ink">Deposit now</dt>
          <dd className="mono-num text-lg font-medium text-accent-ink">{formatUsd(service.depositCents)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex gap-3 rounded-(--radius-input) bg-warning/12 px-4 py-3 text-sm text-warning-ink">
        <LockSimpleIcon size={20} weight="bold" aria-hidden className="mt-px shrink-0" />
        <p>
          <strong className="font-semibold">Stripe test mode.</strong> No real money moves. Card details are entered on
          Stripe&rsquo;s own page, never here. Use the test card{" "}
          <span className="mono-num whitespace-nowrap">4242 4242 4242 4242</span>, any future date and any CVC.
        </p>
      </div>

      {pay.isError && (
        <div role="alert" className="mt-5 flex gap-3 rounded-(--radius-input) border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <WarningCircleIcon size={20} weight="bold" aria-hidden className="mt-px shrink-0" />
          <div>
            <p className="font-semibold">{pay.error.message}</p>
            {slotTaken ? (
              <button type="button" onClick={onBack} className="mt-1 font-semibold underline">
                Choose another time
              </button>
            ) : (
              <p className="mt-1">Your details are saved. Nothing has been charged.</p>
            )}
          </div>
        </div>
      )}
    </StepLayout>
  );
}
