import Image from "next/image";
import { BookButton } from "@/components/booking/BookButton";
import { buttonClass } from "@/components/ui/Button";
import { formatUsd, services } from "@/lib/services";

export function Hero() {
  return (
    <section
      id="top"
      className="grid lg:min-h-[min(calc(100dvh-72px),860px)] lg:grid-cols-[minmax(48px,1fr)_minmax(0,648px)_minmax(0,648px)_minmax(0,1fr)]"
    >
      <div className="container-page flex flex-col justify-center py-14 sm:py-20 lg:col-start-2 lg:max-w-none lg:px-0 lg:py-16 lg:pr-16">
        <h1 className="hero-in text-display font-black text-ink" style={{ ["--i" as string]: 0 }}>
          Your car, returned better than delivered.
        </h1>
        <p
          className="hero-in mt-6 max-w-[34ch] text-body-l text-ink-soft sm:max-w-[42ch]"
          style={{ ["--i" as string]: 1 }}
        >
          Hand detailing, paint correction and ceramic coating from a small Chicago workshop. Book your drop-off
          online in minutes.
        </p>
        <div className="hero-in mt-9 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ ["--i" as string]: 2 }}>
          <BookButton size="lg" />
          <a href="#services" className={buttonClass("quiet")}>
            See packages
          </a>
        </div>
      </div>

      <div className="relative lg:col-span-2 lg:col-start-3">
        <div className="hero-plate relative aspect-[4/5] max-h-[78svh] w-full overflow-hidden sm:aspect-[16/11] lg:absolute lg:inset-0 lg:aspect-auto lg:max-h-none lg:rounded-l-(--radius-panel)">
          <Image
            src="/images/hero-red-panel.webp"
            alt="Water beading into tight droplets on the curved red paint of a freshly coated panel"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* The price list, set like a work order, overlapping the photograph. */}
        <div
          className="hero-in container-page relative -mt-10 lg:absolute lg:bottom-10 lg:-left-16 lg:mt-0 lg:w-[380px] lg:px-0"
          style={{ ["--i" as string]: 3 }}
        >
          <div className="rounded-(--radius-panel) bg-surface p-5 shadow-(--shadow-raised) ring-1 ring-line">
            <p className="text-sm font-semibold text-ink">Fixed prices, cars and SUVs</p>
            <ul className="mt-3 divide-y divide-line">
              {services.map((s) => (
                <li key={s.id} className="flex items-baseline justify-between gap-4 py-2.5 text-[0.9375rem]">
                  <span className="text-ink-soft">{s.name}</span>
                  <span className="mono-num font-medium text-ink">{formatUsd(s.priceCents)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
