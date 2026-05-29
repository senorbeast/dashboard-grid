# Dashboard Grid

A Next.js App Router dashboard built with Tailwind CSS, shadcn-style UI primitives, and AG Grid. The dashboard displays typed employee assessment data from `lib/assessment-data.json`, supports light/dark themes, and includes department filtering, quick search, metrics, and a paginated grid.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- AG Grid Community via `ag-grid-react`
- Vitest, jsdom, and React Testing Library

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

## Project Structure

- `app/`: Next.js routes, layout, and global theme tokens.
- `components/ui/`: shadcn-style primitives used by the dashboard.
- `components/dashboard-grid.tsx`: dashboard container and state wiring.
- `components/dashboard-grid/`: focused grid modules for columns, cells, toolbar, metrics, grid theme, and the AG Grid wrapper.
- `components/theme-provider.tsx`: light/dark mode state and document class synchronization.
- `lib/assessment-data.json`: JSON copy of the assessment data source.
- `lib/assessment.ts`: typed data access, filtering, metric helpers, and formatters.
- `lib/types.ts`: shared TypeScript data contracts.
- `test/setup.ts`: shared test environment setup.

## Testing

Tests use Vitest with the `jsdom` environment, configured in `vitest.config.ts`. jsdom provides browser-like DOM APIs so React components can be rendered and interacted with in Node.

`test/setup.ts` loads `@testing-library/jest-dom/vitest` matchers and shims `window.matchMedia`, which is needed by the theme provider during tests.

Test files are colocated with the code they cover where practical:

- `lib/assessment.test.ts`: unit tests for pure filtering and metric helpers.
- `components/dashboard-grid/cells.test.tsx`: unit tests for cell renderer components.
- `components/dashboard-grid/toolbar.test.tsx`: interaction tests for search and department filter controls.
- `components/dashboard-grid.test.tsx`: integration-style tests for the dashboard container. AG Grid is mocked here so tests focus on our state, filtering, and prop flow instead of AG Grid internals.

### Test Data Practice

Tests should not depend on the current contents of `assessment-data.json`. Use explicit fixtures or derive expectations from the rows supplied to the test. `DashboardGrid` accepts an optional `rows` prop so tests and future API-backed pages can inject their own data.

## Data Flow

The page currently uses local JSON data through `lib/assessment.ts`. To switch to API data later, fetch rows in the page or a parent component and pass them to:

```tsx
<DashboardGrid rows={employeesFromApi} />
```

Keep API response parsing and validation near the fetch boundary, then pass typed `Employee[]` rows into the dashboard.
