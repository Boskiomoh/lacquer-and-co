import { CompareSlider } from "@/components/motion/CompareSlider";
import { Reveal } from "@/components/motion/Reveal";
import { formatUsd, getService } from "@/lib/services";

export function BeforeAfter() {
  const interior = getService("interior")!;
  return (
    <section id="results" aria-labelledby="results-title" className="section-y bg-steel-soft">
      <div className="container-page">
        <Reveal className="max-w-[44rem]">
          <h2 id="results-title" className="text-h1 font-black">
            Same seats, same car, one Interior Reset.
          </h2>
          <p className="mt-4 max-w-[52ch] text-body-l text-ink-soft">
            Two photographs of the same front seats, before and after. Drag the handle across, or focus it and use the
            arrow keys.
          </p>
          <p className="mono-num mt-4 text-sm text-steel">
            {interior.name} / {interior.durationLabel} / {formatUsd(interior.priceCents)}
          </p>
        </Reveal>

        <Reveal className="mt-10 lg:mt-12">
          <CompareSlider
            before={{
              src: "/images/seats-before.webp",
              alt: "Before: grey cloth front seats stained with dirt and mould",
              width: 1600,
              height: 1067,
            }}
            after={{
              src: "/images/seats-after.webp",
              alt: "After: the same front seats clean, the grey cloth even in colour",
              width: 1600,
              height: 1067,
            }}
            sizes="(min-width: 1296px) 1296px, 100vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
