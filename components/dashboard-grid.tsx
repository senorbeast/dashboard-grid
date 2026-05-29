"use client";

import { useMemo, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { EmployeeGrid } from "@/components/dashboard-grid/employee-grid";
import { getDefaultColDef, getEmployeeColumnDefs } from "@/components/dashboard-grid/columns";
import { getGridTheme } from "@/components/dashboard-grid/grid-theme";
import { MetricsSummary } from "@/components/dashboard-grid/metrics";
import { EmployeeGridToolbar } from "@/components/dashboard-grid/toolbar";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  employees as defaultEmployees,
  filterEmployeesByDepartment,
  filterEmployeesBySearch,
  getAssessmentMetrics,
  type DepartmentFilter,
} from "@/lib/assessment";
import type { Employee } from "@/lib/types";

ModuleRegistry.registerModules([AllCommunityModule]);

type DashboardGridProps = {
  rows?: Employee[];
  showLegends: boolean;
  showSettings: boolean;
};

export function DashboardGrid({
  rows = defaultEmployees,
  showLegends,
  showSettings,
}: DashboardGridProps) {
  const { theme } = useTheme();
  const [quickFilter, setQuickFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState<DepartmentFilter>("All");

  const filteredRows = useMemo(
    () => filterEmployeesByDepartment(rows, departmentFilter),
    [departmentFilter, rows],
  );
  const visibleRows = useMemo(
    () => filterEmployeesBySearch(filteredRows, quickFilter),
    [filteredRows, quickFilter],
  );
  const metrics = useMemo(
    () => getAssessmentMetrics(visibleRows),
    [visibleRows],
  );
  const columnDefs = useMemo(() => getEmployeeColumnDefs(), []);
  const defaultColDef = useMemo(() => getDefaultColDef(), []);
  const gridTheme = useMemo(() => getGridTheme(theme), [theme]);

  return (
    <div className="space-y-5">
      <MetricsSummary
        metrics={metrics}
        rows={visibleRows}
        showLegends={showLegends}
        showSettings={showSettings}
      />

      <Card>
        <CardHeader className="flex flex-col gap-4 border-b border-border md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Assessment Data</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Sort, filter, resize columns, and scan employee performance
              records.
            </p>
          </div>
          <EmployeeGridToolbar
            departmentFilter={departmentFilter}
            quickFilter={quickFilter}
            onDepartmentFilterChange={setDepartmentFilter}
            onQuickFilterChange={setQuickFilter}
          />
        </CardHeader>
        <CardContent className="p-0">
          <EmployeeGrid
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilter={quickFilter}
            rows={visibleRows}
            theme={gridTheme}
          />
        </CardContent>
      </Card>
    </div>
  );
}
