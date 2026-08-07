import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium tracking-tight transition-all duration-200 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-ember text-background-deep hover:bg-ember-bright shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]",
  secondary:
    "border border-border text-foreground hover:border-ember-line hover:text-ember-bright",
  ghost: "text-foreground/80 hover:text-ember-bright",
};

type AnchorButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
};

export function LinkButton({
  variant = "primary",
  className,
  href,
  ...props
}: AnchorButtonProps) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className ?? ""}`} {...props} />
  );
}

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  variant = "primary",
  className,
  ...props
}: NativeButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className ?? ""}`} {...props} />
  );
}
