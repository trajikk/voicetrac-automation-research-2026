"use client";

import Link from "next/link";
import {
  Users,
  CalendarClock,
  ShieldCheck,
  Wallet,
  Plus,
  MapPinned,
  Presentation,
  ScanSearch,
  ArrowUpRight,
} from "lucide-react";
import { leads, territories, activityFeed } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/glass/stat-card";
import { GlassCard, GlassCardHeader, GlassCardTitle } from "@/components/glass/glass-card";
import { ActivityRow } from "@/components/glass/activity-row";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const totalLeads = leads.length;
  const demosThisWeek = leads.filter((l) => l.status === "Demo Scheduled").length;
  const lockedTerritories = territories.filter((t) => t.status !== "Available").length;
  const mrr = leads
    .filter((l) => l.status === "Closed Won")
    .reduce((sum, l) => sum + l.dealValue, 0);

  const pipelineValue = leads
    .filter((l) => l.status !== "Closed Lost" && l.status !== "Closed Won")
    .reduce((sum, l) => sum + l.dealValue, 0);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome back, Fred
        </h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your GEO territories today.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Total Leads"
          value={String(totalLeads)}
          icon={Users}
          accent="blue"
          trend="+4 this week"
          trendDirection="up"
        />
        <StatCard
          index={1}
          label="Demos This Week"
          value={String(demosThisWeek)}
          icon={CalendarClock}
          accent="violet"
          trend="On track"
          trendDirection="neutral"
        />
        <StatCard
          index={2}
          label="Locked Territories"
          value={`${lockedTerritories} / ${territories.length}`}
          icon={ShieldCheck}
          accent="emerald"
          trend="+3 this week"
          trendDirection="up"
        />
        <StatCard
          index={3}
          label="Monthly Recurring Revenue"
          value={formatCurrency(mrr)}
          icon={Wallet}
          accent="cyan"
          trend={`${formatCurrency(pipelineValue)} in pipeline`}
          trendDirection="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent activity */}
        <GlassCard className="xl:col-span-2" noPadding>
          <div className="flex items-center justify-between px-6 pt-6">
            <div>
              <h3 className="text-sm font-medium tracking-tight text-foreground/90">
                Recent Activity
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Latest touches across your pipeline
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:bg-black/[0.096] dark:hover:bg-white/[0.06] hover:text-foreground"
            >
              <Link href="/leads">
                View leads
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="mt-2 divide-y divide-black/[0.08] dark:divide-white/[0.05] px-6 pb-2">
            {activityFeed.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        </GlassCard>

        {/* Quick actions */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Quick Actions</GlassCardTitle>
          </GlassCardHeader>
          <div className="flex flex-col gap-2.5">
            <Button
              asChild
              className="justify-start gap-3 bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-[0_4px_20px_-6px_var(--accent-violet)] hover:opacity-90"
            >
              <Link href="/leads?new=1">
                <Plus className="size-4" />
                Add New Lead
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start gap-3 border-black/16 dark:border-white/10 bg-black/[0.048] dark:bg-white/[0.03] text-foreground/90 hover:bg-black/[0.112] dark:hover:bg-white/[0.07]"
            >
              <Link href="/territories">
                <MapPinned className="size-4 text-accent-emerald" />
                Lock a Territory
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start gap-3 border-black/16 dark:border-white/10 bg-black/[0.048] dark:bg-white/[0.03] text-foreground/90 hover:bg-black/[0.112] dark:hover:bg-white/[0.07]"
            >
              <Link href="/tools/pitch-pack-generator">
                <Presentation className="size-4 text-accent-blue" />
                Generate Pitch Pack
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start gap-3 border-black/16 dark:border-white/10 bg-black/[0.048] dark:bg-white/[0.03] text-foreground/90 hover:bg-black/[0.112] dark:hover:bg-white/[0.07]"
            >
              <Link href="/tools/visibility-scanner">
                <ScanSearch className="size-4 text-accent-cyan" />
                Run Visibility Scan
              </Link>
            </Button>
          </div>

          <div className="mt-5 rounded-xl border border-accent-violet/20 bg-gradient-to-br from-accent-violet/[0.08] to-transparent p-4">
            <p className="text-xs font-medium text-foreground/90">Territory pressure</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              3 niches have 2+ active leads competing for the same city. Lock in fast to protect
              exclusivity.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
