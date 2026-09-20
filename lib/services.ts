import type { ServiceId } from "@/lib/schemas/booking";

export type Service = {
  id: ServiceId;
  name: string;
  summary: string;
  includes: string[];
  priceCents: number;
  depositCents: number;
  durationLabel: string;
  /** Drop-off times offered for this package, in studio local time. */
  dropOffTimes: string[];
  /** Multi-day packages need the following day open as well. */
  days: number;
  image: { src: string; alt: string; width: number; height: number };
};

export const services: Service[] = [
  {
    id: "correction",
    name: "Paint Correction & Ceramic",
    summary:
      "A two-stage machine polish to take out swirls and light scratches, sealed under a ceramic coating.",
    includes: [
      "Decontamination wash and clay",
      "Two-stage machine polish",
      "Ceramic coating on paint and wheels",
      "Inspection under studio lights",
    ],
    priceCents: 128000,
    depositCents: 15000,
    durationLabel: "2 days",
    dropOffTimes: ["08:00"],
    days: 2,
    image: {
      src: "/images/service-correction.webp",
      alt: "A detailer running a machine polisher across the glossy black panel of a car",
      width: 1200,
      height: 1500,
    },
  },
  {
    id: "signature",
    name: "Signature Detail",
    summary:
      "The full wash, decontamination and a one-step polish, with the interior cleaned to the seams.",
    includes: [
      "Snow foam and two-bucket wash",
      "Iron and tar decontamination",
      "One-step polish and sealant",
      "Interior vacuum and wipe-down",
    ],
    priceCents: 42000,
    depositCents: 7500,
    durationLabel: "6 hours",
    dropOffTimes: ["08:00", "09:30", "11:00"],
    days: 1,
    image: {
      src: "/images/service-foam.webp",
      alt: "A sedan covered in thick white snow foam on a cobbled yard",
      width: 1200,
      height: 900,
    },
  },
  {
    id: "interior",
    name: "Interior Reset",
    summary:
      "Seats and carpets extracted, plastics steamed, leather cleaned and conditioned.",
    includes: [
      "Hot water extraction",
      "Steam clean of plastics and vents",
      "Leather clean and condition",
      "Odour treatment",
    ],
    priceCents: 26000,
    depositCents: 5000,
    durationLabel: "4 hours",
    dropOffTimes: ["08:00", "10:00", "12:00", "14:00"],
    days: 1,
    image: {
      src: "/images/service-interior.webp",
      alt: "Clean white leather front seats of a modern car",
      width: 1200,
      height: 900,
    },
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
