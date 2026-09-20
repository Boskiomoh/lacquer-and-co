"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { z } from "zod";

function read<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = schema.safeParse(JSON.parse(raw));
    // Fail closed: a draft from an older schema version resets to the fallback.
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

/**
 * A Zod-validated value mirrored to sessionStorage. Reads once on mount,
 * writes debounced. `hydrated` is false until the stored draft has been read,
 * so callers can avoid flashing the empty state.
 */
export function useSessionDraft<T>(key: string, schema: z.ZodType<T>, fallback: T, debounceMs = 300) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef(value);

  useEffect(() => {
    const stored = read(key, schema, fallback);
    latest.current = stored;
    // Reading browser storage has to happen after mount to keep SSR markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(stored);
    setHydrated(true);
    // Read once per key; schema and fallback are stable module constants.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    try {
      window.sessionStorage.setItem(key, JSON.stringify(latest.current));
    } catch {
      // Storage full or blocked: the draft simply is not persisted.
    }
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        latest.current = resolved;
        return resolved;
      });
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, debounceMs);
    },
    [debounceMs, flush],
  );

  const clear = useCallback(() => {
    clearTimeout(timer.current);
    latest.current = fallback;
    setValue(fallback);
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [fallback, key]);

  // Never lose the last keystrokes to the debounce on refresh or navigation.
  useEffect(() => {
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      clearTimeout(timer.current);
    };
  }, [flush]);

  return { value, update, clear, flush, hydrated } as const;
}
