import { ArrowUpRightIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClass } from "@/components/ui/Button";
import { directionsUrl, site } from "@/lib/site";
import { LocationMap } from "./LocationMap";

export function Location() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="section-y">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-6">
        <Reveal className="order-2 lg:order-1 lg:col-span-7">
          <LocationMap />
        </Reveal>

        <Reveal className="order-1 lg:order-2 lg:col-span-5 lg:pl-10">
          <h2 id="visit-title" className="text-h1 font-black">
            Find the workshop.
          </h2>
          <p className="mt-4 max-w-[40ch] text-body-l text-ink-soft">
            Pull in off Carroll Ave and leave the keys at the desk. We text when the car is ready to collect.
          </p>

          <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-(--radius-panel)">
            <Image
              src="/images/location-unit.webp"
              alt="The white clad frontage of an industrial unit with tall windows"
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <address className="not-italic">
              <p className="text-sm font-semibold text-ink">Address</p>
              <p className="mt-1 text-ink-soft">
                {site.address.line1}
                <br />
                {site.address.line2}
              </p>
            </address>
            <div>
              <p className="text-sm font-semibold text-ink">Opening hours</p>
              <dl className="mt-1 grid gap-1 text-ink-soft">
                {site.hours.map((h) => (
                  <div key={h.days}>
                    <dt>{h.days}</dt>
                    <dd className={/\d/.test(h.time) ? "mono-num text-[0.9375rem] text-ink" : "text-ink"}>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={directionsUrl} className={buttonClass("secondary")} target="_blank" rel="noreferrer">
              Get directions
              <ArrowUpRightIcon size={18} weight="bold" aria-hidden />
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
            <a href={site.phoneHref} className={buttonClass("secondary")}>
              <PhoneIcon size={18} weight="bold" aria-hidden />
              <span className="mono-num">{site.phoneDisplay}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
