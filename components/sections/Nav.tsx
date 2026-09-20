import Image from "next/image";
import Link from "next/link";
import { BookButton } from "@/components/booking/BookButton";
import { site } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";

export const navLinks = [
  { href: "/#services", label: "Packages" },
  { href: "/#results", label: "Results" },
  { href: "/#visit", label: "Visit" },
  { href: "/#reviews", label: "Reviews" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="container-page relative flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="shrink-0 rounded-sm" aria-label="Lacquer & Co. home">
          <Image
            src="/brand/lockup-horizontal@3x.png"
            alt="Lacquer & Co."
            width={560}
            height={133}
            className="h-9 w-auto"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-[0.9375rem] font-semibold text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={site.phoneHref}
            className="mono-num hidden text-[0.9375rem] text-ink-soft underline-offset-4 hover:text-ink hover:underline xl:inline"
          >
            {site.phoneDisplay}
          </a>
          <BookButton className="max-sm:h-10 max-sm:px-4 max-sm:text-sm" />
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
