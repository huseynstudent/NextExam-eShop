"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "@/app/[locale]/actions";

export default function ContactForm({
  labels,
}: {
  labels: {
    name: string;
    email: string;
    message: string;
    send: string;
    sentConfirmation: string;
    error: string;
  };
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (sent) {
    return (
      <p className="rounded-lg border border-line bg-cream px-4 py-3 text-sm text-ink">
        {labels.sentConfirmation}
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setError(false);
        startTransition(async () => {
          try {
            await submitContactMessage(formData);
            setSent(true);
          } catch {
            setError(true);
          }
        });
      }}
      className="flex flex-col gap-3"
    >
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {labels.error}
        </p>
      )}
      <div>
        <label className="text-xs text-subtle">{labels.name}</label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs text-subtle">{labels.email}</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs text-subtle">{labels.message}</label>
        <textarea
          name="message"
          required
          rows={4}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 w-full rounded-full bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isPending ? "..." : labels.send}
      </button>
    </form>
  );
}
