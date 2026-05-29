import { useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, Theme, RowHeightParams, RowClickedEvent } from "ag-grid-community";
import type { Employee } from "@/lib/types";

type EmployeeGridProps = {
  columnDefs: ColDef<Employee>[];
  defaultColDef: ColDef<Employee>;
  quickFilter: string;
  rows: Employee[];
  theme: Theme;
  onGridRenderComplete?: () => void;
};

export function EmployeeGrid({
  columnDefs,
  defaultColDef,
  quickFilter,
  rows,
  theme,
  onGridRenderComplete,
}: EmployeeGridProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | number | null>(null);

  const getRowHeight = useCallback(
    (params: RowHeightParams<Employee>) => {
      if (params.data && params.data.id === expandedRowId) {
        return 96; // Expanded height to fit wrapped skill badges
      }
      return 48; // Default compact row height
    },
    [expandedRowId],
  );

  const onRowClicked = useCallback(
    (params: RowClickedEvent<Employee>) => {
      if (!params.data) return;
      const clickedId = params.data.id;
      setExpandedRowId((prev) => {
        const next = prev === clickedId ? null : clickedId;
        setTimeout(() => {
          params.api.resetRowHeights();
          // Instantly refresh the skills column cells for the toggled row to render all badges
          params.api.refreshCells({
            rowNodes: [params.node],
            columns: ["skills"],
            force: true,
          });
        }, 0);
        return next;
      });
    },
    [],
  );

  return (
    <div className="h-[560px] w-full">
      <AgGridReact<Employee>
        animateRows
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        quickFilterText={quickFilter}
        rowData={rows}
        theme={theme}
        getRowHeight={getRowHeight}
        onRowClicked={onRowClicked}
        onRowDataUpdated={() => onGridRenderComplete?.()}
        onFirstDataRendered={() => onGridRenderComplete?.()}
      />
    </div>
  );
}
