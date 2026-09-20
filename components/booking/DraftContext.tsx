"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { bookingDraftSchema, emptyDraft, type BookingDraft } from "@/lib/schemas/booking";
import { useSessionDraft } from "@/lib/storage/useSessionDraft";

export const DRAFT_KEY = "lacquer:booking-draft";

type DraftContextValue = {
  draft: BookingDraft;
  updateDraft: (next: BookingDraft | ((prev: BookingDraft) => BookingDraft)) => void;
  clearDraft: () => void;
  flushDraft: () => void;
  hydrated: boolean;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function useBookingDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useBookingDraft must be used inside DraftProvider");
  return ctx;
}

/**
 * The Zod-parsed session draft. Lives in the booking modal chunk and on the
 * confirmation route, so the schema library is never part of the home page's
 * initial JavaScript.
 */
export function DraftProvider({ children }: { children: ReactNode }) {
  const { value, update, clear, flush, hydrated } = useSessionDraft(DRAFT_KEY, bookingDraftSchema, emptyDraft);
  const ctx = useMemo(
    () => ({ draft: value, updateDraft: update, clearDraft: clear, flushDraft: flush, hydrated }),
    [value, update, clear, flush, hydrated],
  );
  return <DraftContext.Provider value={ctx}>{children}</DraftContext.Provider>;
}
