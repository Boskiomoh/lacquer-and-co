import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "success" | "warning" | "steel";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-alt text-ink-soft",
  accent: "bg-accent-soft text-accent-ink",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning-ink",
  steel: "bg-steel-soft text-steel",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[0.8125rem] font-semibold leading-none ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
