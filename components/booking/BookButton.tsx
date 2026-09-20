"use client";

import type { ReactNode } from "react";
import type { ServiceId } from "@/lib/schemas/booking";
import { buttonClass } from "@/components/ui/Button";
import { useBooking } from "./BookingContext";

/**
 * Opens the booking flow. Rendered as a link to #booking so it still does
 * something useful before hydration or with JavaScript off.
 */
export function BookButton({
  serviceId,
  variant = "primary",
  size = "md",
  className = "",
  children = "Book a detail",
}: {
  serviceId?: ServiceId;
  variant?: "primary" | "secondary" | "inverse";
  size?: "md" | "lg";
  className?: string;
  children?: ReactNode;
}) {
  const { openBooking } = useBooking();
  return (
    <a
      href="#booking"
      aria-haspopup="dialog"
      className={buttonClass(variant, size, className)}
      onClick={(e) => {
        e.preventDefault();
        openBooking(serviceId);
      }}
    >
      {children}
    </a>
  );
}
