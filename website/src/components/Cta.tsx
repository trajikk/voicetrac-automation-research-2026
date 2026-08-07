import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CtaForm } from "./CtaForm";

export function Cta() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-border-soft field-grid">
      <Container className="py-24 text-center">
        <Reveal>
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
            Find out if you&apos;re the name AI gives out.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Free, specific, no pressure. Takes us minutes — worth knowing
            either way.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <CtaForm />
        </Reveal>
      </Container>
    </section>
  );
}
