import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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
              {legendItems.map((item, index) => (
                <div key={item.color || index} className="flex items-center gap-2">
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
              <div className="mt-6 mb-2 px-2">
                <Slider
                  min={thresholdInputs[0].min}
                  max={thresholdInputs[0].max}
                  step={thresholdInputs[0].step}
                  minStepsBetweenThumbs={1}
                  trackColors={
                    legendItems.length === 4
                      ? [
                          legendItems[3].color,
                          legendItems[2].color,
                          legendItems[1].color,
                          legendItems[0].color,
                        ]
                      : undefined
                  }
                  value={[
                    thresholdInputs[2].value, // low
                    thresholdInputs[1].value, // mid
                    thresholdInputs[0].value, // high
                  ]}
                  onValueChange={(values) => {
                    // Update all three when the slider changes
                    onThresholdChange("low", values[0]);
                    onThresholdChange("mid", values[1]);
                    onThresholdChange("high", values[2]);
                  }}
                  className="py-2"
                />
                <div className="mt-4 flex justify-between text-[11px] text-muted-foreground">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-foreground">{thresholdInputs[2].value}</span>
                    <span>Low</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-foreground">{thresholdInputs[1].value}</span>
                    <span>Mid</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-foreground">{thresholdInputs[0].value}</span>
                    <span>High</span>
                  </div>
                </div>
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
