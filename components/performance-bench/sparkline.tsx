export function Sparkline({ values, stroke }: { values: number[]; stroke: string }) {
  if (values.length < 2) return null;
  const W = 80;
  const H = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 2) - 1;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={W} height={H} aria-hidden className="opacity-60">
      <polyline
        fill="none"
        points={pts}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
