"use client";

import { useMemo, useState } from "react";
import { MapPinned, ShieldCheck, Clock3, Unlock } from "lucide-react";
import { territories } from "@/lib/mock-data";
import type { TerritoryStatus } from "@/lib/types";
import { TerritoryCard } from "@/components/glass/territory-card";
import { StatCard } from "@/components/glass/stat-card";
import { cn } from "@/lib/utils";

const filters: Array<TerritoryStatus | "All"> = ["All", "Locked", "Reserved", "Available"];

export default function TerritoriesPage() {
  const [filter, setFilter] = useState<TerritoryStatus | "All">("All");

  const counts = useMemo(
    () => ({
      total: territories.length,
      locked: territories.filter((t) => t.status === "Locked").length,
      reserved: territories.filter((t) => t.status === "Reserved").length,
      available: territories.filter((t) => t.status === "Available").length,
    }),
    [],
  );

  const filtered = useMemo(
    () => (filter === "All" ? territories : territories.filter((t) => t.status === filter)),
    [filter],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Exclusive Territories
        </h2>
        <p className="text-sm text-muted-foreground">
          One agency per niche, per city. Track locked, reserved, and open exclusivity spots.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          index={0}
          label="Locked Exclusive"
          value={String(counts.locked)}
          icon={ShieldCheck}
          accent="emerald"
        />
        <StatCard
          index={1}
          label="Reserved / Pending"
          value={String(counts.reserved)}
          icon={Clock3}
          accent="amber"
        />
        <StatCard
          index={2}
          label="Available"
          value={String(counts.available)}
          icon={Unlock}
          accent="cyan"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              filter === f
                ? "border-accent-blue/30 bg-accent-blue/12 text-accent-blue"
                : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
            )}
          >
            {f}
            <span className="ml-1.5 text-muted-foreground/70">
              {f === "All"
                ? counts.total
                : f === "Locked"
                  ? counts.locked
                  : f === "Reserved"
                    ? counts.reserved
                    : counts.available}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-20 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/[0.04] text-muted-foreground">
            <MapPinned className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">No territories match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((territory) => (
            <TerritoryCard key={territory.id} territory={territory} />
          ))}
        </div>
      )}
    </div>
  );
}
