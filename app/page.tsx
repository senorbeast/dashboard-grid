"use client";

import { Profiler, useState } from "react";
import { Activity, BarChart3, Layers, Settings } from "lucide-react";
import { DashboardGrid } from "@/components/dashboard-grid";
import { PerformanceBenchPanel } from "@/components/performance-bench";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePerformanceBench } from "@/hooks/use-performance-bench";

export default function Home() {
  const [showMetrics, setShowMetrics] = useState(true);
  const [showLegends, setShowLegends] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showBench, setShowBench] = useState(false);

  const {
    scale,
    rows,
    isPending,
    history,
    liveFps,
    handleScaleChange,
    onProfilerRender,
    onGridRenderComplete,
  } = usePerformanceBench();

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">

        <header className="flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal text-foreground">
              Employee Assessment Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-md border border-border bg-muted p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-pressed={showMetrics}
                    className="h-10 w-12 p-0"
                    variant={showMetrics ? "secondary" : "ghost"}
                    onClick={() => setShowMetrics(!showMetrics)}
                  >
                    <BarChart3 className="h-6 w-6 pointer-events-none" />
                    <span className="sr-only">Toggle Metrics</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Metrics</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-pressed={showLegends}
                    className="h-10 w-12 p-0"
                    variant={showLegends ? "secondary" : "ghost"}
                    onClick={() => setShowLegends(!showLegends)}
                  >
                    <Layers className="h-6 w-6 pointer-events-none" />
                    <span className="sr-only">Toggle Legends</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Legends</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-pressed={showSettings}
                    className="h-10 w-12 p-0"
                    variant={showSettings ? "secondary" : "ghost"}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-6 w-6 pointer-events-none" />
                    <span className="sr-only">Toggle Threshold Settings</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Threshold Settings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-pressed={showBench}
                    className="h-10 w-12 p-0"
                    id="toggle-bench"
                    variant={showBench ? "secondary" : "ghost"}
                    onClick={() => setShowBench(!showBench)}
                  >
                    <Activity className="h-6 w-6 pointer-events-none" />
                    <span className="sr-only">Toggle Performance Bench</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Performance Bench</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <ThemeToggle />
          </div>
        </header>

        {showBench && (
          <PerformanceBenchPanel
            currentScale={scale}
            history={history}
            isPending={isPending}
            liveFps={liveFps}
            onScaleChange={handleScaleChange}
          />
        )}

        {/*
         * <Profiler> is React's first-party render-timing API.
         * onProfilerRender captures actualDuration for the "update" phase
         * and records it in the hook's history whenever a scale change fires.
         */}
        <Profiler id="dashboard" onRender={onProfilerRender}>
          <DashboardGrid
            rows={rows}
            showLegends={showLegends}
            showSettings={showSettings}
            showMetrics={showMetrics}
            onGridRenderComplete={onGridRenderComplete}
          />
        </Profiler>
      </div>
    </main>
  );
}
