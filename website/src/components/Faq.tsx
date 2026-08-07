import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { FaqAccordion } from "./FaqAccordion";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20">
      <Container className="py-24">
        <Reveal className="max-w-xl">
          <p className="font-mono-tech text-xs uppercase tracking-widest text-ember">
            Questions Worth Asking
          </p>
          <h2 className="font-display mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
            Fair questions. Straight answers.
          </h2>
        </Reveal>

        <div className="mt-12">
          <FaqAccordion />
        </div>
      </Container>
    </section>
  );
}
