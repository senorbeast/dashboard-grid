/**
 * Deterministic synthetic employee data generator.
 *
 * Uses a seeded LCG (Linear Congruential Generator) so the same `count`
 * always produces identical data – no flickering between renders.
 *
 * Strategy: the 20 real employees are kept verbatim.  For every additional
 * row we mutate a random real record with fresh IDs / emails / salaries etc.
 */

import type { Employee } from "@/lib/types";
import { employees as realEmployees } from "@/lib/assessment";

// ---------------------------------------------------------------------------
// Seeded PRNG (LCG – good enough for fake data, zero dependencies)
// ---------------------------------------------------------------------------

function makePrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    // Knuth's LCG constants
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Vocabulary pools
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  "Aaron", "Abigail", "Adam", "Adriana", "Alan", "Alicia", "Alyssa", "Amanda",
  "Amber", "Amy", "Andrea", "Andrew", "Angela", "Anna", "Anthony", "Ashley",
  "Austin", "Benjamin", "Beth", "Blake", "Brandon", "Brenda", "Brian", "Brittany",
  "Bryan", "Caleb", "Carly", "Carlos", "Catherine", "Charles", "Charlotte",
  "Chloe", "Christina", "Christine", "Christopher", "Clara", "Cody", "Colin",
  "Connor", "Crystal", "Curtis", "Cynthia", "Dana", "Daniel", "Danielle",
  "David", "Deborah", "Devin", "Diana", "Diane", "Dylan", "Edward", "Elijah",
  "Elizabeth", "Ella", "Emily", "Emma", "Eric", "Erica", "Ethan", "Eva",
  "Evelyn", "Faith", "Felicia", "Frank", "Gabriel", "Gabrielle", "Gavin",
  "George", "Grace", "Gregory", "Hannah", "Hector", "Heidi", "Henry", "Holly",
  "Ian", "Isabella", "Jack", "Jackson", "Jacob", "Jade", "Jake", "James",
  "Jamie", "Janet", "Jasmine", "Jason", "Jenna", "Jennifer", "Jeremy", "Jessica",
  "Jill", "Joel", "Jonathan", "Jordan", "Jose", "Joseph", "Joshua", "Julia",
  "Julian", "Justin", "Karen", "Katherine", "Kathryn", "Kayla", "Keith",
  "Kelly", "Kenneth", "Kevin", "Kimberly", "Kyle", "Laura", "Lauren", "Leah",
  "Leslie", "Liam", "Linda", "Lisa", "Logan", "Lucas", "Lucy", "Luke",
  "Madison", "Maria", "Matthew", "Megan", "Melissa", "Michael", "Michelle",
  "Miguel", "Molly", "Monica", "Nathan", "Nicholas", "Nicole", "Noah",
  "Olivia", "Patrick", "Peter", "Philip", "Rachel", "Rebecca", "Richard",
  "Robert", "Ryan", "Samantha", "Sandra", "Sarah", "Scott", "Sean", "Sharon",
  "Sophia", "Stephanie", "Stephen", "Steven", "Susan", "Taylor", "Thomas",
  "Timothy", "Tyler", "Victoria", "Vincent", "William", "Zachary",
];

const LAST_NAMES = [
  "Adams", "Alexander", "Allen", "Anderson", "Bailey", "Baker", "Barnes",
  "Bell", "Bennett", "Brooks", "Brown", "Bryant", "Butler", "Campbell",
  "Carter", "Clark", "Collins", "Cook", "Cooper", "Cox", "Cruz", "Davis",
  "Diaz", "Edwards", "Evans", "Fisher", "Flores", "Foster", "Garcia",
  "Gonzalez", "Green", "Griffin", "Hall", "Harris", "Harrison", "Hayes",
  "Henderson", "Hernandez", "Hill", "Howard", "Hughes", "Jackson", "James",
  "Jenkins", "Johnson", "Jones", "Jordan", "Kelly", "King", "Lee", "Lewis",
  "Long", "Lopez", "Martin", "Martinez", "Miller", "Mitchell", "Moore",
  "Morgan", "Morris", "Murphy", "Myers", "Nelson", "Nguyen", "Parker",
  "Patterson", "Perez", "Perry", "Peterson", "Phillips", "Price", "Ramirez",
  "Reed", "Richardson", "Rivera", "Roberts", "Robinson", "Rodriguez", "Rogers",
  "Ross", "Russell", "Sanchez", "Sanders", "Scott", "Simmons", "Smith",
  "Stewart", "Sullivan", "Taylor", "Thomas", "Thompson", "Torres", "Turner",
  "Walker", "Ward", "Watson", "White", "Williams", "Wilson", "Wood", "Wright",
  "Young",
];

