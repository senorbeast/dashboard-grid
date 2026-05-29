import { AgGridReact } from "ag-grid-react";
import type { ColDef, Theme, GridReadyEvent } from "ag-grid-community";
import type { Employee } from "@/lib/types";
import { useCallback } from "react";

const LOCAL_STORAGE_KEY = "employeeGridColumnState";
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
  const saveColumnState = useCallback((params: any) => {
    const colState = params.api.getColumnState();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(colState));
  }, []);
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
        tooltipShowDelay={0}
        enableCellTextSelection={true}
        onGridReady={(params: GridReadyEvent) => {
          const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (savedState) {
            try {
              params.api.applyColumnState({
                state: JSON.parse(savedState),
                applyOrder: true,
              });
            } catch (e) {
              console.error("Failed to restore column state", e);
            }
          }
        }}
        onSortChanged={saveColumnState}
        onColumnResized={saveColumnState}
        onColumnMoved={saveColumnState}
        onColumnVisible={saveColumnState}
        onColumnPinned={saveColumnState}
        onRowDataUpdated={() => onGridRenderComplete?.()}
        onFirstDataRendered={() => onGridRenderComplete?.()}
      />
    </div>
  );
}
