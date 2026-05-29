import type { MetricsThresholds } from "./types";

export const departmentColors = {
  Engineering: "#38bdf8",
  Marketing: "#c084fc",
  Sales: "#fb923c",
  HR: "#fb7185",
  Finance: "#34d399",
} as const;

export const valueColors = {
  amber: "#f59e0b",
  cyan: "#06b6d4",
  emerald: "#10b981",
  rose: "#f43f5e",
  violet: "#8b5cf6",
} as const;

export const defaultThresholds: MetricsThresholds = {
  active: { high: 0.85, low: 0.4, mid: 0.65 },
  projects: { high: 8, low: 4, mid: 6 },
  rating: { high: 4.6, low: 3.8, mid: 4.2 },
  salary: { high: 115000, low: 80000, mid: 95000 },
};
