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
  const len = rows.length;
  if (len === 0) {
    return {
      activeCount: 0,
      averageRating: 0,
      averageSalary: 0,
      departmentCount: 0,
      employeeCount: 0,
      projectsCompleted: 0,
    };
  }

  let activeCount = 0;
  let totalRating = 0;
  let totalSalary = 0;
  let totalProjects = 0;
  const uniqueDepartments = new Set<string>();

  for (let i = 0; i < len; i++) {
    const employee = rows[i];
    if (employee.isActive) activeCount++;
    totalRating += employee.performanceRating;
    totalSalary += employee.salary;
    totalProjects += employee.projectsCompleted;
    uniqueDepartments.add(employee.department);
  }

  return {
    activeCount,
    averageRating: totalRating / len,
    averageSalary: totalSalary / len,
    departmentCount: uniqueDepartments.size,
    employeeCount: len,
    projectsCompleted: totalProjects,
  };
}

export function getAllSkills(rows: Employee[]): string {
  const skills = new Set<string>();
  const len = rows.length;
  // If the dataset is large, a small sample of 2,000 rows is statistically guaranteed to contain all unique skills
  const limit = Math.min(len, 2000);
  
  for (let i = 0; i < limit; i++) {
    const employee = rows[i];
    const sLen = employee.skills.length;
    for (let j = 0; j < sLen; j++) {
      skills.add(employee.skills[j]);
    }
  }
  return Array.from(skills).sort().join(", ");
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
