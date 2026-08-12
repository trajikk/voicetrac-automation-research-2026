import Link from "next/link";
import { ArrowLeft, Construction, type LucideIcon } from "lucide-react";
import { getAccent, type Accent } from "@/lib/accent";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolPlaceholderProps {
  name: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
  status: "active" | "coming-soon";
}

export function ToolPlaceholder({
  name,
  description,
  icon: Icon,
  accent,
  status,
}: ToolPlaceholderProps) {
  const accentClasses = getAccent(accent);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit text-muted-foreground hover:bg-black/[0.096] dark:hover:bg-white/[0.06] hover:text-foreground"
      >
        <Link href="/tools">
          <ArrowLeft className="size-3.5" />
          Back to Tools Hub
        </Link>
      </Button>

      <GlassCard strong className="relative overflow-hidden py-14 text-center">
        <div
          className={cn(
            "pointer-events-none absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br opacity-40 blur-3xl",
            accentClasses.gradient,
          )}
        />
        <div className="relative flex flex-col items-center">
          <div
            className={cn(
              "mb-5 flex size-14 items-center justify-center rounded-2xl",
              accentClasses.bgSoft,
              accentClasses.text,
            )}
          >
            <Icon className="size-6" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{name}</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>

          <div className="mt-6 flex items-center gap-2 rounded-full border border-black/[0.128] dark:border-white/[0.08] bg-black/[0.048] dark:bg-white/[0.03] px-4 py-1.5 text-xs text-muted-foreground">
            <Construction className="size-3.5" />
            {status === "active" ? "Interactive workspace in development" : "Coming soon"}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
