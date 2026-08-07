"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./Button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-2 focus:border-ember-line focus:outline-none";

const trades = [
  "General Contractor",
  "Concrete Contractor",
  "Fencing Contractor",
  "Roofing Contractor",
  "Other trade",
];

export function CtaForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire this up to a real endpoint (API route, CRM, inbox, etc.)
    // before launch. This currently only confirms the form works.
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-ember-line/50 bg-ember-soft p-8 text-center">
        <h3 className="font-display text-xl font-medium">Request received.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We&apos;ll run your free AI visibility check and follow up within
          one business day with exactly what we found.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cta-name" className="text-sm font-medium">
            Your name
          </label>
          <input
            id="cta-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`mt-2 ${inputClass}`}
            placeholder="Jordan Lee"
          />
        </div>
        <div>
          <label htmlFor="cta-business" className="text-sm font-medium">
            Business name
          </label>
          <input
            id="cta-business"
            name="business"
            type="text"
            required
            className={`mt-2 ${inputClass}`}
            placeholder="Ridgeline Fencing"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cta-trade" className="text-sm font-medium">
            Trade
          </label>
          <select id="cta-trade" name="trade" defaultValue="" className={`mt-2 ${inputClass}`}>
            <option value="" disabled>
              Select your trade
            </option>
            {trades.map((trade) => (
              <option key={trade} value={trade}>
                {trade}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cta-city" className="text-sm font-medium">
            City / service area
          </label>
          <input
            id="cta-city"
            name="city"
            type="text"
            required
            className={`mt-2 ${inputClass}`}
            placeholder="Denver, CO"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cta-contact" className="text-sm font-medium">
          Phone or email
        </label>
        <input
          id="cta-contact"
          name="contact"
          type="text"
          required
          className={`mt-2 ${inputClass}`}
          placeholder="jordan@ridgelinefencing.com"
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        Get Your Free AI Visibility Check
      </Button>
    </form>
  );
}
