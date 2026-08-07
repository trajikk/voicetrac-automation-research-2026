import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CheckIcon, BuildIcon, RetainerIcon } from "./icons";

const build = [
  "Custom-built, not templated — every page written around your actual work, not generic listicle copy",
  "Technically sound from day one: server-rendered, crawlable by AI systems, fast",
  "Structured around what your customers actually ask, not what a keyword tool guesses",
  "Service-and-area pages built for where you really work, done right — not spun out to game rankings",
  "Schema and technical foundations in place, the way search and AI systems actually expect",
];

const retainer = [
  "Ongoing content built around real questions your customers ask",
  "Citation and mention building — the digital word-of-mouth AI systems actually pull from",
  "Review and reputation management across the platforms that matter",
  "A monthly report showing whether you're actually being mentioned by ChatGPT, Claude, and Perplexity — not a vanity metric, the real thing",
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-20">
      <Container className="py-24">
        <Reveal>
          <p className="font-mono-tech text-xs uppercase tracking-widest text-ember">
            The Offer
          </p>
          <h2 className="font-display mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
            Two things. Done properly.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.05}>
            <div className="h-full rounded-2xl border border-border bg-surface p-8 sm:p-10">
              <div className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-ember">
                <BuildIcon className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-6 text-2xl font-medium tracking-tight">
                The Build
              </h3>
              <p className="mt-2 text-sm text-muted">
                A site built to be found — by people and by AI.
              </p>
              <ul className="mt-6 space-y-3.5">
                {build.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember" />
                    <span className="text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="h-full rounded-2xl border border-border bg-surface p-8 sm:p-10">
              <div className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-background text-ember">
                <RetainerIcon className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-6 text-2xl font-medium tracking-tight">
                The Retainer
              </h3>
              <p className="mt-2 text-sm text-muted">
                Getting found once is luck. Staying found is the job.
              </p>
              <ul className="mt-6 space-y-3.5">
                {retainer.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <CheckIcon className="mt-0.5 h-4 w-4 flex-none text-ember" />
                    <span className="text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
