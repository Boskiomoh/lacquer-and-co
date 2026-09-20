import { CheckIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { BookButton } from "@/components/booking/BookButton";
import { Reveal } from "@/components/motion/Reveal";
import { formatUsd, getService, type Service } from "@/lib/services";

function Includes({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] text-ink-soft">
          <CheckIcon size={18} weight="bold" aria-hidden className="mt-0.5 shrink-0 text-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function PriceLine({ service, large = false }: { service: Service; large?: boolean }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`mono-num font-medium text-ink ${large ? "text-[2rem] leading-none" : "text-2xl leading-none"}`}>
        {formatUsd(service.priceCents)}
      </span>
      <span className="mono-num text-sm text-ink-soft">
        {service.durationLabel} / {formatUsd(service.depositCents)} deposit
      </span>
    </p>
  );
}

export function Services() {
  const featured = getService("correction")!;
  const secondary = [getService("signature")!, getService("interior")!];

  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-page">
        <Reveal className="max-w-[40rem]">
          <h2 id="services-title" className="text-h1 font-black">
            Three packages, priced before you arrive.
          </h2>
          <p className="mt-4 text-body-l text-ink-soft">
            One fixed price for cars and SUVs. No upsell at the counter, no surprise line on the invoice.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12">
          {/* Featured: the two-day package gets the room it needs. */}
          <Reveal
            as="article"
            className="grid overflow-hidden rounded-(--radius-panel) bg-surface ring-1 ring-line md:grid-cols-2 lg:col-span-7"
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-full">
              <Image
                src={featured.image.src}
                alt={featured.image.alt}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <h3 className="text-h3 font-bold">{featured.name}</h3>
              <p className="mt-3 text-ink-soft">{featured.summary}</p>
              <div className="mt-6">
                <Includes items={featured.includes} />
              </div>
              <div className="mt-auto pt-8">
                <PriceLine service={featured} large />
                <BookButton serviceId={featured.id} className="mt-6 w-full sm:w-auto">
                  Choose this package
                </BookButton>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:col-span-5">
            {secondary.map((s) => (
              <Reveal
                as="article"
                key={s.id}
                className="grid overflow-hidden rounded-(--radius-panel) bg-surface ring-1 ring-line sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
              >
                <div className="relative aspect-[16/9] sm:aspect-auto sm:min-h-full">
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    sizes="(min-width: 1024px) 200px, (min-width: 640px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col p-6">
                  <h3 className="text-xl font-bold">{s.name}</h3>
                  <p className="mt-2 text-[0.9375rem] text-ink-soft">{s.summary}</p>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                    <PriceLine service={s} />
                    <BookButton serviceId={s.id} variant="secondary">
                      Choose this package
                    </BookButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
