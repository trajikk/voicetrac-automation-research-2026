import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Shift() {
  return (
    <section className="border-y border-border-soft bg-surface/30">
      <Container className="py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="font-mono-tech text-xs uppercase tracking-widest text-ember">
              Why This Matters Now
            </p>
            <h2 className="font-display mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Search didn&apos;t die. It moved.
            </h2>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.05}>
              <p className="text-lg leading-relaxed text-foreground/85">
                For twenty years, showing up meant ranking on Google. That
                still matters — but it&apos;s no longer the whole game. AI
                Overviews and assistants like ChatGPT and Perplexity now
                answer questions directly, and independent research has
                found they can cut click-through to the top-ranking page by
                more than half. People aren&apos;t always clicking anymore.
                They&apos;re asking, and getting a name.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-foreground/85">
                If your business isn&apos;t the name that comes back, it
                doesn&apos;t matter how good your work is. You&apos;re
                invisible at the exact moment someone&apos;s deciding who to
                call.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="border-l-2 border-ember-line pl-5 text-sm leading-relaxed text-muted">
                This isn&apos;t a replacement for SEO. It&apos;s the layer on
                top of it — and almost nobody in your market is optimizing
                for it yet.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
