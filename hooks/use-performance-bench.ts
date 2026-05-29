"use client";

/**
 * usePerformanceBench
 *
 * Abstracts all performance-measurement state so page.tsx stays clean.
 *
 * Render timing  → React's built-in <Profiler> API (ProfilerOnRenderCallback)
 * FPS            → useFps() from the "react-fps" package
 */

import { useCallback, useRef, useState, useTransition } from "react";
import { useFps } from "react-fps";
import { generateEmployees, type ScaleOption } from "@/lib/mock-data-generator";
import type { Employee } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PerfSnapshot = {
  scale: ScaleOption;
  /** React's own actualDuration for the update phase (ms) */
  renderMs: number;
  /** Average FPS sampled at measurement time */
  fps: number | null;
  /** Total Load Time (ms) including generation and commit */
  totalLoadMs: number;
};

export type UsePerformanceBenchReturn = {
  /** The active scale selection */
  scale: ScaleOption;
  /** The Employee[] array for the current scale */
  rows: Employee[];
  /** Whether the data transition is still in progress */
  isPending: boolean;
  /** All snapshots captured so far */
  history: PerfSnapshot[];
  /** The live current FPS (null until first reading) */
  liveFps: number | null;
  /** Call this to switch scale and begin a measurement */
  handleScaleChange: (scale: ScaleOption) => void;
  /**
   * Pass this directly to React's <Profiler onRender={...}>.
   * It records a snapshot when the "update" phase fires after a scale change.
   */
  onProfilerRender: (
    id: string,
    phase: "mount" | "update" | "nested-update",
    actualDuration: number,
  ) => void;
  /**
   * Called when AG Grid completes loading and rendering the new rows.
   */
  onGridRenderComplete: () => void;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePerformanceBench(): UsePerformanceBenchReturn {
  const [scale, setScale] = useState<ScaleOption>(20);
  const [rows, setRows] = useState<Employee[]>(() => generateEmployees(20));
  const [history, setHistory] = useState<PerfSnapshot[]>([]);
  const [isPending, startTransition] = useTransition();

  // react-fps: continuously tracks frame cadence via rAF.
  // currentFps is the most recent 1-second window reading (typed as number).
  const { currentFps } = useFps(30);

  // We only record a snapshot when a scale-change is "in flight".
  const pendingScaleRef = useRef<ScaleOption | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const reactRenderMsRef = useRef<number>(0);

  // ── Trigger a scale change ──────────────────────────────────────────────
  const handleScaleChange = useCallback((newScale: ScaleOption) => {
    pendingScaleRef.current = newScale;
    startTimeRef.current = performance.now();
    reactRenderMsRef.current = 0; // reset
    setScale(newScale);
    startTransition(() => {
      setRows(generateEmployees(newScale));
    });
  }, []);

  // ── React <Profiler> callback ───────────────────────────────────────────
  // Called by React after every render of the profiled subtree.
  // We capture it only when a scale change has been triggered (pendingScaleRef set)
  // and only on the "update" phase (not initial mount).
  const onProfilerRender = useCallback(
    (
      _id: string,
      phase: "mount" | "update" | "nested-update",
      actualDuration: number,
    ) => {
      if (phase === "mount" || pendingScaleRef.current === null) return;
      reactRenderMsRef.current = actualDuration;
    },
    [],
  );

  // ── AG Grid Render Completion callback ──────────────────────────────────
  const onGridRenderComplete = useCallback(() => {
    if (pendingScaleRef.current === null || startTimeRef.current === null) return;

    const totalLoadMs = performance.now() - startTimeRef.current;
    const renderMs = reactRenderMsRef.current;

    const snap: PerfSnapshot = {
      scale: pendingScaleRef.current,
      renderMs: Math.round(renderMs * 10) / 10,
      fps: currentFps > 0 ? Math.round(currentFps) : null,
      totalLoadMs: Math.round(totalLoadMs * 10) / 10,
    };

    pendingScaleRef.current = null;
    startTimeRef.current = null;
    reactRenderMsRef.current = 0;
    setHistory((prev) => [...prev, snap]);
  }, [currentFps]);

  const liveFps = currentFps > 0 ? Math.round(currentFps) : null;

  return {
    scale,
    rows,
    isPending,
    history,
    liveFps,
    handleScaleChange,
    onProfilerRender,
    onGridRenderComplete,
  };
}
