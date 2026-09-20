import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-(--radius-input) border bg-surface px-3.5 text-base text-ink placeholder:text-ink-faint transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:border-accent focus-visible:ring-3 focus-visible:ring-accent/20 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = "", ...props },
  ref,
) {
  return <input ref={ref} className={`${control} h-12 border-ink/20 ${className}`} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = "", ...props }, ref) {
    return <textarea ref={ref} className={`${control} min-h-24 border-ink/20 py-3 ${className}`} {...props} />;
  },
);
