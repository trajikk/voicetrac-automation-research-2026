import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-150 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-background hover:bg-cyan",
  secondary: "border border-border text-foreground hover:border-gold hover:text-gold",
  ghost: "text-foreground/80 hover:text-gold",
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className ?? ""}`} {...props} />
  );
}
