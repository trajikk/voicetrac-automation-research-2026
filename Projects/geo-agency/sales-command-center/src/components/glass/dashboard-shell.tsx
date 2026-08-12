"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MapPinned,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { GlassSidebar } from "@/components/glass/glass-sidebar";
import { GlassTopBar } from "@/components/glass/glass-topbar";
import { navItems, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const icons: Record<NavItem["icon"], React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  MapPinned,
  LayoutGrid,
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-svh w-full">
      <GlassSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="glass-panel-strong w-72 border-r border-white/[0.08] p-0 [&>button]:text-muted-foreground"
        >
          <SheetHeader className="border-b border-white/[0.07] px-5 py-4">
            <SheetTitle className="flex items-center gap-3 text-left">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue via-accent-violet to-accent-cyan">
                <Sparkles className="size-4 text-white" />
              </div>
              <span>GEO Command</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => {
              const Icon = icons[item.icon];
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border border-accent-blue/25 bg-gradient-to-r from-accent-blue/15 via-accent-violet/10 to-transparent text-foreground"
                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-[18px]", active && "text-accent-cyan")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex min-h-svh w-full min-w-0 flex-1 flex-col">
        <GlassTopBar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
