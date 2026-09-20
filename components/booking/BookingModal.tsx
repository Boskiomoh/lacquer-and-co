"use client";

import { XIcon } from "@phosphor-icons/react/ssr";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { detailsSchema, type BookingDraft, type BookingStep } from "@/lib/schemas/booking";
import { getService } from "@/lib/services";
import { formatDateShort, formatTime } from "@/lib/time";
import type { OpenRequest } from "./BookingContext";
import { DraftProvider, useBookingDraft } from "./DraftContext";
import { DateStep } from "./DateStep";
import { DepositStep } from "./DepositStep";
import { DetailsStep } from "./DetailsStep";
import { ServiceStep } from "./ServiceStep";
import { TimeStep } from "./TimeStep";

const STEPS: { id: BookingStep; label: string }[] = [
  { id: "service", label: "Package" },
  { id: "date", label: "Day" },
  { id: "time", label: "Drop-off" },
  { id: "details", label: "Details" },
  { id: "deposit", label: "Deposit" },
];

/** Index of the furthest step the draft has everything for. */
function furthestReachable(d: BookingDraft): number {
  if (!d.serviceId) return 0;
  if (!d.date) return 1;
  if (!d.time) return 2;
  if (!detailsSchema.safeParse({ ...d.details, notes: d.details.notes || undefined }).success) return 3;
  return 4;
}

type ModalProps = { open: boolean; request: OpenRequest; onClose: () => void };

export default function BookingModal(props: ModalProps) {
  return (
    <DraftProvider>
      <BookingModalInner {...props} />
    </DraftProvider>
  );
}

function BookingModalInner({ open, request, onClose }: ModalProps) {
  const { draft, updateDraft, hydrated } = useBookingDraft();

  // Apply a package chosen from the page ("Choose this package") once the
  // stored draft has been read, so the choice is not overwritten by it.
  const applied = useRef(0);
  useEffect(() => {
    if (!hydrated || applied.current === request.id) return;
    applied.current = request.id;
    const serviceId = request.serviceId;
    if (!serviceId) return;
    updateDraft((prev) =>
      prev.serviceId === serviceId
        ? { ...prev, step: prev.step === "service" ? "date" : prev.step }
        : { ...prev, serviceId, date: null, time: null, ref: null, step: "date" },
    );
  }, [hydrated, request, updateDraft]);
  const reduce = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);

  const reachable = furthestReachable(draft);
  // Never show a step the draft cannot support (e.g. a stale draft).
  const current = Math.min(
    STEPS.findIndex((s) => s.id === draft.step),
    reachable,
  );
  const step = STEPS[current].id;

  const goTo = (next: BookingStep) => updateDraft((prev) => ({ ...prev, step: next }));

  // Move focus to the new step's heading so screen readers announce it.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    bodyRef.current?.scrollTo({ top: 0 });
    const t = setTimeout(() => bodyRef.current?.querySelector<HTMLElement>("[data-step-heading]")?.focus(), 60);
    return () => clearTimeout(t);
  }, [step]);

  const service = draft.serviceId ? getService(draft.serviceId) : undefined;
  const ticket = [
    service?.name,
    draft.date ? formatDateShort(draft.date) : null,
    draft.time ? formatTime(draft.time) : null,
  ].filter(Boolean);

  return (
    <Dialog open={open} onClose={onClose} labelledBy="booking-title">
      <div className="flex h-full max-h-[inherit] flex-col overflow-hidden bg-surface sm:rounded-(--radius-panel) sm:shadow-(--shadow-raised)">
        <header className="border-b border-line px-5 pt-5 sm:px-8 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="booking-title" className="text-h3 font-black">
                Book a drop-off
              </h2>
              <p className={`mt-1 min-h-6 text-sm text-ink-soft ${ticket.length ? "mono-num" : ""}`} aria-live="polite">
                {ticket.length ? ticket.join("  /  ") : "Five short steps. Your answers are saved as you go."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onClose()}
              aria-label="Close booking"
              className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
            >
              <XIcon size={22} weight="bold" aria-hidden />
            </button>
          </div>

          <ol className="mt-5 grid grid-cols-5 gap-2" aria-label="Booking progress">
            {STEPS.map((s, i) => {
              const state = i === current ? "current" : i < current || i <= reachable ? "open" : "locked";
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    disabled={state === "locked"}
                    aria-current={state === "current" ? "step" : undefined}
                    onClick={() => goTo(s.id)}
                    className="group flex w-full flex-col items-start gap-2 pb-3 text-left disabled:cursor-default"
                  >
                    <span
                      className={`h-1 w-full rounded-full transition-colors duration-300 ${
                        i < current ? "bg-ink" : i === current ? "bg-accent" : "bg-surface-alt"
                      }`}
                    />
                    <span
                      className={`text-[0.8125rem] leading-tight ${
                        state === "current"
                          ? "font-semibold text-ink"
                          : state === "open"
                            ? "text-ink-soft group-hover:text-ink"
                            : "text-ink-faint"
                      }`}
                    >
                      <span className="mono-num mr-1 hidden sm:inline">{i + 1}</span>
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </header>

        <div ref={bodyRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-full flex-col"
            >
              {step === "service" && <ServiceStep onNext={() => goTo("date")} />}
              {step === "date" && <DateStep onBack={() => goTo("service")} onNext={() => goTo("time")} />}
              {step === "time" && <TimeStep onBack={() => goTo("date")} onNext={() => goTo("details")} />}
              {step === "details" && <DetailsStep onBack={() => goTo("time")} onNext={() => goTo("deposit")} />}
              {step === "deposit" && <DepositStep onBack={() => goTo("details")} onDone={onClose} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Dialog>
  );
}
