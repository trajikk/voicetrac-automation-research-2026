export function ScoreRing({ score, size = 72, strokeWidth = 8 }: { score: number | null; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = score === null ? 0 : Math.max(0, Math.min(100, score));
  const dash = (pct / 100) * circumference;

  return (
    <div className="score-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4b3ff0" />
            <stop offset="100%" stopColor="#c17ce0" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f0fa" strokeWidth={strokeWidth} />
        {score !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </svg>
      <div className="score-ring-value" style={{ fontSize: size * 0.26 }}>
        {score === null ? <span style={{ fontSize: "0.5em", color: "var(--muted-2)", fontWeight: 600 }}>—</span> : <>{score}<span className="unit">%</span></>}
      </div>
    </div>
  );
}
