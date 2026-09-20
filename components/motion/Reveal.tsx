import type { ElementType, ReactNode } from "react";

/**
 * Scroll reveal as a CSS scroll-driven animation (see .reveal in globals.css).
 * No JavaScript and no observer: content is fully visible without JS, in
 * browsers without animation-timeline, and under prefers-reduced-motion.
 */
export function Reveal({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`reveal ${className}`}>{children}</Tag>;
}
