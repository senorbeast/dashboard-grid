import { Card, CardContent } from "@/components/ui/card";
import { withAlpha } from "./utils";
import type { LegendItem, ThresholdInput } from "./types";

export function MetricCard({
  accent,
  glow,
  label,
  legendItems,
  legendTitle,
  onThresholdChange,
  settingsLabel,
  showLegends,
  showSettings,
  thresholdInputs,
  value,
}: {
  accent: string;
  chips: string[];
  glow: string;
  label: string;
  legendItems: LegendItem[];
  legendTitle: string;
  onThresholdChange: (key: string, value: number) => void;
  settingsLabel?: string;
  showLegends: boolean;
  showSettings: boolean;
  thresholdInputs?: ThresholdInput[];
  value: string;
}) {
  return (
    <Card className="relative overflow-hidden border-border/80">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: `radial-gradient(circle at top right, ${glow} 0%, transparent 58%), linear-gradient(135deg, ${withAlpha(accent, "12")} 0%, transparent 72%)`,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      <CardContent className="relative pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium" style={{ color: accent }}>
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-normal text-card-foreground">
              {value}
            </p>
          </div>
        </div>
        {showLegends && (
          <div className="mt-4 border-t border-border/70 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {legendTitle}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-black/5"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {showSettings && (
          <div className="mt-4 rounded-md border border-border bg-muted/40 p-3">
            <p className="text-xs font-medium text-card-foreground">
              {settingsLabel ?? "Card settings"}
            </p>
            {thresholdInputs ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {thresholdInputs.map((input) => (
                  <label
                    key={input.key}
                    className="flex flex-col gap-1.5 text-xs text-muted-foreground"
                  >
                    <span>{input.helper}</span>
                    <input
                      aria-label={input.ariaLabel}
                      className="h-9 rounded-md border border-border bg-card px-2 text-sm text-card-foreground outline-none ring-0 focus:border-ring"
                      max={input.max}
                      min={input.min}
                      step={input.step}
                      type="number"
                      value={input.value}
                      onChange={(event) =>
                        onThresholdChange(input.key, Number(event.target.value))
                      }
                    />
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                This card follows the majority department color from the visible
                rows.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
