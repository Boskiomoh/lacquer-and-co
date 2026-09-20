"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { useRef, type ReactNode } from "react";

/**
 * Native horizontal scroll with snap points: touch swipe, trackpad and the
 * keyboard (focus the rail, then arrow keys) all work without JS. The buttons
 * are an extra for mouse users.
 */
export function TestimonialRail({ children, label }: { children: ReactNode; label: string }) {
  const rail = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <div className="mb-6 hidden justify-end gap-2 md:flex">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previous reviews"
          className="grid size-11 place-items-center rounded-full border border-ink/15 bg-surface text-ink transition-colors hover:border-ink/40"
        >
          <ArrowLeftIcon size={18} weight="bold" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Next reviews"
          className="grid size-11 place-items-center rounded-full border border-ink/15 bg-surface text-ink transition-colors hover:border-ink/40"
        >
          <ArrowRightIcon size={18} weight="bold" aria-hidden />
        </button>
      </div>
      <ul
        ref={rail}
        tabIndex={0}
        aria-label={label}
        className="lq-rail -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-4 md:-mx-12 md:scroll-px-12 md:px-12 min-[1440px]:mx-0 min-[1440px]:scroll-px-0 min-[1440px]:px-0"
      >
        {children}
      </ul>
    </div>
  );
}
