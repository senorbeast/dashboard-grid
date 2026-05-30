import type { ScaleOption } from "@/lib/mock-data-generator";
import type { PerfSnapshot } from "@/hooks/use-performance-bench";

export type BenchPanelProps = {
  currentScale: ScaleOption;
  history: PerfSnapshot[];
  isPending: boolean;
  liveFps: number | null;
  onScaleChange: (scale: ScaleOption) => void;
};

export type Grade = { label: string; tw: string };
