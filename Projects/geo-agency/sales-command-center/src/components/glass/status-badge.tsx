import { cn } from "@/lib/utils";
import type { ExclusiveStatus, LeadStatus, TerritoryStatus } from "@/lib/types";

const leadStatusStyles: Record<LeadStatus, string> = {
  New: "bg-accent-cyan/12 text-accent-cyan border-accent-cyan/25 shadow-[0_0_14px_-4px_var(--accent-cyan)]",
  Contacted:
    "bg-accent-blue/12 text-accent-blue border-accent-blue/25 shadow-[0_0_14px_-4px_var(--accent-blue)]",
  "Demo Scheduled":
    "bg-accent-violet/12 text-accent-violet border-accent-violet/25 shadow-[0_0_14px_-4px_var(--accent-violet)]",
  Negotiating:
    "bg-accent-amber/12 text-accent-amber border-accent-amber/25 shadow-[0_0_14px_-4px_var(--accent-amber)]",
  "Closed Won":
    "bg-accent-emerald/12 text-accent-emerald border-accent-emerald/25 shadow-[0_0_14px_-4px_var(--accent-emerald)]",
  "Closed Lost": "bg-black/[0.08] dark:bg-white/[0.05] text-muted-foreground border-black/16 dark:border-white/10",
};

const exclusiveStatusStyles: Record<ExclusiveStatus, string> = {
  "Exclusive Locked":
    "bg-accent-emerald/12 text-accent-emerald border-accent-emerald/25 shadow-[0_0_14px_-4px_var(--accent-emerald)]",
  "Pending Lock":
    "bg-accent-amber/12 text-accent-amber border-accent-amber/25 shadow-[0_0_14px_-4px_var(--accent-amber)]",
  Available: "bg-black/[0.08] dark:bg-white/[0.05] text-muted-foreground border-black/16 dark:border-white/10",
};

const territoryStatusStyles: Record<TerritoryStatus, string> = {
  Locked:
    "bg-accent-emerald/12 text-accent-emerald border-accent-emerald/25 shadow-[0_0_14px_-4px_var(--accent-emerald)]",
  Reserved:
    "bg-accent-amber/12 text-accent-amber border-accent-amber/25 shadow-[0_0_14px_-4px_var(--accent-amber)]",
  Available:
    "bg-accent-cyan/12 text-accent-cyan border-accent-cyan/25 shadow-[0_0_14px_-4px_var(--accent-cyan)]",
};

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none whitespace-nowrap backdrop-blur-sm transition-shadow duration-200",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
      {children}
    </span>
  );
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge className={leadStatusStyles[status]}>{status}</Badge>;
}

export function ExclusiveStatusBadge({ status }: { status: ExclusiveStatus }) {
  return <Badge className={exclusiveStatusStyles[status]}>{status}</Badge>;
}

export function TerritoryStatusBadge({ status }: { status: TerritoryStatus }) {
  return <Badge className={territoryStatusStyles[status]}>{status}</Badge>;
}