const LOCATIONS = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "San Francisco",
  "Seattle", "Denver", "Nashville", "Boston", "Las Vegas", "Portland",
  "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson",
  "Miami",
];

const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
] as const;

const POSITIONS_BY_DEPT: Record<string, string[]> = {
  Engineering: [
    "Junior Developer", "Developer", "Senior Developer", "Lead Engineer",
    "Staff Engineer", "Principal Engineer", "Engineering Manager", "Director of Engineering",
    "VP Engineering", "CTO", "DevOps Engineer", "QA Engineer", "Security Engineer",
    "Data Engineer", "ML Engineer",
  ],
  Marketing: [
    "Marketing Coordinator", "Marketing Specialist", "Digital Marketing Specialist",
    "Content Specialist", "SEO Specialist", "Marketing Manager", "Brand Manager",
    "Growth Manager", "VP Marketing", "CMO",
  ],
  Sales: [
    "Sales Development Rep", "Sales Representative", "Account Executive",
    "Senior Account Executive", "Sales Manager", "Regional Sales Manager",
    "Director of Sales", "VP Sales", "Chief Revenue Officer",
  ],
  HR: [
    "HR Assistant", "HR Specialist", "Recruiter", "HR Business Partner",
    "Talent Acquisition Specialist", "HR Manager", "HR Director", "VP People", "CHRO",
  ],
  Finance: [
    "Accountant", "Senior Accountant", "Financial Analyst", "Senior Financial Analyst",
    "Finance Manager", "Controller", "VP Finance", "CFO",
  ],
};

const SKILLS_BY_DEPT: Record<string, string[]> = {
  Engineering: [
    "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "React",
    "Vue", "Angular", "Node.js", "Spring Boot", "Django", "FastAPI", "PostgreSQL",
    "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "GCP", "Azure",
    "Terraform", "CI/CD", "GraphQL", "REST APIs", "Microservices", "System Design",
    "Test Automation", "Selenium", "Jest", "Cypress", "API Testing", "Security",
  ],
  Marketing: [
    "Digital Marketing", "SEO", "SEM", "Google Ads", "Facebook Ads", "Content Strategy",
    "Email Marketing", "Social Media", "Brand Management", "Marketing Analytics",
    "Adobe Creative", "Figma", "Copywriting", "Campaign Management", "A/B Testing",
    "HubSpot", "Marketo", "Salesforce Marketing Cloud", "Growth Hacking", "Market Research",
  ],
  Sales: [
    "CRM", "Salesforce", "B2B Sales", "B2C Sales", "Account Management", "Negotiation",
    "Customer Relations", "Prospecting", "Cold Calling", "Presentation", "Proposal Writing",
    "Sales Strategy", "Pipeline Management", "Territory Management", "Forecasting",
    "LinkedIn Sales Navigator", "ZoomInfo", "Outreach", "HubSpot CRM",
  ],
  HR: [
    "Recruitment", "Talent Acquisition", "Employee Relations", "HRIS", "Workday",
    "LinkedIn Recruiter", "Interviewing", "Onboarding", "Performance Management",
    "HR Analytics", "Compensation & Benefits", "Policy Development", "Labor Law",
    "Diversity & Inclusion", "Learning & Development", "Succession Planning",
  ],
  Finance: [
    "Financial Modeling", "Excel", "SAP", "Oracle Financials", "QuickBooks", "Accounting",
    "Tax Preparation", "Budgeting", "Forecasting", "Financial Planning", "GAAP",
    "IFRS", "Audit", "Risk Management", "Cash Flow Analysis", "M&A", "Valuation",
    "Bloomberg Terminal", "Data Analysis",
  ],
};

