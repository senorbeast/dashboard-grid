import { SCALE_LABELS } from "@/lib/mock-data-generator";
import type { PerfSnapshot } from "@/hooks/use-performance-bench";
import { getRenderGrade, getLoadGrade, getFpsGrade } from "./grade-utils";

export function HistoryRow({ snap, index }: { snap: PerfSnapshot; index: number }) {
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
