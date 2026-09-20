import { BookButton } from "@/components/booking/BookButton";
import { Reveal } from "@/components/motion/Reveal";
import { formatUsd, services } from "@/lib/services";

const steps = ["Choose a package", "Pick a day", "Pick a drop-off time", "Add your details", "Hold the slot with a deposit"];

export function Booking() {
  return (
    <section id="booking" aria-labelledby="booking-section-title" className="section-y bg-accent text-white">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-5 lg:pr-10">
          <h2 id="booking-section-title" className="text-h1 font-black text-white">
            Pick a package, a day and a drop-off time.
          </h2>
          <p className="mt-5 max-w-[44ch] text-body-l text-white">
            Your answers save as you go, so you can check your diary in another tab and come back to the same step.
          </p>
          <ol className="mt-10 grid gap-4">
            {steps.map((s, i) => (
              <li key={s} className="flex items-baseline gap-4 border-t border-white/35 pt-4 text-lg font-semibold">
                <span className="mono-num text-base font-medium">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="lg:col-span-7">
          <div className="rounded-(--radius-panel) bg-surface p-6 text-ink shadow-[0_24px_48px_rgba(124,42,8,0.35)] sm:p-8">
            <h3 className="font-sans text-lg font-semibold">Start with a package</h3>
            <ul className="mt-4 divide-y divide-line">
              {services.map((s) => (
                <li key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[1fr_auto_auto]">
                  <div>
                    <p className="text-lg font-semibold">{s.name}</p>
                    <p className="mono-num text-sm text-ink-soft">
                      {s.durationLabel} / {formatUsd(s.depositCents)} deposit
                    </p>
                  </div>
                  <p className="mono-num text-xl font-medium">{formatUsd(s.priceCents)}</p>
                  <BookButton serviceId={s.id} className="col-span-2 sm:col-span-1">
                    Choose
                  </BookButton>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-4 text-sm text-ink-soft">
              Deposits are taken by Stripe in test mode. No real card is charged on this site.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
