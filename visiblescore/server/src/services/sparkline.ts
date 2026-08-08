export function buildDualLineSvg(
  data: Array<{ date: string; sessions: number; aiSessions: number }>,
  opts: { width?: number; height?: number } = {}
): string {
  const width = opts.width ?? 640;
  const height = opts.height ?? 200;
  const pad = 24;
  if (data.length === 0) return `<svg width="${width}" height="${height}"></svg>`;

  const maxSessions = Math.max(...data.map((d) => d.sessions), 1);
  const xStep = (width - pad * 2) / Math.max(1, data.length - 1);
  const yFor = (v: number) => height - pad - (v / maxSessions) * (height - pad * 2);
  const xFor = (i: number) => pad + i * xStep;

  const toPath = (key: "sessions" | "aiSessions") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)},${yFor(d[key]).toFixed(1)}`).join(" ");

  const totalPath = toPath("sessions");
  const aiPath = toPath("aiSessions");
  const areaPath = `${totalPath} L${xFor(data.length - 1).toFixed(1)},${(height - pad).toFixed(1)} L${pad},${(
    height - pad
  ).toFixed(1)} Z`;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6d5ff5" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#6d5ff5" stop-opacity="0" />
    </linearGradient>
  </defs>
  <path d="${areaPath}" fill="url(#areaFill)" />
  <path d="${totalPath}" fill="none" stroke="#6d5ff5" stroke-width="2.5" />
  <path d="${aiPath}" fill="none" stroke="#22b8cf" stroke-width="2.5" stroke-dasharray="4 3" />
  <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="#e2e2f0" stroke-width="1" />
</svg>`.trim();
}
