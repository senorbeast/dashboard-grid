"use client";

import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type ICellRendererParams,
  themeQuartz,
} from "ag-grid-community";
import assessmentDataJson from "@/lib/assessment-data.json";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AssessmentData, Department, Employee } from "@/lib/types";

ModuleRegistry.registerModules([AllCommunityModule]);

const assessmentData = assessmentDataJson as AssessmentData;
const employees = assessmentData.employees;

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
] as const satisfies readonly Department[];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function getGridTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";

  return themeQuartz.withParams({
    accentColor: isDark ? "#60a5fa" : "#2563eb",
    backgroundColor: isDark ? "#18181b" : "#ffffff",
    borderColor: isDark ? "#3f3f46" : "#e2e8f0",
    borderRadius: 8,
    browserColorScheme: mode,
    cellHorizontalPadding: 14,
    columnBorder: false,
    fontFamily: "Arial, Helvetica, sans-serif",
    foregroundColor: isDark ? "#f8fafc" : "#0f172a",
    headerBackgroundColor: isDark ? "#27272a" : "#f1f5f9",
    headerFontWeight: 600,
    headerTextColor: isDark ? "#e4e4e7" : "#334155",
    oddRowBackgroundColor: isDark ? "#1f1f23" : "#f8fafc",
    rowBorder: true,
    rowHeight: 48,
  });
}

function ActiveBadge({ value }: { value: boolean }) {
  return (
    <Badge tone={value ? "green" : "zinc"}>
      {value ? "Active" : "Inactive"}
    </Badge>
  );
}

function RatingBadge({ value }: { value: number }) {
  const tone = value >= 4.5 ? "green" : value >= 4 ? "blue" : "amber";

  return <Badge tone={tone}>{value.toFixed(1)}</Badge>;
}

function SkillsCell({ value }: { value: string[] }) {
  return (
    <div className="flex h-full items-center gap-1.5 overflow-hidden">
      {value.slice(0, 2).map((skill) => (
        <Badge key={skill} tone="zinc">
          {skill}
        </Badge>
      ))}
      {value.length > 2 ? (
        <span className="text-xs text-muted-foreground">
          +{value.length - 2}
        </span>
      ) : null}
    </div>
  );
}

export function DashboardGrid() {
  const { theme } = useTheme();
  const [quickFilter, setQuickFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "All">(
    "All",
  );

  const filteredRows = useMemo(() => {
    if (departmentFilter === "All") {
      return employees;
    }

    return employees.filter(
      (employee) => employee.department === departmentFilter,
    );
  }, [departmentFilter]);

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      { field: "id", headerName: "ID", maxWidth: 90 },
      {
        colId: "name",
        headerName: "Employee",
        minWidth: 190,
        pinned: "left",
        valueGetter: ({ data }) =>
          data ? `${data.firstName} ${data.lastName}` : "",
      },
      { field: "email", flex: 1.3, minWidth: 230 },
      { field: "department", minWidth: 150 },
      { field: "position", flex: 1.2, minWidth: 210 },
      {
        field: "salary",
        filter: "agNumberColumnFilter",
        minWidth: 140,
        type: "rightAligned",
        valueFormatter: ({ value }) => currencyFormatter.format(value ?? 0),
      },
      {
        field: "performanceRating",
        headerName: "Rating",
        maxWidth: 120,
        type: "rightAligned",
        cellRenderer: (params: ICellRendererParams<Employee, number>) =>
          typeof params.value === "number" ? (
            <RatingBadge value={params.value} />
          ) : null,
      },
      {
        field: "projectsCompleted",
        headerName: "Projects",
        maxWidth: 125,
        type: "rightAligned",
      },
      {
        field: "isActive",
        headerName: "Status",
        maxWidth: 130,
        cellRenderer: (params: ICellRendererParams<Employee, boolean>) =>
          typeof params.value === "boolean" ? (
            <ActiveBadge value={params.value} />
          ) : null,
      },
      {
        field: "skills",
        minWidth: 230,
        cellRenderer: (params: ICellRendererParams<Employee, string[]>) =>
          params.value ? <SkillsCell value={params.value} /> : null,
        valueFormatter: ({ value }) => value?.join(", ") ?? "",
      },
      {
        field: "hireDate",
        headerName: "Hire Date",
        minWidth: 140,
        valueFormatter: ({ value }) => dateFormatter.format(new Date(value)),
      },
      { field: "location", minWidth: 130 },
      {
        field: "manager",
        minWidth: 170,
        valueFormatter: ({ value }) => value ?? "None",
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef<Employee>>(
    () => ({
      filter: true,
      resizable: true,
      sortable: true,
    }),
    [],
  );

  const gridTheme = useMemo(() => getGridTheme(theme), [theme]);
  const activeCount = filteredRows.filter(
    (employee) => employee.isActive,
  ).length;
  const averageRating =
    filteredRows.reduce(
      (sum, employee) => sum + employee.performanceRating,
      0,
    ) / filteredRows.length;
  const averageSalary =
    filteredRows.reduce((sum, employee) => sum + employee.salary, 0) /
    filteredRows.length;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Employees" value={String(filteredRows.length)} />
        <MetricCard label="Active employees" value={String(activeCount)} />
        <MetricCard label="Average rating" value={averageRating.toFixed(1)} />
        <MetricCard
          label="Average salary"
          value={currencyFormatter.format(averageSalary)}
        />
        <MetricCard
          label="Projects completed"
          value={String(
            filteredRows.reduce(
              (sum, employee) => sum + employee.projectsCompleted,
              0,
            ),
          )}
        />
        <MetricCard
          label="Departments"
          value={String(
            new Set(filteredRows.map((employee) => employee.department)).size,
          )}
        />
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 border-b border-border md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Assessment Data</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Sort, filter, resize columns, and scan employee performance
              records.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
            <Input
              aria-label="Search employees"
              className="h-[38px] lg:w-64"
              placeholder="Search employees..."
              value={quickFilter}
              onChange={(event) => setQuickFilter(event.target.value)}
            />
            <div className="flex max-w-full overflow-x-auto rounded-md border border-border bg-muted p-1">
              {(["All", ...departments] as const).map((department) => (
                <Button
                  key={department}
                  aria-pressed={departmentFilter === department}
                  className="h-7 shrink-0 px-2.5 text-xs"
                  variant={
                    departmentFilter === department ? "secondary" : "ghost"
                  }
                  onClick={() => setDepartmentFilter(department)}
                >
                  {department}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[560px] w-full">
            <AgGridReact<Employee>
              animateRows
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              paginationPageSize={10}
              quickFilterText={quickFilter}
              rowData={filteredRows}
              theme={gridTheme}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-normal text-card-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
