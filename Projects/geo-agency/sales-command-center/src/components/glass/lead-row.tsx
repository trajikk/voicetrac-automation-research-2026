"use client";

import { ChevronRight } from "lucide-react";
import type { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getAccent } from "@/lib/accent";
import { formatRelativeDate, initials } from "@/lib/format";
import { ExclusiveStatusBadge, LeadStatusBadge } from "@/components/glass/status-badge";

interface LeadRowProps {
  lead: Lead;
  active?: boolean;
  onSelect: (lead: Lead) => void;
}

export function LeadRow({ lead, active, onSelect }: LeadRowProps) {
  const accent = getAccent(lead.avatarAccent);

  return (
    <button
      type="button"
      onClick={() => onSelect(lead)}
      className={cn(
        "group relative grid w-full grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.3fr)_28px] items-center gap-4 rounded-xl border border-transparent px-4 py-3.5 text-left transition-all duration-200",
        "hover:border-black/[0.144] dark:hover:border-white/[0.09] hover:bg-black/[0.072] dark:hover:bg-white/[0.045] hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]",
        active &&
          "border-accent-blue/30 bg-accent-blue/[0.08] shadow-[0_0_0_1px_var(--accent-blue),0_8px_28px_-14px_var(--accent-blue)]",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-foreground ring-1 ring-black/[0.096] dark:ring-white/[0.06] transition-all duration-200 group-hover:scale-105 group-hover:ring-black/[0.224] dark:group-hover:ring-white/[0.14]",
            accent.bgSoft,
            accent.text,
          )}
        >
          {initials(lead.company)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{lead.company}</p>
          <p className="truncate text-xs text-muted-foreground">{lead.contactName}</p>
        </div>
      </div>

      <div className="min-w-0 truncate text-sm text-muted-foreground">{lead.niche}</div>

      <div className="min-w-0 truncate text-sm text-muted-foreground">
        {lead.city}, {lead.state}
      </div>

      <div className="min-w-0">
        <LeadStatusBadge status={lead.status} />
      </div>

      <div className="min-w-0 truncate text-sm text-muted-foreground">
        {formatRelativeDate(lead.lastContact)}
      </div>

      <div className="min-w-0">
        <ExclusiveStatusBadge status={lead.exclusiveStatus} />
      </div>

      <span className="flex size-6 shrink-0 items-center justify-center rounded-full transition-colors duration-200 group-hover:bg-black/[0.096] dark:group-hover:bg-white/[0.06]">
        <ChevronRight className="size-4 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </span>
    </button>
  );
}
