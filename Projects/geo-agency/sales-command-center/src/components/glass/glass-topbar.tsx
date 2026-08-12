"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Plus, Search } from "lucide-react";
import { navItems } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppearanceMenu } from "@/components/glass/appearance-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GlassTopBarProps {
  onOpenMobileNav: () => void;
}

export function GlassTopBar({ onOpenMobileNav }: GlassTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const current =
    navItems.find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
    ) ?? navItems[0];

  return (
    <header className="glass-panel glass-edge sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-black/[0.096] dark:border-white/[0.06] px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-black/[0.096] dark:hover:bg-white/[0.06] hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-[18px]" />
      </button>

      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
          {current.label}
        </h1>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          {current.description}
        </p>
      </div>

      <div className="mx-2 hidden max-w-md flex-1 items-center sm:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads, territories, tools…"
            className="h-9 border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] pl-9 text-sm placeholder:text-muted-foreground/70 focus-visible:border-accent-blue/40 focus-visible:ring-accent-blue/20"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => router.push("/leads?new=1")}
          className="hidden bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-[0_4px_20px_-6px_var(--accent-violet)] hover:opacity-90 sm:inline-flex"
        >
          <Plus className="size-4" />
          New Lead
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:bg-black/[0.096] dark:hover:bg-white/[0.06] hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)]" />
        </Button>

        <AppearanceMenu />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet/70 to-accent-blue/70 text-xs font-semibold text-white ring-1 ring-black/16 dark:ring-white/10 transition-transform hover:scale-105"
            >
              FC
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Fred Caldero</span>
                <span className="text-xs font-normal text-muted-foreground">
                  fredcaldero@gmail.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Account settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/tools">Tools Hub</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
