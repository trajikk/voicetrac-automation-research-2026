"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Users } from "lucide-react";
import { loadLeads, saveLeads } from "@/lib/leads-store";
import { leads as seedLeads } from "@/lib/mock-data";
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

  // Seed with static mock data so server and client render identically on
  // first paint, then swap in whatever's in localStorage right after mount.
  // (Reading localStorage inside the initializer would desync SSR vs. client
  // output and trigger a hydration mismatch, since it's unavailable on the
  // server.)
  const [leadsData, setLeadsData] = useState<Lead[]>(seedLeads);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(() => searchParams.get("new") === "1");

  const selectedLead = leadsData.find((lead) => lead.id === selectedLeadId) ?? null;

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      router.replace("/leads");
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Hydrating persisted leads from localStorage post-mount; can't be done
    // in the initializer without a server/client mismatch (see comment above).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeadsData(loadLeads());
  }, []);

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
    setSelectedLeadId(lead.id);
    setDrawerOpen(true);
  }

  function handleAdd(lead: Lead) {
    const next = [lead, ...leadsData];
    setLeadsData(next);
    saveLeads(next);
  }

  function handleAddNote(leadId: string, body: string) {
    const trimmed = body.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const next = leadsData.map((lead) =>
      lead.id === leadId
        ? {
            ...lead,
            notes: [{ id: `nt-${Date.now()}`, body: trimmed, createdAt: now }, ...lead.notes],
            lastContact: now.slice(0, 10),
          }
        : lead,
    );
    setLeadsData(next);
    saveLeads(next);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Leads Pipeline
            </h2>
            <span className="inline-flex items-center rounded-full border border-accent-blue/25 bg-accent-blue/10 px-2.5 py-0.5 text-xs font-medium text-accent-blue shadow-[0_0_14px_-4px_var(--accent-blue)]">
              {leadsData.length} total
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Every prospect, exactly where they stand — click a row for the full picture.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2 text-muted-foreground transition-colors" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, niche, city…"
            className="h-9 border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] pl-9 placeholder:text-muted-foreground/70 transition-shadow duration-200 focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/25 focus-visible:shadow-[0_0_0_4px_oklch(0.65_0.19_262_/_10%)]"
          />
        </div>

        <Button
          onClick={() => setQuickAddOpen(true)}
          className="w-full bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-[0_4px_20px_-6px_var(--accent-violet)] transition-all hover:opacity-90 hover:shadow-[0_6px_28px_-6px_var(--accent-violet)] sm:w-auto"
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
              "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200",
              statusFilter === status
                ? "border-accent-blue/30 bg-accent-blue/12 text-accent-blue shadow-[0_0_14px_-4px_var(--accent-blue)]"
                : "border-black/[0.128] dark:border-white/[0.08] bg-black/[0.032] dark:bg-white/[0.02] text-muted-foreground hover:border-black/[0.224] dark:hover:border-white/[0.14] hover:bg-black/[0.08] dark:hover:bg-white/[0.05] hover:text-foreground",
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Leads list */}
      <GlassCard strong noPadding className="shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]">
        <div className="hidden grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.3fr)_28px] gap-4 border-b border-black/[0.112] dark:border-white/[0.07] bg-black/[0.032] dark:bg-white/[0.02] px-8 py-3 text-[11px] font-semibold tracking-wide text-muted-foreground/90 uppercase lg:grid">
          <span>Company</span>
          <span>Niche</span>
          <span>City</span>
          <span>Status</span>
          <span>Last Contact</span>
          <span>Exclusive</span>
          <span />
        </div>

        <div className="max-h-[calc(100svh-26rem)] min-h-[24rem] overflow-y-auto px-3 py-2 lg:px-4">
          {filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-black/[0.064] dark:bg-white/[0.04] text-muted-foreground">
                <Users className="size-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                No leads match your filters. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.072] dark:divide-white/[0.045]">
              {filteredLeads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  active={selectedLeadId === lead.id && drawerOpen}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-black/[0.112] dark:border-white/[0.07] bg-black/[0.024] dark:bg-white/[0.015] px-6 py-3 text-xs text-muted-foreground">
          <span>
            Showing <span className="text-foreground/80">{filteredLeads.length}</span> of{" "}
            {leadsData.length} leads
          </span>
        </div>
      </GlassCard>

      <LeadDetailDrawer
        lead={selectedLead}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onAddNote={handleAddNote}
      />
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
