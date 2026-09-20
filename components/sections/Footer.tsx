import Image from "next/image";
import { site } from "@/lib/site";
import { navLinks } from "./Nav";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg pb-10 pt-14 text-[0.9375rem]">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/brand/lockup-horizontal@3x.png" alt="Lacquer & Co." width={560} height={133} className="h-9 w-auto" />
            <p className="mt-3 max-w-[30ch] text-ink-soft">Detailing, paint correction and ceramic coating.</p>
          </div>

          <div className="lg:col-span-3">
            <p className="font-semibold">Visit</p>
            <p className="mt-2 text-ink-soft">
              {site.address.line1}
              <br />
              {site.address.line2}
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="font-semibold">Contact</p>
            <ul className="mt-2 grid gap-1 text-ink-soft">
              <li>
                <a href={site.phoneHref} className="mono-num hover:text-ink hover:underline">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-ink hover:underline">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="font-semibold">Site</p>
            <ul className="mt-2 grid gap-1 text-ink-soft">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-ink hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/before" className="hover:text-ink hover:underline">
                  The original site, before the rescue
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 grid gap-3 border-t border-line pt-6 text-sm text-ink-faint md:grid-cols-[1fr_auto] md:gap-8">
          <p className="max-w-[80ch]">
            Lacquer &amp; Co. is a fictional studio built as a portfolio project; the people quoted are fictional too.
            Payments run in <strong className="font-semibold text-ink-soft">Stripe test mode</strong> and no real card is
            ever charged. Photography from Unsplash, credited in ATTRIBUTION.md.
          </p>
          <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
