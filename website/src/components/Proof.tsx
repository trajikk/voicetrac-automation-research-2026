import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { AIAnswerDemo } from "./AIAnswerDemo";

export function Proof() {
  return (
    <section className="scroll-mt-20">
      <Container className="py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <p className="font-mono-tech text-xs uppercase tracking-widest text-ember">
              Why Trust This
            </p>
            <h2 className="font-display mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              We&apos;re not going to show you a fake case study.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Most of this industry runs on vague success stories and stats
              nobody can trace back to a source. We&apos;d rather show you
              the real thing: an actual, interactive AI visibility check,
              running in front of you right now — not a slide, not a
              testimonial with no name attached.
            </p>
            <p className="mt-5 border-l-2 border-ember-line pl-5 text-sm leading-relaxed text-muted">
              If we ever do have client results to show you, they&apos;ll be
              real, named, and checkable. Until then, we&apos;d rather show
              you the process than fake the proof.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <AIAnswerDemo variant="full" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
