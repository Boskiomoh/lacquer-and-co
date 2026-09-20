"use client";

import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { fetchJson } from "@/lib/query/fetch-json";

// The shared Zod schemas are imported on submit, not on page load, so the
// schema library stays out of the home page's initial JavaScript. The route
// handler re-validates with the same schema.
const loadSchemas = () => import("@/lib/schemas/newsletter");

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const subscribe = useMutation({
    mutationFn: async (value: string) => {
      const { newsletterResponseSchema } = await loadSchemas();
      return fetchJson("/api/newsletter", newsletterResponseSchema, {
        method: "POST",
        body: JSON.stringify({ email: value }),
      });
    },
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const { newsletterSchema } = await loadSchemas();
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }
    setFieldError(null);
    subscribe.mutate(parsed.data.email);
  }

  if (subscribe.isSuccess) {
    return (
      <p role="status" className="flex items-start gap-2 text-[0.9375rem] text-ink">
        <CheckCircleIcon size={22} weight="fill" aria-hidden className="shrink-0 text-success" />
        {subscribe.data.status === "subscribed"
          ? "You are on the list. The next care notes arrive at the turn of the season."
          : "Thanks, your signup is queued. Email is in demo mode on this deployment, so nothing will be sent yet."}
      </p>
    );
  }

  const error = fieldError ?? (subscribe.isError ? subscribe.error.message : null);

  return (
    <form noValidate onSubmit={onSubmit} className="w-full">
      <label htmlFor="newsletter-email" className="text-[0.9375rem] font-semibold text-ink">
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="sm:flex-1"
        />
        <Button type="submit" size="lg" disabled={subscribe.isPending} aria-busy={subscribe.isPending}>
          {subscribe.isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-danger">
          <WarningCircleIcon size={18} weight="bold" aria-hidden className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </form>
  );
}
