import { Sparkline } from "./sparkline";

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
  sparklineValues?: number[];
  sparklineStroke?: string;
};

export function MetricCard({
  icon,
  label,
  value,
  sub,
  sparklineValues,
  sparklineStroke,
}: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1 p-4 border-r border-border last:border-r-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon}
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight tabular-nums leading-none">
        {value}
      </div>
      {sparklineValues && sparklineStroke && (
        <Sparkline stroke={sparklineStroke} values={sparklineValues} />
      )}
      {sub}
    </div>
  );
}
