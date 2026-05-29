import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { EmployeeGridToolbar } from "@/components/dashboard-grid/toolbar";
import type { DepartmentFilter } from "@/lib/assessment";

describe("EmployeeGridToolbar", () => {
  it("emits search and department filter changes", async () => {
    const user = userEvent.setup();
    const onDepartmentFilterChange = vi.fn();
    const onQuickFilterChange = vi.fn();

    function ToolbarHarness() {
      const [departmentFilter, setDepartmentFilter] =
        useState<DepartmentFilter>("All");
      const [quickFilter, setQuickFilter] = useState("");

      return (
        <EmployeeGridToolbar
          departmentFilter={departmentFilter}
          quickFilter={quickFilter}
          onDepartmentFilterChange={(department) => {
            setDepartmentFilter(department);
            onDepartmentFilterChange(department);
          }}
          onQuickFilterChange={(value) => {
            setQuickFilter(value);
            onQuickFilterChange(value);
          }}
        />
      );
    }

    render(<ToolbarHarness />);

    await user.type(screen.getByLabelText("Search employees"), "john");
    await user.click(screen.getByRole("button", { name: "Engineering" }));

    expect(onQuickFilterChange).toHaveBeenLastCalledWith("john");
    expect(onDepartmentFilterChange).toHaveBeenCalledWith("Engineering");
  });

  it("marks the selected department as pressed", () => {
    render(
      <EmployeeGridToolbar
        departmentFilter="Finance"
        quickFilter=""
        onDepartmentFilterChange={vi.fn()}
        onQuickFilterChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Finance" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
