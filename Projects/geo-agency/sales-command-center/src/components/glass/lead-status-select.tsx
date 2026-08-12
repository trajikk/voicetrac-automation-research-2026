"use client";

import { Check, ChevronDown } from "lucide-react";
import type { LeadStatus } from "@/lib/types";
import { LeadStatusBadge } from "@/components/glass/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allStatuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Demo Scheduled",
  "Negotiating",
  "Closed Won",
  "Closed Lost",
];

interface LeadStatusSelectProps {
  status: LeadStatus;
  onChange: (status: LeadStatus) => void;
}

export function LeadStatusSelect({ status, onChange }: LeadStatusSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-1 rounded-full transition-transform hover:scale-[1.03] active:scale-[0.97]"
        >
          <LeadStatusBadge status={status} />
          <ChevronDown className="size-3 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {allStatuses.map((s) => (
          <DropdownMenuItem
            key={s}
            onSelect={() => onChange(s)}
            className="flex items-center justify-between gap-2 py-1.5"
          >
            <LeadStatusBadge status={s} />
            {s === status && <Check className="size-3.5 shrink-0 text-accent-blue" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
