import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a free AI search visibility audit from Origin Visibility and get a clear plan for search, GEO, and website performance.",
};

const faqs = [
  {
    question: "What happens after I submit this form?",
    answer:
      "We'll review your current site and search presence and follow up within one business day to schedule your free visibility audit.",
  },
  {
    question: "Do I need a full website rebuild to work with you?",
    answer:
      "No. Some clients start with SEO or GEO work on their existing site. We'll tell you honestly whether a rebuild is worth it during the audit.",
  },
  {
    question: "How long until we see results?",
    answer:
      "Technical fixes and AI visibility structuring can show movement within weeks. Competitive rankings and durable authority typically build over 3–6 months.",
  },
];

export default function ContactPage() {
  return (
    <section className="grid-fade">
      <Container className="grid gap-16 pt-20 pb-24 sm:pt-24 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-cyan">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s find out where you stand.
          </h1>
          <p className="mt-5 text-muted leading-relaxed">
            Tell us a bit about your business and we&apos;ll follow up with a free
            audit of your search and AI visibility — no obligation.
          </p>

          <div className="mt-10 space-y-4 text-sm">
            <div>
              <p className="text-muted">Email</p>
              <a
                href="mailto:hello@originvisibility.com"
                className="font-medium text-foreground transition-colors hover:text-gold"
              >
                hello@originvisibility.com
              </a>
            </div>
            <div>
              <p className="text-muted">Phone</p>
              <a
                href="tel:+18005550119"
                className="font-medium text-foreground transition-colors hover:text-gold"
              >
                (800) 555-0119
              </a>
            </div>
          </div>

          <div className="mt-12 space-y-6 border-t border-border pt-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-sm font-semibold">{faq.question}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
