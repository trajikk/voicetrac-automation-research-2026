import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { services } from "@/lib/services";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/40">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Origin Visibility helps businesses become the answer&nbsp;&mdash;
            rebuilding websites and search presence so you show up in AI
            answers and search results alike.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Services</h3>
          <ul className="mt-4 space-y-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services#${service.slug}`}
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  {service.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Company</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/about" className="text-sm text-muted transition-colors hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-sm text-muted transition-colors hover:text-gold">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-muted transition-colors hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a href="mailto:hello@originvisibility.com" className="transition-colors hover:text-gold">
                hello@originvisibility.com
              </a>
            </li>
            <li>
              <a href="tel:+18005550119" className="transition-colors hover:text-gold">
                (800) 555-0119
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>&copy; {year} Origin Visibility. All rights reserved.</p>
          <p>AI search visibility, SEO &amp; website rebuilds.</p>
        </Container>
      </div>
    </footer>
  );
}
