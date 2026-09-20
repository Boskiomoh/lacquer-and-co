"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import { useRef, type KeyboardEvent } from "react";
import { addDays, addMonths, daysInMonth, formatDateLong, formatMonth, weekday } from "@/lib/time";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Month grid with roving focus: arrow keys move by day and week, Home/End to
 * the week edges, PageUp/PageDown by month. Unavailable days stay focusable
 * so keyboard users can read them, but cannot be chosen.
 */
export function Calendar({
  month,
  onMonthChange,
  minMonth,
  maxMonth,
  openDates,
  selected,
  onSelect,
  loading,
}: {
  month: string;
  onMonthChange: (month: string) => void;
  minMonth: string;
  maxMonth: string;
  openDates: Set<string>;
  selected: string | null;
  onSelect: (date: string) => void;
  loading: boolean;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const days = daysInMonth(month);
  const leading = weekday(days[0]);
  const focusDate =
    selected && selected.startsWith(month) ? selected : (days.find((d) => openDates.has(d)) ?? days[0]);

  function focusDay(date: string) {
    if (!date.startsWith(month)) {
      const target = date.slice(0, 7);
      if (target < minMonth || target > maxMonth) return;
      onMonthChange(target);
      requestAnimationFrame(() => gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus());
      return;
    }
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${date}"]`)?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, date: string) {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let next: string | null = null;
    if (e.key in moves) next = addDays(date, moves[e.key]);
    else if (e.key === "Home") next = addDays(date, -weekday(date));
    else if (e.key === "End") next = addDays(date, 6 - weekday(date));
    else if (e.key === "PageUp") next = `${addMonths(month, -1)}-01`;
    else if (e.key === "PageDown") next = `${addMonths(month, 1)}-01`;
    if (next) {
      e.preventDefault();
      focusDay(next);
    }
  }

  const canPrev = month > minMonth;
  const canNext = month < maxMonth;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-lg font-semibold" aria-live="polite">
          {formatMonth(month)}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMonthChange(addMonths(month, -1))}
            disabled={!canPrev}
            aria-label="Previous month"
            className="grid size-10 place-items-center rounded-full border border-ink/15 bg-surface text-ink transition-colors hover:border-ink/40 disabled:opacity-35"
          >
            <CaretLeftIcon size={18} weight="bold" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(addMonths(month, 1))}
            disabled={!canNext}
            aria-label="Next month"
            className="grid size-10 place-items-center rounded-full border border-ink/15 bg-surface text-ink transition-colors hover:border-ink/40 disabled:opacity-35"
          >
            <CaretRightIcon size={18} weight="bold" aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center" aria-hidden>
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-2 text-caption font-semibold uppercase text-ink-faint">
            {d}
          </div>
        ))}
      </div>

      <div ref={gridRef} className="grid grid-cols-7 gap-1" role="group" aria-label={`Days in ${formatMonth(month)}`}>
        {Array.from({ length: leading }, (_, i) => (
          <div key={`pad-${i}`} aria-hidden />
        ))}
        {days.map((date) => {
          const isOpen = openDates.has(date);
          const isSelected = date === selected;
          const day = Number(date.slice(8));
          if (loading) {
            return <div key={date} className="h-11 animate-pulse rounded-(--radius-input) bg-surface-alt" />;
          }
          return (
            <button
              key={date}
              type="button"
              data-date={date}
              tabIndex={date === focusDate ? 0 : -1}
              aria-disabled={!isOpen}
              aria-pressed={isSelected}
              aria-label={`${formatDateLong(date)}${isOpen ? "" : ", no drop-offs"}`}
              onClick={() => isOpen && onSelect(date)}
              onKeyDown={(e) => onKeyDown(e, date)}
              className={[
                "mono-num relative h-11 rounded-(--radius-input) text-[0.9375rem] transition-colors",
                isSelected
                  ? "bg-accent font-semibold text-white"
                  : isOpen
                    ? "bg-surface font-medium text-ink ring-1 ring-ink/12 hover:bg-accent-soft hover:text-accent-ink"
                    : "cursor-not-allowed text-ink-faint/70 line-through decoration-ink-faint/40",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
