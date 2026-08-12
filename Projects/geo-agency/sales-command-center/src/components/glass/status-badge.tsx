import { cn } from "@/lib/utils";
import type { ExclusiveStatus, LeadStatus, TerritoryStatus } from "@/lib/types";

const leadStatusStyles: Record<LeadStatus, string> = {
  New: "bg-accent-cyan/12 text-accent-cyan border-accent-cyan/25",
  Contacted: "bg-accent-blue/12 text-accent-blue border-accent-blue/25",
  "Demo Scheduled": "bg-accent-violet/12 text-accent-violet border-accent-violet/25",
  Negotiating: "bg-accent-amber/12 text-accent-amber border-accent-amber/25",
  "Closed Won": "bg-accent-emerald/12 text-accent-emerald border-accent-emerald/25",
  "Closed Lost": "bg-white/[0.05] text-muted-foreground border-white/10",
};

const exclusiveStatusStyles: Record<ExclusiveStatus, string> = {
  "Exclusive Locked": "bg-accent-emerald/12 text-accent-emerald border-accent-emerald/25",
  "Pending Lock": "bg-accent-amber/12 text-accent-amber border-accent-amber/25",
  Available: "bg-white/[0.05] text-muted-foreground border-white/10",
};

const territoryStatusStyles: Record<TerritoryStatus, string> = {
  Locked: "bg-accent-emerald/12 text-accent-emerald border-accent-emerald/25",
  Reserved: "bg-accent-amber/12 text-accent-amber border-accent-amber/25",
  Available: "bg-accent-cyan/12 text-accent-cyan border-accent-cyan/25",
};

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none whitespace-nowrap",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
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
