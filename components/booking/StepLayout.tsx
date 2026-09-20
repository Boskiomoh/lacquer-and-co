"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

/** Shared anatomy for every booking step: heading, body, sticky footer. */
export function StepLayout({
  title,
  intro,
  children,
  onBack,
  action,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  action: ReactNode;
}) {
  return (
    <>
      <div className="flex-1 px-5 py-6 sm:px-8 sm:py-7">
        <h3 data-step-heading tabIndex={-1} className="font-sans text-xl font-semibold tracking-tight focus:outline-none">
          {title}
        </h3>
        {intro && <div className="mt-1.5 max-w-[56ch] text-ink-soft">{intro}</div>}
        <div className="mt-6">{children}</div>
      </div>
      <footer className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-line bg-surface/95 px-5 py-4 backdrop-blur-sm sm:px-8">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="-ml-2 inline-flex h-11 items-center gap-2 rounded-full px-3 font-semibold text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
          >
            <ArrowLeftIcon size={18} weight="bold" aria-hidden />
            Back
          </button>
        ) : (
          <span />
        )}
        {action}
      </footer>
    </>
  );
}

/** Honest disclosure shown whenever the scheduling provider is in fallback. */
export function DemoAvailabilityNote() {
  return (
    <p className="mb-5 rounded-(--radius-input) bg-steel-soft px-4 py-3 text-sm text-steel">
      <strong className="font-semibold">Demo availability.</strong> Cal.com is not connected on this deployment, so
      these slots are simulated. Everything else works as it would live.
    </p>
  );
}
