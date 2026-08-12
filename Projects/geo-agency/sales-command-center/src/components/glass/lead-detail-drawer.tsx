"use client";

import {
  Building2,
  Calendar,
  DollarSign,
  Globe,
  Mail,
  MapPin,
  NotebookText,
  Phone,
  Radar,
  ShieldCheck,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/types";
import { getAccent } from "@/lib/accent";
import { formatCurrency, formatDate, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExclusiveStatusBadge } from "@/components/glass/status-badge";
import { LeadStatusSelect } from "@/components/glass/lead-status-select";
import { LeadNotesPanel } from "@/components/glass/lead-notes-panel";

interface LeadDetailDrawerProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: (leadId: string, body: string) => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.064] dark:bg-white/[0.04] text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
        <p className="truncate text-sm text-foreground/90">{value}</p>
      </div>
    </div>
  );
}

export function LeadDetailDrawer({
  lead,
  open,
  onOpenChange,
  onAddNote,
  onStatusChange,
}: LeadDetailDrawerProps) {
  if (!lead) return null;
  const accent = getAccent(lead.avatarAccent);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="glass-panel-strong w-full border-l border-black/[0.144] dark:border-white/[0.09] p-0 sm:max-w-md [&>button]:text-muted-foreground [&>button]:hover:text-foreground"
      >
        <SheetHeader className="border-b border-black/[0.112] dark:border-white/[0.07] px-6 py-5">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold",
                accent.bgSoft,
                accent.text,
              )}
            >
              {initials(lead.company)}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-base font-semibold text-foreground">
                {lead.company}
              </SheetTitle>
              <SheetDescription className="truncate text-xs text-muted-foreground">
                {lead.niche} · {lead.city}, {lead.state}
              </SheetDescription>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <LeadStatusSelect
                  status={lead.status}
                  onChange={(status) => onStatusChange(lead.id, status)}
                />
                <ExclusiveStatusBadge status={lead.exclusiveStatus} />
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Deal value */}
          <div className="glass-panel glass-edge mb-5 flex items-center justify-between rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <DollarSign className="size-4 text-accent-emerald" />
              <span className="text-xs text-muted-foreground">Projected MRR</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {formatCurrency(lead.dealValue)}
            </span>
          </div>

          {/* Contact info */}
          <p className="mb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Contact
          </p>
          <div className="divide-y divide-black/[0.096] dark:divide-white/[0.06]">
            <InfoRow icon={Building2} label="Contact name" value={lead.contactName} />
            <InfoRow icon={Phone} label="Phone" value={lead.phone} />
            <InfoRow icon={Mail} label="Email" value={lead.email} />
            <InfoRow icon={Globe} label="Website" value={lead.website} />
            <InfoRow icon={MapPin} label="Location" value={`${lead.city}, ${lead.state}`} />
            <InfoRow icon={Calendar} label="Last contact" value={formatDate(lead.lastContact)} />
          </div>

          <Separator className="my-5 bg-black/[0.112] dark:bg-white/[0.07]" />

          {/* Competitors */}
          <div className="mb-5">
            <p className="mb-2.5 flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              <Radar className="size-3.5" /> Local competitors
            </p>
            <div className="flex flex-wrap gap-2">
              {lead.competitors.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Background */}
          <div className="mb-5">
            <p className="mb-2.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Background
            </p>
            <p className="glass-panel glass-edge rounded-xl px-4 py-3.5 text-sm leading-relaxed text-foreground/80">
              {lead.background}
            </p>
          </div>

          <Separator className="my-5 bg-black/[0.112] dark:bg-white/[0.07]" />

          {/* Notes */}
          <div className="mb-2">
            <p className="mb-2.5 flex items-center gap-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              <NotebookText className="size-3.5" /> Notes
            </p>
            <LeadNotesPanel key={lead.id} lead={lead} onAddNote={onAddNote} />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5 border-t border-black/[0.112] dark:border-white/[0.07] px-6 py-5">
          <Button className="col-span-2 bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-[0_4px_20px_-6px_var(--accent-violet)] hover:opacity-90">
            <Calendar className="size-4" />
            Schedule Demo
          </Button>
          <Button
            variant="outline"
            className="border-black/16 dark:border-white/10 bg-black/[0.048] dark:bg-white/[0.03] text-foreground/90 hover:bg-black/[0.112] dark:hover:bg-white/[0.07]"
          >
            <Phone className="size-4" />
            Call
          </Button>
          <Button
            variant="outline"
            className="border-black/16 dark:border-white/10 bg-black/[0.048] dark:bg-white/[0.03] text-foreground/90 hover:bg-black/[0.112] dark:hover:bg-white/[0.07]"
          >
            <Mail className="size-4" />
            Email
          </Button>
          <Button
            variant="outline"
            className="col-span-2 border-accent-emerald/25 bg-accent-emerald/[0.06] text-accent-emerald hover:bg-accent-emerald/[0.12]"
          >
            <ShieldCheck className="size-4" />
            Lock Territory
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
