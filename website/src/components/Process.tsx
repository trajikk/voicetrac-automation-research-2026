import { Container } from "./Container";
import { Reveal } from "./Reveal";

const steps = [
  {
    title: "Free AI Visibility Check",
    description:
      "We ask the AI platforms your customers are already using who they'd recommend for your trade, in your area. No charge, no obligation.",
  },
  {
    title: "You see exactly what we found",
    description:
      "Real findings, specific to your business. If a competitor's getting named and you're not, we show you precisely that — not a vague pitch.",
  },
  {
    title: "You decide",
    description:
      "If the gap's worth closing, we talk. If it's not, we shake hands and you keep the findings either way.",
  },
  {
    title: "We build",
    description:
      "Once you're in, we build the site and the foundation properly — not a template with your name swapped in.",
  },
  {
    title: "We keep it working",
    description:
      "The retainer isn't maintenance. It's the ongoing work that keeps you the name AI gives out, month after month.",
  },
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-20 border-y border-border-soft bg-surface/30">
      <Container className="py-24">
        <Reveal>
          <p className="font-mono-tech text-xs uppercase tracking-widest text-ember">
            The Process
          </p>
          <h2 className="font-display mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
            We don&apos;t guess. We check first.
          </h2>
        </Reveal>

        <ol className="relative mt-14 space-y-10 sm:ml-3">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[15px] hidden w-px bg-border sm:block"
          />
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 0.06} className="relative flex gap-5 sm:gap-6">
              <span className="relative z-10 grid h-8 w-8 flex-none place-items-center rounded-full border border-ember-line bg-background font-mono-tech text-xs text-ember">
                {index + 1}
              </span>
              <div className="pt-0.5">
                <h3 className="font-display text-xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
