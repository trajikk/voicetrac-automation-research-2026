import { Logo } from "./Logo";
import { Container } from "./Container";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "How It Works" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-soft bg-background-deep">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">Origin — AI Visibility &amp; Web</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/75 transition-colors hover:text-ember-bright"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="space-y-1.5 text-sm text-muted">
          <p>
            <a href="mailto:hello@getorigin.ai" className="transition-colors hover:text-ember-bright">
              hello@getorigin.ai
            </a>
          </p>
          <p>
            <a href="tel:+17205550148" className="transition-colors hover:text-ember-bright">
              (720) 555-0148
            </a>
          </p>
          <p>Denver, CO</p>
        </div>
      </Container>

      <div className="border-t border-border-soft">
        <Container className="flex flex-col gap-3 py-6 text-xs leading-relaxed text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Origin. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            Origin is not affiliated with Google, OpenAI, Anthropic, or Perplexity.
            AI visibility can be improved but never guaranteed by any provider.
          </p>
        </Container>
      </div>
    </footer>
  );
}
