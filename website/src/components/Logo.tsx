import { SparkIcon } from "./icons";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}>
      <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-gold">
        <SparkIcon className="h-4 w-4" />
      </span>
      <span className="text-foreground">
        Origin <span className="text-muted font-normal">Visibility</span>
      </span>
    </span>
  );
}
