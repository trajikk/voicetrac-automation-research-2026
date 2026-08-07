"use client";

import { useState, type FormEvent } from "react";
import { services } from "@/lib/services";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-gold focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire this up to a real endpoint (API route, Formspree, HubSpot,
    // etc.) before launch. This currently only confirms the form works.
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <h3 className="text-lg font-semibold">Thanks — message received.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We&apos;ll follow up within one business day with next steps for your
          free AI visibility audit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={`mt-2 ${inputClass}`}
            placeholder="Jordan Lee"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={`mt-2 ${inputClass}`}
            placeholder="jordan@company.com"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="text-sm font-medium">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className={`mt-2 ${inputClass}`}
            placeholder="Company name"
          />
        </div>
        <div>
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="url"
            className={`mt-2 ${inputClass}`}
            placeholder="https://yoursite.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="text-sm font-medium">
          What are you interested in?
        </label>
        <select id="service" name="service" defaultValue="" className={`mt-2 ${inputClass}`}>
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.shortName}
            </option>
          ))}
          <option value="not-sure">Not sure yet</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Tell us about your goals
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`mt-2 ${inputClass}`}
          placeholder="What's currently working, what's not, and what you're hoping to achieve..."
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-cyan sm:w-auto"
      >
        Request my free visibility audit
      </button>
    </form>
  );
}
