import {
  Phone,
  Mail,
  Calendar,
  StickyNote,
  ArrowRightLeft,
  MapPinned,
  FileSignature,
} from "lucide-react";
import type { ActivityItem, ActivityType } from "@/lib/types";
import type { Accent } from "@/lib/accent";
import { getAccent } from "@/lib/accent";
import { formatRelativeDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const typeMeta: Record<ActivityType, { icon: React.ComponentType<{ className?: string }>; accent: Accent }> = {
  call: { icon: Phone, accent: "blue" },
  email: { icon: Mail, accent: "cyan" },
  demo: { icon: Calendar, accent: "violet" },
  note: { icon: StickyNote, accent: "amber" },
  status: { icon: ArrowRightLeft, accent: "emerald" },
  territory: { icon: MapPinned, accent: "rose" },
  contract: { icon: FileSignature, accent: "emerald" },
};

export function ActivityRow({ item }: { item: ActivityItem }) {
  const meta = typeMeta[item.type];
  const accent = getAccent(meta.accent);
  const Icon = meta.icon;

  return (
    <div className="flex items-start gap-3.5 py-3">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          accent.bgSoft,
          accent.text,
        )}
      >
        <Icon className="size-[15px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-foreground/90">{item.title}</p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatRelativeDate(item.timestamp)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.description}</p>
        {item.leadCompany && (
          <span className="mt-1.5 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] text-muted-foreground">
            {item.leadCompany}
          </span>
        )}
      </div>
    </div>
  );
}
