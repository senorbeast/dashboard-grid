import assessmentDataJson from "@/lib/assessment-data.json";
import type { AssessmentData, Department, Employee } from "@/lib/types";

export const assessmentData = assessmentDataJson as AssessmentData;
export const employees = assessmentData.employees;

export const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
] as const satisfies readonly Department[];

export type DepartmentFilter = Department | "All";

export type AssessmentMetrics = {
  employeeCount: number;
  activeCount: number;
  averageRating: number;
  averageSalary: number;
  projectsCompleted: number;
  departmentCount: number;
};

export function filterEmployeesByDepartment(
  rows: Employee[],
  department: DepartmentFilter,
) {
  if (department === "All") {
    return rows;
  }

  return rows.filter((employee) => employee.department === department);
}

export function filterEmployeesBySearch(rows: Employee[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((employee) => {
    const searchableValues = [
      employee.id,
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.department,
      employee.position,
      employee.location,
      employee.manager ?? "",
      employee.skills.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return searchableValues.includes(normalizedQuery);
  });
}

export function getAssessmentMetrics(rows: Employee[]): AssessmentMetrics {
  if (rows.length === 0) {
    return {
      activeCount: 0,
      averageRating: 0,
      averageSalary: 0,
      departmentCount: 0,
      employeeCount: 0,
      projectsCompleted: 0,
    };
  }

  return {
    activeCount: rows.filter((employee) => employee.isActive).length,
    averageRating:
      rows.reduce((sum, employee) => sum + employee.performanceRating, 0) /
      rows.length,
    averageSalary:
      rows.reduce((sum, employee) => sum + employee.salary, 0) / rows.length,
    departmentCount: new Set(rows.map((employee) => employee.department)).size,
    employeeCount: rows.length,
    projectsCompleted: rows.reduce(
      (sum, employee) => sum + employee.projectsCompleted,
      0,
    ),
  };
}

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
