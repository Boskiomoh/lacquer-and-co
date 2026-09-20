"use client";

import { ArrowsHorizontalIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from "react";

type Img = { src: string; alt: string; width: number; height: number };

/**
 * Before/after comparison. Position lives in a CSS custom property written
 * straight to the DOM, so dragging never re-renders React. Pointer events
 * cover mouse, pen and touch; arrow keys, Home and End cover the keyboard.
 * Without JavaScript it renders at a 50/50 split.
 */
export function CompareSlider({ before, after, sizes }: { before: Img; after: Img; sizes: string }) {
  const root = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const set = useCallback((pct: number) => {
    const v = Math.min(100, Math.max(0, pct));
    root.current?.style.setProperty("--pos", `${v}%`);
    handle.current?.setAttribute("aria-valuenow", String(Math.round(v)));
    handle.current?.setAttribute("aria-valuetext", `${Math.round(v)}% after, ${100 - Math.round(v)}% before`);
  }, []);

  const fromPointer = (e: PointerEvent) => {
    const rect = root.current!.getBoundingClientRect();
    set(((e.clientX - rect.left) / rect.width) * 100);
  };

  const current = () => Number(handle.current?.getAttribute("aria-valuenow") ?? 50);

  function onKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, number> = {
      ArrowLeft: current() - step,
      ArrowDown: current() - step,
      ArrowRight: current() + step,
      ArrowUp: current() + step,
      Home: 0,
      End: 100,
      PageDown: current() - 10,
      PageUp: current() + 10,
    };
    if (e.key in map) {
      e.preventDefault();
      set(map[e.key]);
    }
  }

  return (
    <div
      ref={root}
      className="group relative aspect-[3/2] w-full touch-pan-y select-none overflow-hidden rounded-(--radius-panel) bg-surface-alt [--pos:50%]"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        fromPointer(e);
        handle.current?.focus({ preventScroll: true });
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* After sits underneath and fills the frame; before is clipped on top. */}
      <Image
        src={after.src}
        alt={after.alt}
        width={after.width}
        height={after.height}
        sizes={sizes}
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--pos)) 0 0)" }}>
        <Image
          src={before.src}
          alt={before.alt}
          width={before.width}
          height={before.height}
          sizes={sizes}
          draggable={false}
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1.5 text-sm font-semibold text-ink shadow-(--shadow-rest)">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-white shadow-(--shadow-rest)">
        After
      </span>

      <div className="pointer-events-none absolute inset-y-0 left-(--pos) w-0.5 -translate-x-1/2 bg-surface shadow-[0_0_0_1px_rgba(25,26,28,0.15)]" />
      <div
        ref={handle}
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        aria-valuetext="50% after, 50% before"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="absolute left-(--pos) top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-accent text-white shadow-(--shadow-raised) transition-transform duration-200 ease-(--ease-out-expo) focus-visible:outline-white group-active:scale-95"
      >
        <ArrowsHorizontalIcon size={24} weight="bold" aria-hidden />
      </div>
    </div>
  );
}
