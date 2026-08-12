import { Building2, Calendar, MapPin, Users2, Zap, DollarSign } from "lucide-react";
import type { Territory } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { TerritoryStatusBadge } from "@/components/glass/status-badge";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const competitionStyles: Record<Territory["competitionLevel"], string> = {
  Low: "text-accent-emerald",
  Medium: "text-accent-amber",
  High: "text-accent-rose",
};

export function TerritoryCard({ territory }: { territory: Territory }) {
  const isOpen = territory.status === "Available";

  return (
    <GlassCard interactive className="relative flex flex-col">
      <div
        className={cn(
          "pointer-events-none absolute -top-12 -right-12 size-40 rounded-full blur-3xl",
          territory.status === "Locked" && "bg-accent-emerald/15",
          territory.status === "Reserved" && "bg-accent-amber/15",
          territory.status === "Available" && "bg-accent-cyan/10",
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{territory.niche}</p>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {territory.city}, {territory.state}
          </p>
        </div>
        <TerritoryStatusBadge status={territory.status} />
      </div>

      <div className="relative mt-4 flex-1">
        {isOpen ? (
          <div className="flex h-full flex-col justify-between gap-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              This territory is open — no agency currently holds exclusivity here.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users2 className="size-3.5" />
                {territory.population}
              </span>
              <span className={cn("flex items-center gap-1.5", competitionStyles[territory.competitionLevel])}>
                <Zap className="size-3.5" />
                {territory.competitionLevel} competition
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 rounded-xl border border-black/[0.096] dark:border-white/[0.06] bg-black/[0.032] dark:bg-white/[0.02] p-3">
            <div className="flex items-center gap-2.5 text-xs text-foreground/85">
              <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium">{territory.lockedBy}</span>
            </div>
            {territory.lockedSince && (
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5 shrink-0" />
                Since {formatDate(territory.lockedSince)}
              </div>
            )}
            {territory.monthlyValue !== undefined && (
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <DollarSign className="size-3.5 shrink-0" />
                {formatCurrency(territory.monthlyValue)}/mo
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <Button
          size="sm"
          className="relative mt-4 w-full bg-accent-emerald/12 text-accent-emerald hover:bg-accent-emerald/20"
        >
          Lock This Territory
        </Button>
      )}
    </GlassCard>
  );
}
