import type { AssessmentMetrics } from "@/lib/assessment";
import type { Employee } from "@/lib/types";

export type MetricsSummaryProps = {
  metrics: AssessmentMetrics;
  rows: Employee[];
  showLegends: boolean;
  showSettings: boolean;
};

export type LegendItem = {
  color: string;
  label: string;
};

export type MetricCardData = {
  borderColor: string;
  accent: string;
  chips: string[];
  glow: string;
  label: string;
  legendTitle: string;
  legendItems: LegendItem[];
  settingsLabel?: string;
  thresholdInputs?: ThresholdInput[];
  value: string;
};

export type ThresholdInput = {
  ariaLabel: string;
  helper: string;
  key: string;
  max?: number;
  min?: number;
  step?: number;
  value: number;
};

export type ThresholdConfig = {
  high: number;
  low: number;
  mid: number;
};

export type MetricsThresholds = {
  active: ThresholdConfig;
  rating: ThresholdConfig;
  salary: ThresholdConfig;
  projects: ThresholdConfig;
};
