"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MapPinned,
  LayoutGrid,
  ChevronsLeft,
  Sparkles,
} from "lucide-react";
import { navItems, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const icons: Record<NavItem["icon"], React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  MapPinned,
  LayoutGrid,
};

interface GlassSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function GlassSidebar({ collapsed, onToggle }: GlassSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 84 : 264 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="glass-panel-strong glass-edge relative z-20 hidden h-svh shrink-0 flex-col border-r border-black/[0.112] dark:border-white/[0.07] lg:flex"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue via-accent-violet to-accent-cyan shadow-[0_0_24px_-4px_var(--accent-violet)]">
          <Sparkles className="size-4.5 text-white" strokeWidth={2.25} />
        </div>
        {!collapsed && (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              GEO Command
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Sales Operations
            </span>
          </div>
        )}
      </div>

      <div className="mx-4 h-px bg-black/[0.112] dark:bg-white/[0.07]" />

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = icons[item.icon];
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-200",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl border border-accent-blue/25 bg-gradient-to-r from-accent-blue/15 via-accent-violet/10 to-transparent"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 size-[18px] shrink-0 transition-colors",
                  active ? "text-accent-cyan" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </nav>

      <div className="mx-4 h-px bg-black/[0.112] dark:bg-white/[0.07]" />

      {/* Footer / user + collapse toggle */}
      <div className="flex items-center gap-3 px-3 py-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet/70 to-accent-blue/70 text-xs font-semibold text-white">
          FC
        </div>
        {!collapsed && (
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              Fred Caldero
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Founder
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-black/[0.096] dark:hover:bg-white/[0.06] hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft
            className={cn("size-4 transition-transform duration-300", collapsed && "rotate-180")}
          />
        </button>
      </div>
    </motion.aside>
  );
}
