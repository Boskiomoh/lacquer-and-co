"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ServiceId } from "@/lib/schemas/booking";

// The modal, its steps, the draft and the schema library are split out of the
// initial bundle and only downloaded the first time someone opens booking.
const BookingModal = dynamic(() => import("./BookingModal"), { ssr: false });

/** Each call to openBooking creates a new request, so reopening re-applies it. */
export type OpenRequest = { id: number; serviceId?: ServiceId };

const BookingContext = createContext<{ openBooking: (serviceId?: ServiceId) => void } | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<OpenRequest | null>(null);

  const openBooking = useCallback((serviceId?: ServiceId) => {
    setRequest((prev) => ({ id: (prev?.id ?? 0) + 1, serviceId }));
    setOpen(true);
  }, []);

  // Returning from a cancelled Stripe Checkout lands on /?booking=resume:
  // reopen the flow exactly where the visitor left it.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("booking") !== "resume") return;
    url.searchParams.delete("booking");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    // Reading the URL has to wait for hydration, so opening happens in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    openBooking();
  }, [openBooking]);

  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      {request && <BookingModal open={open} request={request} onClose={() => setOpen(false)} />}
    </BookingContext.Provider>
  );
}
