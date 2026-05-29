"use client";

import { Activity, ChevronRight, Clock, Cpu, Rows3, Zap } from "lucide-react";
import { SCALE_LABELS, SCALE_OPTIONS, type ScaleOption } from "@/lib/mock-data-generator";
import type { PerfSnapshot } from "@/hooks/use-performance-bench";

// ---------------------------------------------------------------------------
// Panel props – only presentational; all state lives in the hook
// ---------------------------------------------------------------------------

export type BenchPanelProps = {
  currentScale: ScaleOption;
  history: PerfSnapshot[];
  isPending: boolean;
  liveFps: number | null;
  onScaleChange: (scale: ScaleOption) => void;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Grade = { label: string; tw: string };

function getRenderGrade(ms: number): Grade {
  if (ms < 50) return { label: "Excellent", tw: "text-cyan-400" };
  if (ms < 150) return { label: "Good", tw: "text-green-400" };
  if (ms < 400) return { label: "Fair", tw: "text-yellow-400" };
  return { label: "Slow", tw: "text-red-400" };
}

function getLoadGrade(ms: number): Grade {
  if (ms < 150) return { label: "Instant", tw: "text-cyan-400" };
  if (ms < 600) return { label: "Fast", tw: "text-green-400" };
  if (ms < 1800) return { label: "Fair", tw: "text-yellow-400" };
  return { label: "Slow", tw: "text-red-400" };
}

function getFpsGrade(fps: number): Grade {
  if (fps >= 55) return { label: "Smooth", tw: "text-cyan-400" };
  if (fps >= 30) return { label: "Moderate", tw: "text-yellow-400" };
  return { label: "Choppy", tw: "text-red-400" };
}

function getScaleLabel(scale: ScaleOption): string {
  if (scale >= 1000000) return "Mega stress test";
  if (scale >= 100000) return "Extreme stress test";
  if (scale >= 5000) return "Stress test territory";
  if (scale >= 1000) return "Production scale";
  return "Baseline";
}

// ---------------------------------------------------------------------------
// Inline SVG sparkline – pure UI, no measurement logic
// ---------------------------------------------------------------------------

function Sparkline({ values, stroke }: { values: number[]; stroke: string }) {
  if (values.length < 2) return null;
  const W = 80;
  const H = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 2) - 1;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={W} height={H} aria-hidden className="opacity-60">
      <polyline
        fill="none"
        points={pts}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// History row
// ---------------------------------------------------------------------------

function HistoryRow({ snap, index }: { snap: PerfSnapshot; index: number }) {
  const renderGrade = getRenderGrade(snap.renderMs);
  const loadGrade = getLoadGrade(snap.totalLoadMs);
  const fpsGrade = snap.fps != null ? getFpsGrade(snap.fps) : null;
  const isEven = index % 2 === 0;

  return (
    <tr className={isEven ? "bg-muted/30" : ""}>
      <td className="px-3 py-2 text-xs text-foreground/80 font-medium">
        {SCALE_LABELS[snap.scale]} rows
      </td>
      <td className="px-3 py-2 text-xs text-right tabular-nums font-mono">
        {snap.renderMs.toFixed(1)} ms
      </td>
      <td className="px-3 py-2 text-xs text-right tabular-nums font-mono">
        {snap.totalLoadMs.toFixed(1)} ms
      </td>
      <td className="px-3 py-2 text-xs text-right tabular-nums font-mono">
        {snap.fps != null ? `${snap.fps} fps` : "—"}
      </td>
      <td className="px-3 py-2">
        <span className={`text-[0.65rem] font-bold uppercase tracking-wide ${renderGrade.tw}`}>
          {renderGrade.label}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className={`text-[0.65rem] font-bold uppercase tracking-wide ${loadGrade.tw}`}>
          {loadGrade.label}
        </span>
      </td>
      <td className="px-3 py-2">
        {fpsGrade && (
          <span className={`text-[0.65rem] font-bold uppercase tracking-wide ${fpsGrade.tw}`}>
            {fpsGrade.label}
          </span>
        )}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Metric card
// ---------------------------------------------------------------------------

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
  sparklineValues?: number[];
  sparklineStroke?: string;
};

function MetricCard({
  icon,
  label,
  value,
  sub,
  sparklineValues,
  sparklineStroke,
}: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1 p-4 border-r border-border last:border-r-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        {icon}
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight tabular-nums leading-none">
        {value}
      </div>
      {sparklineValues && sparklineStroke && (
        <Sparkline stroke={sparklineStroke} values={sparklineValues} />
      )}
      {sub}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel component – purely presentational
// ---------------------------------------------------------------------------

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
            return (
              <button
                key={scale}
                aria-pressed={active}
                id={`bench-scale-${scale}`}
                onClick={() => onScaleChange(scale)}
                className={[
                  "px-3.5 py-1 rounded-full border text-[0.8125rem] font-medium transition-all duration-150 leading-none",
                  active
                    ? [
                        "bg-primary border-primary text-primary-foreground",
                        "shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
                        isPending ? "animate-pulse" : "",
                      ].join(" ")
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
