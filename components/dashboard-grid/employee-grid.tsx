import { AgGridReact } from "ag-grid-react";
import type { ColDef, Theme } from "ag-grid-community";
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
        onRowDataUpdated={() => onGridRenderComplete?.()}
        onFirstDataRendered={() => onGridRenderComplete?.()}
      />
    </div>
  );
}
