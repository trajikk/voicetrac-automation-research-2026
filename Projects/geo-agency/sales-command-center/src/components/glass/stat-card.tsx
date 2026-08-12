"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { getAccent, type Accent } from "@/lib/accent";
import { GlassCard } from "@/components/glass/glass-card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: Accent;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  index?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  trend,
  trendDirection = "neutral",
  index = 0,
}: StatCardProps) {
  const accentClasses = getAccent(accent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <GlassCard interactive className="group relative">
        <div
          className={cn(
            "pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-90",
            accentClasses.gradient,
          )}
        />
        <div className="relative flex items-start justify-between">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              accentClasses.bgSoft,
              accentClasses.text,
            )}
          >
            <Icon className="size-[18px]" />
          </div>
          {trend && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                trendDirection === "up" && "bg-accent-emerald/12 text-accent-emerald",
                trendDirection === "down" && "bg-accent-rose/12 text-accent-rose",
                trendDirection === "neutral" && "bg-black/[0.08] dark:bg-white/[0.05] text-muted-foreground",
              )}
            >
              {trend}
            </span>
          )}
        </div>
        <p className="relative mt-4 text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="relative mt-1 text-sm text-muted-foreground">{label}</p>
      </GlassCard>
    </motion.div>
  );
}
