
import type { Grade } from "./types";

export function getRenderGrade(ms: number): Grade {
  if (ms < 50) return { label: "Excellent", tw: "text-cyan-400" };
  if (ms < 150) return { label: "Good", tw: "text-green-400" };
  if (ms < 400) return { label: "Fair", tw: "text-yellow-400" };
  return { label: "Slow", tw: "text-red-400" };
}

export function getLoadGrade(ms: number): Grade {
  if (ms < 150) return { label: "Instant", tw: "text-cyan-400" };
  if (ms < 600) return { label: "Fast", tw: "text-green-400" };
  if (ms < 1800) return { label: "Fair", tw: "text-yellow-400" };
  return { label: "Slow", tw: "text-red-400" };
}

export function getFpsGrade(fps: number): Grade {
  if (fps >= 55) return { label: "Smooth", tw: "text-cyan-400" };
  if (fps >= 30) return { label: "Moderate", tw: "text-yellow-400" };
  return { label: "Choppy", tw: "text-red-400" };
}

export function getScaleLabel(scale: number): string {
  if (scale >= 1000000) return "Mega stress test";
  if (scale >= 100000) return "Extreme stress test";
  if (scale >= 5000) return "Stress test territory";
  if (scale >= 1000) return "Production scale";
  return "Baseline";
}
