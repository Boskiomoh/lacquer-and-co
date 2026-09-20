"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useRef } from "react";
import { BookButton } from "@/components/booking/BookButton";
import { site } from "@/lib/site";

/**
 * Built on <details>, so the menu opens and its links work before hydration or
 * with JavaScript off. JS adds closing on link click, Escape and outside click.
 */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = () => el.removeAttribute("open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        close();
        el.querySelector("summary")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (el.open && !el.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <details ref={ref} className="group lg:hidden">
      <summary
        className="grid size-11 cursor-pointer list-none place-items-center rounded-full text-ink transition-colors hover:bg-surface-alt [&::-webkit-details-marker]:hidden"
        aria-label="Menu"
      >
        <ListIcon size={24} weight="bold" aria-hidden className="group-open:hidden" />
        <XIcon size={24} weight="bold" aria-hidden className="hidden group-open:block" />
      </summary>
      <div className="absolute inset-x-0 top-full border-b border-line bg-bg px-5 pb-6 pt-2 shadow-(--shadow-raised)">
        <nav aria-label="Mobile">
          <ul className="divide-y divide-line">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => ref.current?.removeAttribute("open")}
                  className="flex h-14 items-center text-lg font-semibold text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={site.phoneHref} className="mono-num flex h-14 items-center text-lg text-ink">
                {site.phoneDisplay}
              </a>
            </li>
          </ul>
        </nav>
        <BookButton size="lg" className="mt-4 w-full" />
      </div>
    </details>
  );
}
