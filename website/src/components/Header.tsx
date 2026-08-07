"use client";

import { useState } from "react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { LinkButton } from "./Button";

const links = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "How It Works" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/85 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between py-4">
        <a href="#top" aria-label="Origin home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/75 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <LinkButton href="#contact" className="!py-2.5 !px-5 text-sm">
            Get Your Free AI Visibility Check
          </LinkButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </Container>

      {open && (
        <div className="border-t border-border-soft bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground/80 hover:bg-surface"
              >
                {link.label}
              </a>
            ))}
            <LinkButton href="#contact" onClick={() => setOpen(false)} className="mt-2">
              Get Your Free AI Visibility Check
            </LinkButton>
          </Container>
        </div>
      )}
    </header>
  );
}
