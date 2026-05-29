import { currencyFormatter, type AssessmentMetrics } from "@/lib/assessment";
import type { Employee } from "@/lib/types";
import { departmentColors, valueColors } from "./constants";
import type {
  LegendItem,
  MetricCardData,
  MetricsThresholds,
  ThresholdConfig,
} from "./types";

export function withAlpha(color: string, alpha: string) {
  return `${color}${alpha}`;
}

export function formatPercentage(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatMoney(value: number) {
  return currencyFormatter.format(value).replace(/\.00$/, "");
}

export function getDepartmentPalette(rows: Employee[]) {
  const palette = [
    ...new Set(rows.map((employee) => departmentColors[employee.department])),
  ];

  return palette.length > 0 ? palette : Object.values(departmentColors);
}

export function getDepartmentCounts(rows: Employee[]) {
  return rows.reduce<Record<string, number>>((counts, employee) => {
    counts[employee.department] = (counts[employee.department] ?? 0) + 1;
    return counts;
  }, {});
}

export function getDominantDepartmentColor(rows: Employee[]) {
  const counts = getDepartmentCounts(rows);
  const dominantDepartment = Object.entries(counts).sort(
    (left, right) => right[1] - left[1],
  )[0]?.[0] as keyof typeof departmentColors | undefined;

  return dominantDepartment
    ? departmentColors[dominantDepartment]
    : departmentColors.Engineering;
}

export function getValueTone(
  value: number,
  thresholds: Array<[number, string]>,
  fallback: string,
) {
  return thresholds.find(([threshold]) => value >= threshold)?.[1] ?? fallback;
}

export function clampThresholds(thresholds: ThresholdConfig) {
  const sorted = [thresholds.high, thresholds.mid, thresholds.low].sort(
    (a, b) => b - a,
  );

  return {
    high: sorted[0],
    mid: sorted[1],
    low: sorted[2],
  };
}

export function getValueThresholdLegend(
  thresholds: ThresholdConfig,
  formatter: (value: number) => string,
  labels: [string, string, string, string],
  colors: string[],
): LegendItem[] {
  return [
    { color: colors[0], label: `${labels[0]} ${formatter(thresholds.high)}` },
    {
      color: colors[1],
      label: `${formatter(thresholds.mid)} to ${formatter(thresholds.high - 0.01)}`,
    },
    {
      color: colors[2],
      label: `${formatter(thresholds.low)} to ${formatter(thresholds.mid - 0.01)}`,
    },
    { color: colors[3], label: `${labels[3]} ${formatter(thresholds.low)}` },
  ];
}

export function getMetricCards(
  metrics: AssessmentMetrics,
  rows: Employee[],
  thresholds: MetricsThresholds,
): MetricCardData[] {
  const departmentPalette = getDepartmentPalette(rows);
  const dominantDepartmentColor = getDominantDepartmentColor(rows);
  const departmentLegend = Object.entries(departmentColors).map(
    ([label, color]) => ({
      color,
      label,
    }),
  );
  const activeTone = getValueTone(
    metrics.employeeCount === 0
      ? 0
      : metrics.activeCount / metrics.employeeCount,
    [
      [thresholds.active.high, valueColors.emerald],
      [thresholds.active.mid, valueColors.cyan],
      [thresholds.active.low, valueColors.amber],
    ],
    valueColors.rose,
  );
  const ratingTone = getValueTone(
    metrics.averageRating,
    [
      [thresholds.rating.high, valueColors.violet],
      [thresholds.rating.mid, valueColors.cyan],
      [thresholds.rating.low, valueColors.amber],
    ],
    valueColors.rose,
  );
  const salaryTone = getValueTone(
    metrics.averageSalary,
    [
      [thresholds.salary.high, valueColors.violet],
      [thresholds.salary.mid, valueColors.cyan],
      [thresholds.salary.low, valueColors.amber],
    ],
    valueColors.rose,
  );
  const projectsTone = getValueTone(
    metrics.employeeCount === 0
      ? 0
      : metrics.projectsCompleted / metrics.employeeCount,
    [
      [thresholds.projects.high, valueColors.violet],
      [thresholds.projects.mid, valueColors.cyan],
      [thresholds.projects.low, valueColors.amber],
    ],
    valueColors.rose,
  );

  const cards: MetricCardData[] = [
    {
      accent: dominantDepartmentColor,
      borderColor: dominantDepartmentColor,
      chips: departmentPalette,
      glow: `${dominantDepartmentColor}18`,
      legendItems: departmentLegend,
      legendTitle: "Department colors",
      label: "Employees",
      value: String(metrics.employeeCount),
    },
    {
      accent: activeTone,
      borderColor: activeTone,
      chips: [valueColors.emerald, valueColors.cyan, valueColors.rose],
      glow: `${withAlpha(activeTone, "18")}`,
      legendItems: getValueThresholdLegend(
        thresholds.active,
        formatPercentage,
        ["At or above", "From", "From", "Below"],
        [
          valueColors.emerald,
          valueColors.cyan,
          valueColors.amber,
          valueColors.rose,
        ],
      ),
      legendTitle: "Active Ratio",
      settingsLabel: "Active Employee Ratio Thresholds",
      thresholdInputs: [
        {
          ariaLabel: "High Active Ratio Threshold",
          helper: "High Band",
          key: "high",
          max: 1,
          min: 0,
          step: 0.01,
          value: thresholds.active.high,
        },
        {
          ariaLabel: "Mid Active Ratio Threshold",
          helper: "Mid Band",
          key: "mid",
          max: 1,
          min: 0,
          step: 0.01,
          value: thresholds.active.mid,
        },
        {
          ariaLabel: "Low Active Ratio Threshold",
          helper: "Low Band",
          key: "low",
          max: 1,
          min: 0,
          step: 0.01,
          value: thresholds.active.low,
        },
      ],
      label: "Active employees",
      value: String(metrics.activeCount),
    },
    {
      accent: ratingTone,
      borderColor: ratingTone,
      chips: [valueColors.violet, valueColors.cyan, valueColors.amber],
      glow: `${withAlpha(ratingTone, "18")}`,
      legendItems: getValueThresholdLegend(
        thresholds.rating,
        (value) => value.toFixed(1),
        ["At or above", "From", "From", "Below"],
        [
          valueColors.violet,
          valueColors.cyan,
          valueColors.amber,
          valueColors.rose,
        ],
      ),
      legendTitle: "Rating Bands",
      settingsLabel: "Rating Thresholds",
      thresholdInputs: [
        {
          ariaLabel: "High Rating Threshold",
          helper: "High Band",
          key: "high",
          max: 5,
          min: 0,
          step: 0.1,
          value: thresholds.rating.high,
        },
        {
          ariaLabel: "Mid Rating Threshold",
          helper: "Mid Band",
          key: "mid",
          max: 5,
          min: 0,
          step: 0.1,
          value: thresholds.rating.mid,
        },
        {
          ariaLabel: "Low Rating Threshold",
          helper: "Low Band",
          key: "low",
          max: 5,
          min: 0,
          step: 0.1,
          value: thresholds.rating.low,
        },
      ],
      label: "Average rating",
      value: metrics.averageRating.toFixed(1),
    },
    {
      accent: salaryTone,
      borderColor: salaryTone,
      chips: [valueColors.violet, valueColors.amber, valueColors.cyan],
      glow: `${withAlpha(salaryTone, "18")}`,
      legendItems: getValueThresholdLegend(
        thresholds.salary,
        formatMoney,
        ["At or above", "From", "From", "Below"],
        [
          valueColors.violet,
          valueColors.cyan,
          valueColors.amber,
          valueColors.rose,
        ],
      ),
      legendTitle: "Salary Bands",
      settingsLabel: "Salary Thresholds",
      thresholdInputs: [
        {
          ariaLabel: "High Salary Threshold",
          helper: "High Band",
          key: "high",
          max: 200000,
          min: 0,
          step: 1000,
          value: thresholds.salary.high,
        },
        {
          ariaLabel: "Mid Salary Threshold",
          helper: "Mid Band",
          key: "mid",
          max: 200000,
          min: 0,
          step: 1000,
          value: thresholds.salary.mid,
        },
        {
          ariaLabel: "Low Salary Threshold",
          helper: "Low Band",
          key: "low",
          max: 200000,
          min: 0,
          step: 1000,
          value: thresholds.salary.low,
        },
      ],
      label: "Average salary",
      value: currencyFormatter.format(metrics.averageSalary),
    },
    {
      accent: projectsTone,
      borderColor: projectsTone,
      chips: departmentPalette.slice(0, 3),
      glow: `${withAlpha(projectsTone, "18")}`,
      legendItems: getValueThresholdLegend(
        thresholds.projects,
        (value) => value.toFixed(1),
        ["At or above", "From", "From", "Below"],
        [
          valueColors.violet,
          valueColors.cyan,
          valueColors.amber,
          valueColors.rose,
        ],
      ),
      legendTitle: "Productivity Bands",
      settingsLabel: "Projects Per Employee Thresholds",
      thresholdInputs: [
        {
          ariaLabel: "High Projects Threshold",
          helper: "High Band",
          key: "high",
          max: 20,
          min: 0,
          step: 0.5,
          value: thresholds.projects.high,
        },
        {
          ariaLabel: "Mid Projects Threshold",
          helper: "Mid Band",
          key: "mid",
          max: 20,
          min: 0,
          step: 0.5,
          value: thresholds.projects.mid,
        },
        {
          ariaLabel: "Low Projects Threshold",
          helper: "Low Band",
          key: "low",
          max: 20,
          min: 0,
          step: 0.5,
          value: thresholds.projects.low,
        },
      ],
      label: "Projects completed",
      value: String(metrics.projectsCompleted),
    },
    {
      accent:
        metrics.departmentCount <= 1
          ? departmentPalette[0]
          : metrics.departmentCount === 2
            ? `${departmentPalette[0]}`
            : (departmentPalette[2] ??
              departmentPalette[1] ??
              departmentPalette[0]),
      chips: departmentPalette.slice(0, Math.max(1, metrics.departmentCount)),
      glow: `${departmentPalette[departmentPalette.length - 1]}18`,
      legendItems: departmentLegend.slice(0, 3),
      legendTitle: "Departments In View",
      settingsLabel: "Department Color Mix",
      label: "Departments",
      value: String(metrics.departmentCount),
      borderColor: "",
    },
  ];

  return cards;
}
