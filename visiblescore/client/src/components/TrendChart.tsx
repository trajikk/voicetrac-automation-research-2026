export interface TrendPoint {
  date: string;
  score: number;
}

export function TrendChart({
  points,
  variant = "full",
  height = 160,
}: {
  points: TrendPoint[];
  variant?: "mini" | "full";
  height?: number;
}) {
  if (points.length === 0) {
    return variant === "full" ? <div className="trend-empty">No reports yet — generate one to start tracking trend.</div> : null;
  }
  if (points.length === 1) {
    return variant === "full" ? (
      <div className="trend-empty">Only one report so far — the trend line appears after your next report.</div>
    ) : null;
  }

  const pad = variant === "mini" ? 4 : 22;
  const vbWidth = variant === "mini" ? 200 : 640;
  const vbHeight = height;

  const scores = points.map((p) => p.score);
  const min = Math.min(...scores, 0);
  const max = Math.max(...scores, 100);
  const range = max - min || 1;

  const xStep = (vbWidth - pad * 2) / Math.max(1, points.length - 1);
  const xFor = (i: number) => pad + i * xStep;
  const yFor = (v: number) => vbHeight - pad - ((v - min) / range) * (vbHeight - pad * 2);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)},${yFor(p.score).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${xFor(points.length - 1).toFixed(1)},${(vbHeight - pad).toFixed(1)} L${pad},${(vbHeight - pad).toFixed(1)} Z`;

  const first = points[0].score;
  const last = points[points.length - 1].score;
  const delta = last - first;

  return (
    <div className="trend-chart-wrap">
      <svg width="100%" height={height} viewBox={`0 0 ${vbWidth} ${vbHeight}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`trendFill-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d5ff5" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6d5ff5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#trendFill-${variant})`} />
        <path d={linePath} fill="none" stroke="#6d5ff5" strokeWidth={variant === "mini" ? 2 : 2.5} />
        {variant === "full" &&
          points.map((p, i) => <circle key={i} cx={xFor(i)} cy={yFor(p.score)} r={3} fill="#4b3ff0" />)}
        {variant === "full" && (
          <line x1={pad} y1={vbHeight - pad} x2={vbWidth - pad} y2={vbHeight - pad} stroke="#ececf7" strokeWidth="1" />
        )}
      </svg>
      {variant === "full" && (
        <div className="trend-chart-legend">
          <span>{points.length} reports</span>
          <span style={{ color: delta > 0 ? "#197a37" : delta < 0 ? "#a12a2a" : "var(--muted)", fontWeight: 700 }}>
            {delta > 0 ? "▲" : delta < 0 ? "▼" : "–"} {Math.abs(delta)} pts since first report
          </span>
        </div>
      )}
    </div>
  );
}
