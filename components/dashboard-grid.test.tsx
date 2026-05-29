import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardGrid } from "@/components/dashboard-grid";
import { ThemeProvider } from "@/components/theme-provider";
import type { Employee } from "@/lib/types";

const testRows: Employee[] = [
  {
    age: 32,
    department: "Engineering",
    email: "ada@example.com",
    firstName: "Ada",
    hireDate: "2021-01-01",
    id: 1,
    isActive: true,
    lastName: "Lovelace",
    location: "New York",
    manager: "Grace Hopper",
    performanceRating: 4.8,
    position: "Senior Developer",
    projectsCompleted: 10,
    salary: 120000,
    skills: ["React", "TypeScript"],
  },
  {
    age: 29,
    department: "Engineering",
    email: "alan@example.com",
    firstName: "Alan",
    hireDate: "2022-02-01",
    id: 2,
    isActive: false,
    lastName: "Turing",
    location: "Seattle",
    manager: "Grace Hopper",
    performanceRating: 4.2,
    position: "QA Engineer",
    projectsCompleted: 6,
    salary: 90000,
    skills: ["Testing", "Automation"],
  },
  {
    age: 35,
    department: "Sales",
    email: "katherine@example.com",
    firstName: "Katherine",
    hireDate: "2020-03-01",
    id: 3,
    isActive: true,
    lastName: "Johnson",
    location: "Austin",
    manager: null,
    performanceRating: 3.9,
    position: "Account Executive",
    projectsCompleted: 4,
    salary: 75000,
    skills: ["CRM", "Negotiation"],
  },
];

vi.mock("ag-grid-community", () => ({
  AllCommunityModule: {},
  ModuleRegistry: {
    registerModules: vi.fn(),
  },
  themeQuartz: {
    withParams: vi.fn((params) => ({ params })),
  },
}));

vi.mock("ag-grid-react", () => ({
  AgGridReact: ({
    quickFilterText,
    rowData,
  }: {
    quickFilterText: string;
    rowData: Array<{ firstName: string; lastName: string }>;
  }) => (
    <div
      data-testid="ag-grid"
      data-quick-filter={quickFilterText}
      data-row-count={rowData.length}
    >
      {rowData.map((row) => (
        <span key={`${row.firstName}-${row.lastName}`}>
          {row.firstName} {row.lastName}
        </span>
      ))}
    </div>
  ),
}));

function renderWithTheme(children: ReactNode) {
  return render(<ThemeProvider>{children}</ThemeProvider>);
}

describe("DashboardGrid integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders assessment metrics and the grid", () => {
    renderWithTheme(
      <DashboardGrid showLegends={true} showSettings={false} rows={testRows} />,
    );

    expect(screen.getByText("Assessment Data")).toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText(String(testRows.length))).toBeInTheDocument();
    expect(screen.getByTestId("ag-grid")).toHaveAttribute(
      "data-row-count",
      String(testRows.length),
    );
  });

  it("filters rows by department and forwards quick search to AG Grid", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <DashboardGrid showLegends={true} showSettings={false} rows={testRows} />,
    );

    await user.click(screen.getByRole("button", { name: "Engineering" }));
    await user.type(screen.getByLabelText("Search employees"), "ada");

    expect(screen.getByTestId("ag-grid")).toHaveAttribute(
      "data-row-count",
      "1",
    );
    expect(screen.getByTestId("ag-grid")).toHaveAttribute(
      "data-quick-filter",
      "ada",
    );
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Employees").nextElementSibling?.textContent,
    ).toBe("1");
    expect(screen.getByText("Rating Bands")).toBeInTheDocument();
    });

    it("toggles legends and settings visibility", () => {
    const { rerender } = renderWithTheme(
      <DashboardGrid showLegends={true} showSettings={false} rows={testRows} />,
    );

    expect(screen.getByText("Rating Bands")).toBeInTheDocument();
    expect(screen.queryByText("Rating Thresholds")).not.toBeInTheDocument();

    rerender(
      <ThemeProvider>
        <DashboardGrid
          showLegends={false}
          showSettings={true}
          rows={testRows}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByText("Rating Bands")).not.toBeInTheDocument();
    expect(screen.getByText("Rating Thresholds")).toBeInTheDocument();
    });
});
