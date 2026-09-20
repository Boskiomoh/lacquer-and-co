"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { detailsSchema, type BookingDetails } from "@/lib/schemas/booking";
import { useBookingDraft } from "./DraftContext";
import { StepLayout } from "./StepLayout";

type FormValues = Omit<BookingDetails, "notes"> & { notes?: string };

export function DetailsStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { draft, updateDraft } = useBookingDraft();
  const {
    register,
    handleSubmit,
    subscribe,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: draft.details,
    mode: "onTouched",
  });

  // Mirror every keystroke into the session draft (the draft hook debounces writes).
  useEffect(() => {
    return subscribe({
      formState: { values: true },
      callback: ({ values, type }) => {
        // Only user edits; the initial registration pass is not a change.
        if (type !== "change") return;
        updateDraft((prev) => ({
          ...prev,
          ref: null,
          details: {
            name: values.name ?? "",
            email: values.email ?? "",
            phone: values.phone ?? "",
            vehicle: values.vehicle ?? "",
            notes: values.notes ?? "",
          },
        }));
      },
    });
  }, [subscribe, updateDraft]);

  const describedBy = (name: keyof FormValues, hasHint = false) =>
    errors[name] ? `${name}-error` : hasHint ? `${name}-hint` : undefined;

  return (
    <StepLayout
      title="Your details"
      intro="We text when the car is ready. Nothing here is shared or used for marketing."
      onBack={onBack}
      action={
        <Button type="submit" form="details-form">
          Continue
        </Button>
      }
    >
      <form id="details-form" noValidate onSubmit={handleSubmit(() => onNext())} className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="name" label="Full name" error={errors.name?.message}>
            <Input
              id="name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={describedBy("name")}
              {...register("name")}
            />
          </Field>
        </div>
        <Field id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            {...register("email")}
          />
        </Field>
        <Field id="phone" label="Mobile" hint="For the ready-to-collect text." error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone", true)}
            {...register("phone")}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="vehicle" label="Vehicle make and model" hint="For example Mazda MX-5 or Toyota 4Runner." error={errors.vehicle?.message}>
            <Input
              id="vehicle"
              autoComplete="off"
              aria-invalid={!!errors.vehicle}
              aria-describedby={describedBy("vehicle", true)}
              {...register("vehicle")}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="notes" label="Anything we should know?" optional error={errors.notes?.message}>
            <Textarea
              id="notes"
              rows={3}
              aria-invalid={!!errors.notes}
              aria-describedby={describedBy("notes")}
              {...register("notes")}
            />
          </Field>
        </div>
      </form>
    </StepLayout>
  );
}
