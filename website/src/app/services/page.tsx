import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { ArrowRightIcon, CheckIcon, serviceIcons } from "@/components/icons";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI search (GEO) visibility, complete website rebuilds, traditional SEO, and content strategy — Origin Visibility's four connected services.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="grid-fade">
        <Container className="pt-20 pb-16 sm:pt-24">
          <p className="text-sm font-medium text-cyan">Services</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything it takes to be found — by people and by AI.
          </h1>
          <p className="mt-5 max-w-xl text-muted leading-relaxed">
            Four services, one strategy. We rebuild the foundation, then
            optimize it for traditional search and AI answer engines
            together, backed by content that earns the citation.
          </p>
        </Container>
      </section>

      <div className="divide-y divide-border border-t border-border">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.slug as keyof typeof serviceIcons];
          return (
            <section
              key={service.slug}
              id={service.slug}
              className="scroll-mt-24 bg-background"
            >
              <Container className="grid gap-10 py-20 lg:grid-cols-[auto_1fr] lg:gap-16">
                <div className="flex items-start gap-4 lg:flex-col lg:items-start">
                  <span className="font-mono text-sm text-muted">
                    0{index + 1}
                  </span>
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-surface text-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {service.name}
                  </h2>
                  <p className="mt-4 text-muted leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex gap-3 text-sm">
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-gold" />
                        <span className="text-foreground/85">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <ButtonLink href="/contact" variant="secondary" className="mt-8">
                    Talk to us about {service.shortName}
                    <ArrowRightIcon className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <section className="border-t border-border">
        <Container className="py-24 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Most clients start with a visibility audit. We&apos;ll tell you
            exactly where you stand and which service moves the needle first.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/contact">
              Get Your Free AI Visibility Audit
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
