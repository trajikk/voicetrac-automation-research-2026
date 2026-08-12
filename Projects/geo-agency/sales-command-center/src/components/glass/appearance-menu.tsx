"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { useAppearance } from "@/components/theme/appearance-provider";
import { fontFamilyOptions, fontSizeOptions } from "@/lib/appearance";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Auto", icon: Monitor },
] as const;

export function AppearanceMenu() {
  const { theme, setTheme } = useTheme();
  const { fontFamily, fontSize, setFontFamily, setFontSize } = useAppearance();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-black/[0.096] dark:hover:bg-white/[0.06] hover:text-foreground"
          aria-label="Appearance settings"
        >
          <Palette className="size-[18px]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="glass-panel-strong glass-edge w-80 border-black/[0.144] dark:border-white/[0.09] p-5"
      >
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Theme
        </p>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-200",
                  active
                    ? "border-accent-blue/30 bg-accent-blue/12 text-accent-blue shadow-[0_0_14px_-4px_var(--accent-blue)]"
                    : "border-black/[0.128] dark:border-white/[0.08] bg-black/[0.032] dark:bg-white/[0.02] text-muted-foreground hover:border-black/[0.224] dark:hover:border-white/[0.14] hover:bg-black/[0.08] dark:hover:bg-white/[0.05] hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {opt.label}
              </button>
            );
          })}
        </div>

        <p className="mt-5 mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Font Family
        </p>
        <div className="grid grid-cols-2 gap-2">
          {fontFamilyOptions.map((opt) => {
            const active = fontFamily === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFontFamily(opt.value)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                  active
                    ? "border-accent-violet/30 bg-accent-violet/12 shadow-[0_0_14px_-4px_var(--accent-violet)]"
                    : "border-black/[0.128] dark:border-white/[0.08] bg-black/[0.032] dark:bg-white/[0.02] hover:border-black/[0.224] dark:hover:border-white/[0.14] hover:bg-black/[0.08] dark:hover:bg-white/[0.05]",
                )}
                data-font-preview={opt.value}
              >
                <span
                  className={cn(
                    "text-base font-semibold",
                    active ? "text-accent-violet" : "text-foreground/80",
                  )}
                  style={{
                    fontFamily:
                      opt.value === "jakarta"
                        ? "var(--font-jakarta)"
                        : opt.value === "inter"
                          ? "var(--font-inter)"
                          : opt.value === "geist"
                            ? "var(--font-geist)"
                            : "var(--font-manrope)",
                  }}
                >
                  {opt.preview}
                </span>
                <span
                  className={cn(
                    "truncate text-xs",
                    active ? "text-accent-violet/90" : "text-muted-foreground",
                  )}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Font Size
        </p>
        <div className="grid grid-cols-4 gap-2">
          {fontSizeOptions.map((opt) => {
            const active = fontSize === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFontSize(opt.value)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "border-accent-cyan/30 bg-accent-cyan/12 text-accent-cyan shadow-[0_0_14px_-4px_var(--accent-cyan)]"
                    : "border-black/[0.128] dark:border-white/[0.08] bg-black/[0.032] dark:bg-white/[0.02] text-muted-foreground hover:border-black/[0.224] dark:hover:border-white/[0.14] hover:bg-black/[0.08] dark:hover:bg-white/[0.05] hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
