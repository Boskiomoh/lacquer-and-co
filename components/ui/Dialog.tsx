"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Native <dialog> opened with showModal(): the rest of the page becomes inert
 * (focus is trapped), Escape closes it, and focus returns to whatever opened it.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.classList.add("lq-scroll-lock");
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.classList.remove("lq-scroll-lock");
      returnFocus.current?.focus?.();
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className={`lq-dialog m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/45 sm:m-auto sm:h-auto sm:max-h-[min(860px,calc(100dvh-48px))] sm:max-w-[680px] ${className}`}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {children}
    </dialog>
  );
}
