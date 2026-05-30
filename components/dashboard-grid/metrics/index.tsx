"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { MetricCard } from "./metric-card";
import { defaultThresholds } from "./constants";
import { clampThresholds, getMetricCards } from "./utils";
import type { MetricsSummaryProps, MetricsThresholds } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MetricsSummary({
  metrics,
  rows,
  showLegends,
  showSettings,
}: MetricsSummaryProps) {
  const [thresholds, setThresholds] =
    useState<MetricsThresholds>(defaultThresholds);
  const cards = useMemo(
    () => getMetricCards(metrics, rows, thresholds),
    [metrics, rows, thresholds],
  );

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm font-medium text-muted-foreground">Metrics</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info
              className="size-3.5 text-muted-foreground/60 cursor-help hover:text-muted-foreground transition-colors"
              aria-label="Metrics info"
            />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-80">
            Metrics reflect the <strong>toolbar filters</strong> &nbsp; (department &amp;
            search) only: column filters applied inside the grid are not
            included.
          </TooltipContent>
        </Tooltip>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <MetricCard
            key={card.label}
            showLegends={showLegends}
            showSettings={showSettings}
            onThresholdChange={(key, value) => {
              if (!card.thresholdInputs) return;

              setThresholds((current) => {
                const next = { ...current };
                const metricKey =
                  card.label === "Active employees"
                    ? "active"
                    : card.label === "Average rating"
                      ? "rating"
                      : card.label === "Average salary"
                        ? "salary"
                        : "projects";

                next[metricKey] = clampThresholds({
                  ...next[metricKey],
                  [key]: value,
                });

                return next;
              });
            }}
            {...card}
          />
        ))}
      </section>
    </TooltipProvider>
  );
}
