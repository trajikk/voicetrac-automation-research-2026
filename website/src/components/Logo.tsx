export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-ember" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
      <span className="font-display text-xl tracking-tight text-foreground">Origin</span>
    </span>
  );
}
