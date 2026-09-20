"use client";

import { CheckCircleIcon, ClockIcon, HourglassIcon } from "@phosphor-icons/react/ssr";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ApiError, fetchJson } from "@/lib/query/fetch-json";
import { qk } from "@/lib/query/keys";
import { bookingPublicSchema, bookingRefSchema, type BookingPublic } from "@/lib/schemas/booking";
import { formatUsd, getService } from "@/lib/services";
import { site } from "@/lib/site";
import { formatDateLong, formatTime } from "@/lib/time";
import { useBookingDraft } from "./DraftContext";

const statusResponseSchema = z.object({
  booking: bookingPublicSchema,
  emailMode: z.enum(["live", "demo"]),
  paymentMode: z.enum(["stripe", "demo"]),
});

const POLL_MS = 3000;
const POLL_FOR_MS = 60_000;

export function ConfirmationView() {
  const params = useSearchParams();
  const refParam = bookingRefSchema.safeParse(params.get("ref"));
  const ref = refParam.success ? refParam.data : null;
  const sessionId = params.get("session_id");
  const { draft, clearDraft, hydrated } = useBookingDraft();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), POLL_FOR_MS);
    return () => clearTimeout(t);
  }, []);

  const status = useQuery({
    queryKey: qk.booking(ref ?? "none"),
    enabled: !!ref,
    retry: false,
    queryFn: () =>
      fetchJson(
        `/api/bookings?ref=${ref}${sessionId ? `&session_id=${encodeURIComponent(sessionId)}` : ""}`,
        statusResponseSchema,
      ),
    // Poll while Stripe may still be confirming; stop after a minute.
    refetchInterval: (q) => {
      const data = q.state.data;
      if (!data || data.booking.status === "confirmed" || data.paymentMode === "demo") return false;
      return timedOut ? false : POLL_MS;
    },
  });

  const confirmed = status.data?.booking.status === "confirmed";
  useEffect(() => {
    if (confirmed) clearDraft();
  }, [confirmed, clearDraft]);

  if (!ref) {
    return (
      <Panel>
        <h1 className="text-h2 font-black">We could not find that booking.</h1>
        <p className="mt-3 text-ink-soft">The link is missing its reference. Start a new booking, or call {site.phoneDisplay}.</p>
        <ButtonLink href="/#booking" className="mt-6">
          Back to booking
        </ButtonLink>
      </Panel>
    );
  }

  // Server lost the record (e.g. a different serverless instance): the session
  // draft still knows what was booked under this reference.
  const fromDraft: BookingPublic | null =
    hydrated && draft.ref === ref && draft.serviceId && draft.date && draft.time
      ? {
          ref,
          serviceId: draft.serviceId,
          date: draft.date,
          time: draft.time,
          status: "deposit_pending",
          depositCents: getService(draft.serviceId)?.depositCents ?? 0,
        }
      : null;

  const notFound = status.error instanceof ApiError && status.error.status === 404;
  const booking = status.data?.booking ?? (notFound ? fromDraft : null);

  if (status.isPending) {
    return (
      <Panel>
        <div className="h-7 w-40 animate-pulse rounded-full bg-surface-alt" />
        <div className="mt-6 h-12 w-3/4 animate-pulse rounded-(--radius-input) bg-surface-alt" />
        <div className="mt-8 h-40 animate-pulse rounded-(--radius-panel) bg-surface-alt" />
      </Panel>
    );
  }

  if (!booking) {
    return (
      <Panel>
        <h1 className="text-h2 font-black">We could not load booking {ref}.</h1>
        <p className="mt-3 text-ink-soft">
          {status.error?.message ?? "Please try again."} If you paid a deposit, it is safe: call {site.phoneDisplay} and
          quote the reference above.
        </p>
        <Button className="mt-6" onClick={() => status.refetch()}>
          Try again
        </Button>
      </Panel>
    );
  }

  const service = getService(booking.serviceId)!;
  const paymentMode = status.data?.paymentMode ?? "demo";
  const stillChecking =
    !confirmed && paymentMode === "stripe" && !!sessionId && !timedOut && !notFound;

  let badge, heading, body;
  if (confirmed) {
    badge = (
      <Badge tone="success">
        <CheckCircleIcon size={16} weight="fill" aria-hidden /> Deposit paid
      </Badge>
    );
    heading = "Your drop-off is confirmed.";
    body =
      status.data?.emailMode === "live"
        ? "A confirmation email is on its way. If it has not arrived within the hour, reply to any of our emails or call us, the booking stands either way."
        : "Email is in demo mode on this deployment, so no confirmation email is sent. The booking stands.";
  } else if (stillChecking) {
    badge = (
      <Badge tone="steel">
        <HourglassIcon size={16} weight="bold" aria-hidden /> Checking with Stripe
      </Badge>
    );
    heading = "Confirming your deposit.";
    body = "This usually takes a few seconds. You can leave this page open, it updates on its own.";
  } else if (paymentMode === "demo") {
    badge = (
      <Badge tone="warning">
        <ClockIcon size={16} weight="bold" aria-hidden /> Deposit pending
      </Badge>
    );
    heading = "Your slot is held.";
    body =
      "Stripe is not connected on this deployment, so no deposit was taken. In the live studio you would pay the deposit here, or from the link we text you, and the booking would confirm automatically.";
  } else {
    badge = (
      <Badge tone="warning">
        <ClockIcon size={16} weight="bold" aria-hidden /> Deposit pending
      </Badge>
    );
    heading = "Your slot is held while payment confirms.";
    body = `We have not heard back from Stripe yet. If your card was charged, the booking confirms automatically. If you closed the payment page, call ${site.phoneDisplay} and we will send a new payment link.`;
  }

  const next = [
    `We text the day before to confirm your ${formatTime(booking.time)} drop-off.`,
    `Bring the car to ${site.address.line1} on ${formatDateLong(booking.date)}.`,
    `Pay the balance of ${formatUsd(service.priceCents - booking.depositCents)} when you collect.`,
  ];

  return (
    <Panel>
      <div aria-live="polite">
        <h1 className="text-h1 font-black">{heading}</h1>
        <p className="mt-3 max-w-[56ch] text-ink-soft">{body}</p>
      </div>

      {/* The finished work order: hairline-ruled rows, no card inside the card. */}
      <dl className="mt-8 divide-y divide-line border-y border-line text-[0.9375rem]">
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:items-baseline">
          <dt className="text-ink-soft">Reference</dt>
          <dd className="mono-num text-[1.75rem] font-medium leading-none tracking-wide text-ink">{booking.ref}</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-ink-soft">Package</dt>
          <dd className="font-semibold">{service.name}</dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-ink-soft">Drop-off</dt>
          <dd className="font-semibold">
            {formatDateLong(booking.date)}, {formatTime(booking.time)}
          </dd>
        </div>
        <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:items-center">
          <dt className="text-ink-soft">Deposit</dt>
          <dd className="flex flex-wrap items-center gap-3">
            <span className="mono-num font-medium">{formatUsd(booking.depositCents)}</span>
            {badge}
          </dd>
        </div>
      </dl>

      <h2 className="mt-10 font-sans text-lg font-semibold">What happens next</h2>
      <ol className="mt-3 grid gap-3">
        {next.map((n, i) => (
          <li key={n} className="flex gap-4 text-ink-soft">
            <span className="mono-num text-ink">{i + 1}</span>
            {n}
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/" variant="secondary">
          Back to the site
        </ButtonLink>
        {!confirmed && (
          <Button
            variant="quiet"
            onClick={() => {
              clearDraft();
              router.push("/#booking");
            }}
          >
            Start a new booking
          </Button>
        )}
      </div>
    </Panel>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-(--radius-panel) bg-surface p-6 ring-1 ring-line sm:p-10">{children}</div>;
}
