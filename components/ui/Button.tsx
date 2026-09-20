import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "inverse" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[0.005em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-(--ease-out-expo) motion-safe:hover:-translate-y-px active:translate-y-0 motion-safe:active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-(--shadow-rest) hover:bg-accent-hover hover:shadow-(--shadow-raised)",
  secondary: "border border-ink/15 bg-surface text-ink hover:border-ink/40",
  // For use on the burnt orange band.
  inverse: "bg-surface text-accent-ink hover:bg-accent-soft focus-visible:outline-white",
  quiet: "text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-accent motion-safe:hover:translate-y-0",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  const sizing = variant === "quiet" ? "h-11 px-1 text-base" : sizes[size];
  return `${base} ${variants[variant]} ${sizing} ${extra}`.trim();
}

type Common = { variant?: Variant; size?: Size };

export function Button({
  variant,
  size,
  className = "",
  type = "button",
  ...props
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className = "",
  ...props
}: Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a className={buttonClass(variant, size, className)} {...props} />;
}
