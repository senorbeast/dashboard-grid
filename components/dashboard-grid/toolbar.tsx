import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  departments,
  type DepartmentFilter,
} from "@/lib/assessment";

const departmentAccents = [
  "var(--accent-cyan)",
  "var(--accent-amber)",
  "var(--accent-violet)",
] as const;

type EmployeeGridToolbarProps = {
  departmentFilter: DepartmentFilter;
  quickFilter: string;
  onDepartmentFilterChange: (department: DepartmentFilter) => void;
  onQuickFilterChange: (value: string) => void;
};

function getDepartmentAccent(department: DepartmentFilter) {
  if (department === "All") {
    return departmentAccents[0];
  }

  return departmentAccents[departments.indexOf(department) % departmentAccents.length];
}

export function EmployeeGridToolbar({
  departmentFilter,
  quickFilter,
  onDepartmentFilterChange,
  onQuickFilterChange,
}: EmployeeGridToolbarProps) {
  const activeAccent = getDepartmentAccent(departmentFilter);

  return (
    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
      <Input
        aria-label="Search employees"
        className="h-[38px] lg:w-64"
        placeholder="Search employees..."
        value={quickFilter}
        onChange={(event) => onQuickFilterChange(event.target.value)}
      />
      <div
        className="flex max-w-full overflow-x-auto rounded-md border border-border bg-muted p-1"
        style={{ boxShadow: `inset 0 1px 0 ${activeAccent}` }}
      >
        {(["All", ...departments] as const).map((department) => (
          <Button
            key={department}
            aria-pressed={departmentFilter === department}
            className="h-7 shrink-0 px-2.5 text-xs"
            variant={departmentFilter === department ? "secondary" : "ghost"}
            style={
              departmentFilter === department
                ? {
                    boxShadow: `inset 0 -2px 0 ${getDepartmentAccent(
                      department,
                    )}`,
                  }
                : undefined
            }
            onClick={() => onDepartmentFilterChange(department)}
          >
            {department}
          </Button>
        ))}
      </div>
    </div>
  );
}
