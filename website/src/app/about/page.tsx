import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Origin Visibility rebuilds websites and search strategy for a world where AI answer engines sit alongside Google. Here's our approach.",
};

const values = [
  {
    title: "Foundations first",
    description:
      "Visibility built on a slow, cluttered, or poorly structured site doesn't last. We start with the website itself, not just the marketing layered on top.",
  },
  {
    title: "One team, one strategy",
    description:
      "GEO, SEO, content, and design are handled separately at most agencies. We treat them as one system, because that's how search engines and AI models actually evaluate a site.",
  },
  {
    title: "Visibility you can measure",
    description:
      "We track where you show up — rankings, AI citations, and referral traffic — and report on it plainly, not with vanity metrics.",
  },
  {
    title: "Built to adapt",
    description:
      "Search algorithms and AI models change constantly. We revisit strategy on a regular cadence instead of setting it once and walking away.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="grid-fade">
        <Container className="pt-20 pb-16 sm:pt-24">
          <p className="text-sm font-medium text-cyan">About Origin Visibility</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            We started this because search stopped being one thing.
          </h1>
          <p className="mt-5 max-w-xl text-muted leading-relaxed">
            For twenty years, being visible online mostly meant ranking well
            on Google. That&apos;s no longer the whole picture: buyers now ask
            ChatGPT, Perplexity, and AI Overviews for recommendations before
            they ever open a search results page. Origin Visibility exists to
            make sure your business is the answer in both places.
          </p>
        </Container>
      </section>

      <section className="border-t border-border bg-surface/40">
        <Container className="grid gap-16 py-20 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Our approach
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Most agencies specialize in one lane: a design shop rebuilds
              your site, an SEO firm chases keywords, a content team writes
              blog posts. None of it is coordinated, and none of it accounts
              for how AI models actually read and cite a website.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              We combine all four disciplines under one strategy: rebuild the
              site as the foundation, optimize it technically for search
              engines, structure content and entities for AI answer engines,
              and keep producing content that earns authority over time.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Who we work with
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              We work best with businesses that depend on being found —
              service businesses, B2B companies, and brands competing in
              crowded categories where the difference between page one and
              page three, or between being cited by AI and being ignored by
              it, shows up directly in the pipeline.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              If your current site is dated, slow, or wasn&apos;t built with
              search in mind at all, a rebuild is usually where we start.
              If the foundation is solid, we can move straight into SEO,
              GEO, and content strategy.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-cyan">What we value</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              The principles behind the work
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-surface p-8"
              >
                <h3 className="font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-24 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&apos;s talk about where you stand today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            We&apos;ll show you exactly how your business shows up across search
            and AI answer engines, and where the biggest opportunity is.
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
