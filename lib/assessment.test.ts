import { describe, expect, it } from "vitest";
import {
  filterEmployeesByDepartment,
  filterEmployeesBySearch,
  getAllSkills,
  getAssessmentMetrics,
} from "@/lib/assessment";
import type { Employee } from "@/lib/types";

const testEmployees: Employee[] = [
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

describe("assessment data helpers", () => {
  it("returns all employees when the department filter is All", () => {
    const result = filterEmployeesByDepartment(testEmployees, "All");

    expect(result).toEqual(testEmployees);
  });

  it("filters employees by department", () => {
    const engineeringEmployees = filterEmployeesByDepartment(
      testEmployees,
      "Engineering",
    );
    const expectedEngineeringCount = testEmployees.filter(
      (employee) => employee.department === "Engineering",
    ).length;

    expect(engineeringEmployees).toHaveLength(expectedEngineeringCount);
    expect(
      engineeringEmployees.every(
        (employee) => employee.department === "Engineering",
      ),
    ).toBe(true);
  });

  it("filters employees by search query across row fields", () => {
    const result = filterEmployeesBySearch(testEmployees, "lovelace");

    expect(result).toHaveLength(1);
    expect(result[0]?.firstName).toBe("Ada");
  });

  it("calculates aggregate metrics for a row set", () => {
    const metrics = getAssessmentMetrics(testEmployees);

    expect(metrics.employeeCount).toBe(testEmployees.length);
    expect(metrics.activeCount).toBe(
      testEmployees.filter((employee) => employee.isActive).length,
    );
    expect(metrics.departmentCount).toBe(
      new Set(testEmployees.map((employee) => employee.department)).size,
    );
    expect(metrics.projectsCompleted).toBe(
      testEmployees.reduce(
        (sum, employee) => sum + employee.projectsCompleted,
        0,
      ),
    );
    expect(metrics.averageRating).toBeCloseTo(
      testEmployees.reduce(
        (sum, employee) => sum + employee.performanceRating,
        0,
      ) / testEmployees.length,
    );
    expect(metrics.averageSalary).toBe(
      testEmployees.reduce((sum, employee) => sum + employee.salary, 0) /
        testEmployees.length,
    );
  });

  it("returns zeroed metrics for an empty row set", () => {
    expect(getAssessmentMetrics([])).toEqual({
      activeCount: 0,
      averageRating: 0,
      averageSalary: 0,
      departmentCount: 0,
      employeeCount: 0,
      projectsCompleted: 0,
    });
  });

  it("extracts all unique skills from a row set", () => {
    const skills = getAllSkills(testEmployees);
    expect(skills).toBe("Automation, CRM, Negotiation, React, Testing, TypeScript");
  });
});
