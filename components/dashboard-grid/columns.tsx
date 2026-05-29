import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { ActiveBadge, RatingBadge, SkillsCell } from "@/components/dashboard-grid/cells";
import { currencyFormatter, dateFormatter } from "@/lib/assessment";
import type { Employee } from "@/lib/types";

export function getEmployeeColumnDefs(allSkills?: string): ColDef<Employee>[] {
  return [
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
      headerTooltip: allSkills,
      cellRenderer: (params: ICellRendererParams<Employee, string[]>) => {
        if (!params.value) return null;
        const isExpanded = params.node.rowHeight ? params.node.rowHeight > 50 : false;
        return <SkillsCell value={params.value} isExpanded={isExpanded} />;
      },
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
  ];
}

export function getDefaultColDef(): ColDef<Employee> {
  return {
    filter: true,
    resizable: true,
    sortable: true,
  };
}
