import Link from "next/link";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { ArrowRightIcon, CheckIcon, serviceIcons } from "@/components/icons";
import { services } from "@/lib/services";

const stats = [
  {
    value: "4-in-1",
    label: "GEO, SEO, content, and website rebuilds — one connected strategy, not four vendors.",
  },
  {
    value: "24/7",
    label: "AI answer engines never stop citing sources. Your visibility work shouldn't either.",
  },
  {
    value: "1 site",
    label: "Rebuilt once, structured to perform for visitors, crawlers, and language models alike.",
  },
];

const process = [
  {
    step: "01",
    title: "Visibility Audit",
    description:
      "We map how your business currently shows up — or doesn't — across Google, Bing, and AI answer engines like ChatGPT and Perplexity.",
  },
  {
    step: "02",
    title: "Rebuild the Foundation",
    description:
      "We rebuild your website with clean architecture, fast performance, and structured data that both search engines and AI can parse.",
  },
  {
    step: "03",
    title: "Structure for AI & Search",
    description:
      "Content, entities, and technical SEO are optimized together, so you rank in search and get cited in AI-generated answers.",
  },
  {
    step: "04",
    title: "Monitor & Iterate",
    description:
      "We track rankings and AI citations monthly and adjust strategy as models, algorithms, and your market evolve.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden grid-fade">
        <Container className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            AI Search &amp; GEO Visibility Specialists
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Be the answer <span className="text-gradient">AI gives.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Origin Visibility rebuilds your website and search presence from
            the ground up — so you&apos;re found on Google, and cited by ChatGPT,
            Perplexity, and every answer engine in between.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/contact">
              Get Your Free AI Visibility Audit
              <ArrowRightIcon className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary">
              See Our Services
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface/40">
        <Container className="grid gap-10 py-14 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.value}>
              <p className="text-3xl font-semibold text-gold">{stat.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{stat.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section id="services">
        <Container className="py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-cyan">What we do</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              One team. Every place people search now.
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Search didn&apos;t fragment into search engines and AI engines — it
              expanded. We built Origin Visibility to cover all of it, under
              one strategy.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = serviceIcons[service.slug as keyof typeof serviceIcons];
              return (
                <Link
                  key={service.slug}
                  href={`/services#${service.slug}`}
                  className="group rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-gold"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 group-hover:text-gold">
                    Learn more
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface/40">
        <Container className="py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-medium text-cyan">Why it matters</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                SEO gets you ranked. GEO gets you quoted.
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                People increasingly ask AI tools for recommendations instead
                of scrolling search results. If your site isn&apos;t structured
                for those engines to read, understand, and trust, you&apos;re
                invisible in a growing share of buying decisions — no matter
                how well you rank on page one.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Structured, crawlable content models understand and cite",
                  "Technical SEO that keeps your foundation strong for Google and Bing",
                  "A website built to convert once you're found, not just to be found",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-gold" />
                    <span className="text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-8">
              <p className="font-mono text-xs text-muted">Prompt</p>
              <p className="mt-2 text-sm text-foreground/90">
                &ldquo;Who&apos;s the best [your category] for a business like mine?&rdquo;
              </p>
              <div className="mt-6 rounded-xl border border-cyan-soft bg-cyan-soft p-5">
                <p className="font-mono text-xs text-cyan">AI Answer</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  &ldquo;Based on their site and reviews, <span className="text-gold">[Your Business]</span>{" "}
                  is a strong fit — they specialize in&hellip;&rdquo;
                </p>
              </div>
              <p className="mt-6 text-xs text-muted">
                This is the moment we build your site and content to earn.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-cyan">How we work</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              A four-step path to visibility
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <div key={item.step}>
                <p className="font-mono text-sm text-gold">{item.step}</p>
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-24 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to be the answer, not just a result?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Get a free visibility audit across search and AI answer engines,
            and a clear plan to close the gap.
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
