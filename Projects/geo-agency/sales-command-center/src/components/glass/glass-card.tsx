import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
  strong?: boolean;
  interactive?: boolean;
  noPadding?: boolean;
}

export function GlassCard({
  className,
  strong,
  interactive,
  noPadding,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-edge relative overflow-hidden rounded-2xl",
        strong ? "glass-panel-strong" : "glass-panel",
        !noPadding && "p-5",
        interactive &&
          "transition-all duration-300 ease-out hover:border-black/[0.256] dark:hover:border-white/[0.16] hover:bg-black/[0.088] dark:hover:bg-white/[0.055] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-sm font-medium tracking-tight text-foreground/90", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
