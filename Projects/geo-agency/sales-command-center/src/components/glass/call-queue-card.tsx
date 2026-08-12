import Link from "next/link";
import { ChevronRight, PhoneCall, PhoneMissed } from "lucide-react";
import type { Lead } from "@/lib/types";
import { callQueueReason, isDueToday } from "@/lib/cadence";
import { getAccent } from "@/lib/accent";
import { initials, todayISODate } from "@/lib/format";
import { GlassCard } from "@/components/glass/glass-card";
import { cn } from "@/lib/utils";

const MAX_VISIBLE = 6;

function urgency(lead: Lead): 0 | 1 | 2 {
  if (!lead.nextCallDate) return 2; // never contacted — least urgent
  return lead.nextCallDate < todayISODate() ? 0 : 1; // overdue first, then due today
}

export function CallQueueCard({ leads }: { leads: Lead[] }) {
  const due = leads
    .filter(isDueToday)
    .sort((a, b) => {
      const u = urgency(a) - urgency(b);
      if (u !== 0) return u;
      return (a.nextCallDate ?? "").localeCompare(b.nextCallDate ?? "");
    });

  const visible = due.slice(0, MAX_VISIBLE);
  const overflow = due.length - visible.length;

  return (
    <GlassCard strong noPadding className="shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]">
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
            <PhoneCall className="size-4 text-accent-amber" />
            Call Queue — Today
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Who needs a call, driven by your follow-up cadence
          </p>
        </div>
        {due.length > 0 && (
          <span className="inline-flex items-center rounded-full border border-accent-amber/25 bg-accent-amber/10 px-2.5 py-0.5 text-xs font-medium text-accent-amber shadow-[0_0_14px_-4px_var(--accent-amber)]">
            {due.length} due
          </span>
        )}
      </div>

      <div className="mt-3 px-3 pb-3">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-accent-emerald/10 text-accent-emerald">
              <PhoneCall className="size-5" />
            </div>
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up — no calls due today.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.06] dark:divide-white/[0.045]">
            {visible.map((lead) => {
              const accent = getAccent(lead.avatarAccent);
              const overdue = lead.nextCallDate ? lead.nextCallDate < todayISODate() : false;
              return (
                <Link
                  key={lead.id}
                  href={`/leads?open=${lead.id}`}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.045]"
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      accent.bgSoft,
                      accent.text,
                    )}
                  >
                    {initials(lead.company)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{lead.company}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {lead.niche} · {lead.city}, {lead.state}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap sm:inline-flex",
                      overdue
                        ? "border-accent-rose/25 bg-accent-rose/10 text-accent-rose"
                        : "border-accent-amber/25 bg-accent-amber/10 text-accent-amber",
                    )}
                  >
                    <PhoneMissed className="size-3" />
                    {callQueueReason(lead)}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              );
            })}
          </div>
        )}

        {overflow > 0 && (
          <Link
            href="/leads"
            className="mt-1 block px-3 py-2 text-center text-xs text-muted-foreground hover:text-foreground"
          >
            +{overflow} more due today — view all leads
          </Link>
        )}
      </div>
    </GlassCard>
  );
}
