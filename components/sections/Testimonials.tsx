import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { TestimonialRail } from "./TestimonialRail";

// Fictional owners for a fictional studio (disclosed in the footer).
const reviews = [
  {
    quote: "They found swirl marks I had stopped seeing. The paint looks deeper than the day I bought it.",
    name: "Marisol Vega",
    vehicle: "2019 Mazda MX-5",
    avatar: "/images/avatars/avatar-1.webp",
  },
  {
    quote: "Booked on my phone at lunch, dropped the keys at eight, collected at five. The cabin smells of nothing, which is the point.",
    name: "Dele Adebayo",
    vehicle: "2021 Toyota 4Runner",
    avatar: "/images/avatars/avatar-2.webp",
  },
  {
    quote: "Clear price, clear timings, and a text the moment it was ready. No upsell at the desk.",
    name: "Arjun Mehta",
    vehicle: "2016 BMW 340i",
    avatar: "/images/avatars/avatar-3.webp",
  },
  {
    quote: "My dog lives on the back seat. You would never know it now.",
    name: "Camila Reyes",
    vehicle: "2020 Subaru Outback",
    avatar: "/images/avatars/avatar-4.webp",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-y overflow-hidden">
      <div className="container-page">
        <Reveal className="max-w-[40rem]">
          <h2 id="reviews-title" className="text-h1 font-black">
            Owners, in their own words.
          </h2>
        </Reveal>

        <div className="mt-10 md:-mt-4">
          <TestimonialRail label="Reviews from owners">
            {reviews.map((r) => (
              <li
                key={r.name}
                className="flex w-[82%] shrink-0 snap-start flex-col justify-between rounded-(--radius-panel) bg-surface p-6 ring-1 ring-line sm:w-[46%] sm:p-7 lg:w-[calc((100%-48px)/3)]"
              >
                <blockquote className="text-lg leading-[1.55] text-ink">
                  <p>&ldquo;{r.quote}&rdquo;</p>
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <Image
                    src={r.avatar}
                    alt=""
                    width={64}
                    height={64}
                    className="size-14 rounded-full object-cover ring-2 ring-surface outline outline-1 outline-line"
                  />
                  <div>
                    <p className="font-semibold text-ink">{r.name}</p>
                    <p className="text-sm text-ink-soft">{r.vehicle}</p>
                  </div>
                </div>
              </li>
            ))}
          </TestimonialRail>
        </div>
      </div>
    </section>
  );
}
