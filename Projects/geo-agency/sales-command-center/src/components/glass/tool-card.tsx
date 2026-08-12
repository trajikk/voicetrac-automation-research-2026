import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ToolItem } from "@/lib/types";
import { getAccent } from "@/lib/accent";
import { toolIcons } from "@/lib/tool-icons";
import { GlassCard } from "@/components/glass/glass-card";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: ToolItem }) {
  const accent = getAccent(tool.accent);
  const Icon = toolIcons[tool.icon];
  const comingSoon = tool.status === "coming-soon";

  const content = (
    <GlassCard
      interactive={!comingSoon}
      className={cn("group relative h-full", comingSoon && "opacity-70")}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br opacity-50 blur-2xl transition-opacity duration-300",
          accent.gradient,
          !comingSoon && "group-hover:opacity-80",
        )}
      />
      <div className="relative flex items-start justify-between">
        <div className={cn("flex size-11 items-center justify-center rounded-xl", accent.bgSoft, accent.text)}>
          <Icon className="size-5" />
        </div>
        {comingSoon ? (
          <span className="rounded-full border border-black/[0.128] dark:border-white/[0.08] bg-black/[0.064] dark:bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground">
            Coming Soon
          </span>
        ) : (
          <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        )}
      </div>

      <h3 className="relative mt-4 text-sm font-semibold tracking-tight text-foreground">
        {tool.name}
      </h3>
      <p className="relative mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {tool.description}
      </p>
    </GlassCard>
  );

  if (comingSoon) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={tool.href} className="block h-full">
      {content}
    </Link>
  );
}
