"use client";

import { Activity, ChevronRight, Clock, Cpu, Rows3, Zap } from "lucide-react";
import { SCALE_LABELS, SCALE_OPTIONS } from "@/lib/mock-data-generator";
import { getRenderGrade, getLoadGrade, getFpsGrade, getScaleLabel } from "./grade-utils";
import { MetricCard } from "./metric-card";
import { HistoryRow } from "./history-row";

import type { BenchPanelProps } from "./types";

export type { BenchPanelProps } from "./types";

export function PerformanceBenchPanel({
  currentScale,
  history,
  isPending,
  liveFps,
  onScaleChange,  
}: BenchPanelProps) {
  const last = history[history.length - 1] ?? null;
  const renderGrade = last ? getRenderGrade(last.renderMs) : null;
  const loadGrade = last ? getLoadGrade(last.totalLoadMs) : null;
  const fpsGrade = last?.fps != null ? getFpsGrade(last.fps) : null;

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground overflow-hidden text-sm shadow-sm">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-border bg-gradient-to-r from-primary/5 to-card">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold text-[0.9375rem] tracking-tight">
            Performance Bench
          </span>
          {isPending && (
            <span
              aria-label="Loading"
              className="inline-block w-3.5 h-3.5 rounded-full border-2 border-primary/25 border-t-primary animate-spin"
            />
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Render time via React{" "}
          <code className="bg-muted px-1 rounded text-[0.7rem]">&lt;Profiler&gt;</code>
          {" · "}FPS via{" "}
          <code className="bg-muted px-1 rounded text-[0.7rem]">react-fps</code>
        </span>
      </div>

      {/* ── Scale selector ── */}
      <div className="px-5 py-3.5 border-b border-border">
        <p className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
          <Rows3 className="w-3.5 h-3.5" />
          Row count
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Row count selector">
          {SCALE_OPTIONS.map((scale) => {
            const active = scale === currentScale;
            const isDanger = scale === 5000000;
            return (
              <button
                key={scale}
                aria-pressed={active}
                id={`bench-scale-${scale}`}
                onClick={() => onScaleChange(scale)}
                title={isDanger ? "Crash ahead!" : undefined}
                className={[
                  "px-3.5 py-1 rounded-full border text-[0.8125rem] font-medium transition-all duration-150 leading-none",
                  active
                    ? isDanger
                      ? [
                          "bg-red-600 border-red-600 text-white",
                          "shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-red-600)_20%,transparent)]",
                          isPending ? "animate-pulse" : "",
                        ].join(" ")
                      : [
                          "bg-primary border-primary text-primary-foreground",
                          "shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
                          isPending ? "animate-pulse" : "",
                        ].join(" ")
                    : isDanger
                      ? "bg-red-500/10 border-red-500/30 text-red-500 hover:border-red-500 hover:text-red-500 hover:bg-red-500/20"
                      : "bg-muted border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5",
                ].join(" ")}
              >
                {SCALE_LABELS[scale]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Metrics strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
        <MetricCard
          icon={<Clock className="w-3.5 h-3.5 text-indigo-400" />}
          label="Render time"
          value={last ? `${last.renderMs.toFixed(1)} ms` : "—"}
          sparklineValues={history.map((s) => s.renderMs)}
          sparklineStroke="#818cf8"
          sub={
            renderGrade && (
              <span className={`text-[0.65rem] font-bold uppercase tracking-wide ${renderGrade.tw}`}>
                {renderGrade.label}
              </span>
            )
          }
        />

        <MetricCard
          icon={<Zap className="w-3.5 h-3.5 text-pink-400" />}
          label="Total load time"
          value={last ? `${last.totalLoadMs.toFixed(1)} ms` : "—"}
          sparklineValues={history.map((s) => s.totalLoadMs)}
          sparklineStroke="#ec4899"
          sub={
            <div className="flex flex-col">
              {loadGrade && (
                <span className={`text-[0.65rem] font-bold uppercase tracking-wide ${loadGrade.tw}`}>
                  {loadGrade.label}
                </span>
              )}
              <span className="text-[0.65rem] text-muted-foreground mt-0.5 leading-tight">
                ( Time taken by AG Grid to render )
              </span>
            </div>
          }
        />

        <MetricCard
          icon={<Activity className="w-3.5 h-3.5 text-emerald-400" />}
          label="Frame rate"
          value={liveFps != null ? `${liveFps} fps` : "—"}
          sparklineValues={history.flatMap((s) => (s.fps != null ? [s.fps] : []))}
          sparklineStroke="#34d399"
          sub={
            fpsGrade && (
              <span className={`text-[0.65rem] font-bold uppercase tracking-wide ${fpsGrade.tw}`}>
                {fpsGrade.label}
              </span>
            )
          }
        />

        <MetricCard
          icon={<Cpu className="w-3.5 h-3.5 text-orange-400" />}
          label="Active rows"
          value={currentScale.toLocaleString()}
          sub={
            <span className="text-[0.7rem] text-muted-foreground mt-0.5">
              {getScaleLabel(currentScale)}
            </span>
          }
        />
      </div>

      {/* ── History table ── */}
      {history.length > 0 && (
        <div className="px-5 py-3.5">
          <p className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground mb-2.5">
            <ChevronRight className="w-3.5 h-3.5" />
            Run history
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-[0.8125rem] border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    Scale
                  </th>
                  <th className="px-3 py-2 text-right text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    Render
                  </th>
                  <th className="px-3 py-2 text-right text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    Total Load
                  </th>
                  <th className="px-3 py-2 text-right text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    FPS
                  </th>
                  <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    Render Grade
                  </th>
                  <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    Load Grade
                  </th>
                  <th className="px-3 py-2 text-left text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                    FPS Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...history]
                  .reverse()
                  .map((snap, i) => (
                    <HistoryRow key={`${snap.scale}-${i}`} snap={snap} index={i} />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