const MANAGER_POOL = realEmployees
  .filter((e) => e.manager === null)
  .map((e) => `${e.firstName} ${e.lastName}`);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

const DOMAINS = ["company.com", "corp.io", "enterprise.net"];

// Precompute all date strings for 2015-2023 to avoid Date object creations in loops
const DATE_STRINGS_BY_YEAR: string[][] = [];
for (let y = 2015; y <= 2023; y++) {
  const dates: string[] = [];
  const start = new Date(`${y}-01-01`);
  for (let d = 0; d < 365; d++) {
    dates.push(start.toISOString().split("T")[0]);
    start.setDate(start.getDate() + 1);
  }
  DATE_STRINGS_BY_YEAR.push(dates);
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const len = arr.length;
  if (len <= n) return [...arr];
  const result = new Array(n);
  const chosen = new Set<number>();
  for (let i = 0; i < n; i++) {
    let idx: number;
    do {
      idx = Math.floor(rng() * len);
    } while (chosen.has(idx));
    chosen.add(idx);
    result[i] = arr[idx];
  }
  return result;
}

function generateEmployee(id: number, rng: () => number): Employee {
  const firstName = pick(FIRST_NAMES, rng);
  const lastName = pick(LAST_NAMES, rng);
  const department = pick([...DEPARTMENTS], rng);
  const positions = POSITIONS_BY_DEPT[department];
  const position = pick(positions, rng);
  const skills = pickN(SKILLS_BY_DEPT[department], 3, rng);
  const salary = Math.round((45000 + rng() * 140000) / 1000) * 1000;
  const age = Math.floor(22 + rng() * 28);
  const location = pick(LOCATIONS, rng);
  const isActive = rng() > 0.08;
  const performanceRating = Math.round((3.0 + rng() * 2.0) * 10) / 10;
  const projectsCompleted = Math.floor(rng() * 30);
  
  const yearIdx = Math.floor(rng() * 9);
  const dayIdx = Math.floor(rng() * 365);
  const hireDate = DATE_STRINGS_BY_YEAR[yearIdx][dayIdx];

  const managerVal = rng() > 0.15 ? pick(MANAGER_POOL, rng) : null;
  const domain = DOMAINS[Math.floor(rng() * 3)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@${domain}`;

  return {
    id,
    firstName,
    lastName,
    email,
    department,
    position,
    salary,
    hireDate,
    age,
    location,
    performanceRating,
    projectsCompleted,
    isActive,
    skills,
    manager: managerVal,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type ScaleOption = 20 | 500 | 1000 | 2000 | 5000 | 10000 | 100000 | 1000000 | 5000000;
export const SCALE_OPTIONS: ScaleOption[] = [20, 500, 1000, 2000, 5000, 10000, 100000, 1000000, 5000000];
export const SCALE_LABELS: Record<ScaleOption, string> = {
  20: "20",
  500: "500",
  1000: "1k",
  2000: "2k",
  5000: "5k",
  10000: "10k",
  100000: "100k",
  1000000: "1M",
  5000000: "5M",
};

const cache = new Map<ScaleOption, Employee[]>();

export function generateEmployees(count: ScaleOption): Employee[] {
  if (cache.has(count)) return cache.get(count)!;

  if (count <= 20) {
    cache.set(count, realEmployees.slice(0, count));
    return realEmployees.slice(0, count);
  }

  // Start with all real employees, then synthesise the rest
  const rng = makePrng(count * 31337);
  const result: Employee[] = [...realEmployees];

  for (let i = realEmployees.length + 1; i <= count; i++) {
    result.push(generateEmployee(i, rng));
  }

  // Only cache up to 100k to prevent out of memory issues with 1M or 5M
  if (count <= 100000) {
    cache.set(count, result);
  }
  return result;
}
