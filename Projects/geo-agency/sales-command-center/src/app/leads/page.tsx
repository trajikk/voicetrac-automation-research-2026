"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Users } from "lucide-react";
import { leads as initialLeads } from "@/lib/mock-data";
import type { Lead, LeadStatus } from "@/lib/types";
import { GlassCard } from "@/components/glass/glass-card";
import { LeadRow } from "@/components/glass/lead-row";
import { LeadDetailDrawer } from "@/components/glass/lead-detail-drawer";
import { QuickAddModal } from "@/components/glass/quick-add-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const statusFilters: Array<LeadStatus | "All"> = [
  "All",
  "New",
  "Contacted",
  "Demo Scheduled",
  "Negotiating",
  "Closed Won",
  "Closed Lost",
];

function LeadsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [leadsData, setLeadsData] = useState<Lead[]>(initialLeads);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(() => searchParams.get("new") === "1");

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      router.replace("/leads");
    }
  }, [searchParams, router]);

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leadsData.filter((lead) => {
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      const matchesQuery =
        !q ||
        lead.company.toLowerCase().includes(q) ||
        lead.niche.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.contactName.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [leadsData, query, statusFilter]);

  function handleSelect(lead: Lead) {
    setSelectedLead(lead);
    setDrawerOpen(true);
  }

  function handleAdd(lead: Lead) {
    setLeadsData((prev) => [lead, ...prev]);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, niche, city…"
            className="h-9 border-white/[0.08] bg-white/[0.03] pl-9 placeholder:text-muted-foreground/70 focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
          />
        </div>

        <Button
          onClick={() => setQuickAddOpen(true)}
          className="w-full bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-[0_4px_20px_-6px_var(--accent-violet)] hover:opacity-90 sm:w-auto"
        >
          <Plus className="size-4" />
          Quick Add Lead
        </Button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              statusFilter === status
                ? "border-accent-blue/30 bg-accent-blue/12 text-accent-blue"
                : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Leads list */}
      <GlassCard noPadding>
        <div className="hidden grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.3fr)_28px] gap-4 border-b border-white/[0.06] px-8 py-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase lg:grid">
          <span>Company</span>
          <span>Niche</span>
          <span>City</span>
          <span>Status</span>
          <span>Last Contact</span>
          <span>Exclusive</span>
          <span />
        </div>

        <div className="max-h-[calc(100svh-24rem)] min-h-[24rem] overflow-y-auto px-3 py-2 lg:px-4">
          {filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-white/[0.04] text-muted-foreground">
                <Users className="size-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                No leads match your filters. Try adjusting your search.
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                active={selectedLead?.id === lead.id && drawerOpen}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-3 text-xs text-muted-foreground">
          <span>
            Showing {filteredLeads.length} of {leadsData.length} leads
          </span>
        </div>
      </GlassCard>

      <LeadDetailDrawer lead={selectedLead} open={drawerOpen} onOpenChange={setDrawerOpen} />
      <QuickAddModal open={quickAddOpen} onOpenChange={setQuickAddOpen} onAdd={handleAdd} />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsPageInner />
    </Suspense>
  );
}
