"use client";

import { Button } from "@/components/ui/Button";
import { formatUsd, services } from "@/lib/services";
import { useBookingDraft } from "./DraftContext";
import { StepLayout } from "./StepLayout";

export function ServiceStep({ onNext }: { onNext: () => void }) {
  const { draft, updateDraft } = useBookingDraft();

  return (
    <StepLayout
      title="Which package?"
      intro="Prices are fixed for cars and SUVs. The deposit comes off the final bill."
      action={
        <Button onClick={onNext} disabled={!draft.serviceId}>
          Continue
        </Button>
      }
    >
      <div role="radiogroup" aria-label="Package" className="grid gap-3">
        {services.map((s) => {
          const checked = draft.serviceId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() =>
                updateDraft((prev) =>
                  prev.serviceId === s.id ? prev : { ...prev, serviceId: s.id, date: null, time: null, ref: null },
                )
              }
              className={`grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 rounded-(--radius-panel) border p-4 text-left transition-[border-color,background-color,box-shadow] sm:p-5 ${
                checked
                  ? "border-accent bg-accent-soft/60 shadow-[inset_0_0_0_1px_var(--color-accent)]"
                  : "border-line bg-surface hover:border-ink/35"
              }`}
            >
              <span className="text-lg font-semibold text-ink">{s.name}</span>
              <span className="mono-num text-lg font-medium text-ink">{formatUsd(s.priceCents)}</span>
              <span className="text-[0.9375rem] text-ink-soft">{s.summary}</span>
              <span className="mono-num whitespace-nowrap text-right text-sm text-ink-soft">
                {s.durationLabel}
                <br />
                {formatUsd(s.depositCents)} deposit
              </span>
            </button>
          );
        })}
      </div>
    </StepLayout>
  );
}
