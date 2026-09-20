import { Reveal } from "@/components/motion/Reveal";
import { NewsletterForm } from "./NewsletterForm";

export function Newsletter() {
  return (
    <section aria-labelledby="newsletter-title" className="bg-surface-alt py-16 md:py-20">
      <Reveal className="container-page grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="lg:col-span-6">
          <h2 id="newsletter-title" className="text-h2 font-black">
            Care notes, four times a year.
          </h2>
          <p className="mt-3 max-w-[46ch] text-ink-soft">
            What the season does to paint, glass and leather, and how to keep a finish right between visits. No offers.
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <NewsletterForm />
        </div>
      </Reveal>
    </section>
  );
}
