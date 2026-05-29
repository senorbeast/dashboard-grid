"use client";

import { useMemo, useState } from "react";
import { MetricCard } from "./metric-card";
import { defaultThresholds } from "./constants";
import { clampThresholds, getMetricCards } from "./utils";
import type { MetricsSummaryProps, MetricsThresholds } from "./types";

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
  );
}
