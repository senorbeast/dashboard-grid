# Performance Metrics & Benchmark Guide

This document provides a comprehensive, in-depth explanation of how the performance metrics and scaling engine are implemented, measured, and calculated in the Employee Assessment Dashboard.

---

## Architecture Overview

The performance benchmarking system measures render timing, total load latency, and interactive responsiveness (FPS) across variable dataset sizes ranging from **20** to **5,000,000** records.

The core implementation is split across three key layers:

1. **State & Measurement Hook**: [usePerformanceBench](file:///home/beasty/Documents/huee/dashboard-grid/hooks/use-performance-bench.ts)
   - Tracks measurement state, starts timers, triggers transitions, and aggregates benchmarking snapshots.
2. **Presentational Dashboard Grid**: [EmployeeGrid](file:///home/beasty/Documents/huee/dashboard-grid/components/dashboard-grid/employee-grid.tsx) & [page.tsx](file:///home/beasty/Documents/huee/dashboard-grid/app/page.tsx)
   - Wraps the render tree with React's built-in `<Profiler>` component and forwards lifecycle callbacks from AG Grid back to the hook.
3. **Presentational Panel Component**: [PerformanceBenchPanel](file:///home/beasty/Documents/huee/dashboard-grid/components/performance-bench/index.tsx)
   - Renders the interactive control panel, sparklines, metric summaries, status badges, and run history.

---

## In-Depth Metric Analysis

### 1. Render Time (ms)

#### Definition
**Render Time** represents the actual duration React spent rendering the dashboard subtree (specifically the `DashboardGrid` component) during the "update" phase.

#### Under the Hood
In [page.tsx](file:///home/beasty/Documents/huee/dashboard-grid/app/page.tsx), the grid is wrapped inside React's native `<Profiler>`:

```tsx
<Profiler id="dashboard" onRender={onProfilerRender}>
  <DashboardGrid ... />
</Profiler>
```

When a user changes the scale, the hook schedules state updates using React's `useTransition()`. The `<Profiler>` fires the `onProfilerRender` callback, passing the `actualDuration` parameter.

- **`actualDuration`**: The time (in milliseconds) React spent rendering the subtree for the current update. This includes any nested updates or re-renders within the subtree.
- **Filtering Phase**: The hook ignores the `"mount"` phase (initial page load) and only captures values during the `"update"` phase when `pendingScaleRef` contains an active target scale.

#### Performance Thresholds & Grading

| Range (ms) | Grade | Color / Style | Interpretation |
| :--- | :--- | :--- | :--- |
| `< 50` | `Excellent` | Cyan (`text-cyan-400`) | React virtual DOM updates are fully optimized, taking less than 3 frames. |
| `50 - 149` | `Good` | Green (`text-green-400`) | Minor UI render overhead, imperceptible to the user. |
| `150 - 399` | `Fair` | Yellow (`text-yellow-400`) | Noticeable pause on slower devices; layout updates are slightly heavy. |
| `>= 400` | `Slow` | Red (`text-red-400`) | Blocking render times. Subtree contains heavy components. |

---

### 2. Total Load Time (ms)

#### Definition
**Total Load Time** is the end-to-end latency of a dataset scale change. It begins when the user clicks a scale button and ends when AG Grid completely renders the new row data in the browser DOM.

#### Under the Hood
1. **Initiation**: In [usePerformanceBench](file:///home/beasty/Documents/huee/dashboard-grid/hooks/use-performance-bench.ts), the `handleScaleChange` function sets a start timestamp using the high-resolution browser timer:
   ```typescript
   startTimeRef.current = performance.now();
   ```
2. **Transition & Generation**: React starts a concurrent transition via `startTransition`, which triggers the synthetic data generator `generateEmployees(newScale)` to produce or retrieve the dataset.
3. **DOM Rendering & Paint**: React commits the updated Virtual DOM. AG Grid receives the updated `rowData` prop.
4. **Completion Callback**: AG Grid finishes sorting, filtering, viewport calculation, and DOM node generation. It fires one of its rendering lifecycle events:
   - `onRowDataUpdated`: Fires when data is updated in an active grid.
   - `onFirstDataRendered`: Fires when data is first rendered on mount.
   
   These events trigger `onGridRenderComplete()`, which computes:
   ```typescript
   const totalLoadMs = performance.now() - startTimeRef.current;
   ```

#### Components Measured in Total Load Time
- **Data Generation Time**: Time spent generating mock employee records.
- **React Reconciliation & Commit**: Time for React to diff and commit tree updates.
- **AG Grid Processing**: Row grouping, sorting, filtering, and layout calculation.
- **DOM Insertion & Style Recalculation**: The browser painting the virtualized table rows.

#### Performance Thresholds & Grading

| Range (ms) | Grade | Color / Style | Interpretation |
| :--- | :--- | :--- | :--- |
| `< 150` | `Instant` | Cyan (`text-cyan-400`) | Visual change is immediate and seamless. |
| `150 - 599` | `Fast` | Green (`text-green-400`) | Smooth transition, fast data swap. |
| `600 - 1799` | `Fair` | Yellow (`text-yellow-400`) | Minor visible lag; spinner/loading bar is active. |
| `>= 1800` | `Slow` | Red (`text-red-400`) | Long-running operation; high data overhead. |

---

### 3. Frame Rate (FPS)

#### Definition
**Frame Rate (Frames Per Second)** measures the smoothness of the UI. It quantifies how many times per second the browser refreshes the screen while the grid is updating or during interactions.

#### Under the Hood
The dashboard utilizes the `useFps` hook from the `react-fps` library, initialized with a window size of 30 frame samples.
- The hook sets up a continuous loop using `window.requestAnimationFrame()`.
- It tracks the elapsed time between successive frames.
- It averages these readings over a rolling 1-second interval to compute `currentFps`.
- When a scale benchmark completes, the current rolling average is snapshot-recorded into the history log.

#### Performance Thresholds & Grading

| Range (FPS) | Grade | Color / Style | Interpretation |
| :--- | :--- | :--- | :--- |
| `>= 55` | `Smooth` | Cyan (`text-cyan-400`) | Near perfect 60fps refresh rate. Butter-smooth scrolling and transitions. |
| `30 - 54` | `Moderate` | Yellow (`text-yellow-400`) | Acceptable performance. Jitter may be felt during fast scrolling. |
| `< 30` | `Choppy` | Red (`text-red-400`) | Significant lag (stuttering). Visual quality is visibly compromised. |

---

## Synthetic Data & Scale Engine

To test performance at scale, the dashboard dynamically generates employee profiles using a deterministic, high-efficiency data engine.

### Pseudo-Random Number Generation (PRNG)
To prevent dataset "flickering" between components and renders, the system generates data using a seeded **Linear Congruential Generator (LCG)**:
```typescript
function makePrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 4294967296;
  };
}
```
This algorithm has zero dependencies and is extremely fast. For any given scale limit (e.g. `100,000`), the generator outputs the exact same sequence of names, locations, departments, salaries, and ratings.

### Scaling & Memory Management
The scale engine supports nine discrete configurations:

- **20** (Baseline)
- **500**
- **1,000** (Production Scale)
- **2,000**
- **5,000** (Stress Test Territory)
- **10,000**
- **100,000** (Extreme Stress Test)
- **1,000,000** (Mega Stress Test)
- **5,000,000** (Ultimate Stress Test)

#### Memory Strategy (LRU/Selective Cache)
Generating large numbers of JavaScript objects consumes significant memory and CPU cycles. To optimize responsiveness, the generator uses a cache:
- **Scales `<= 100,000`**: The generated array of objects is cached in a Javascript `Map` memory cache. Subsequent switches to these scales resolve in **`< 10ms`**.
- **Scales `> 100,000` (`1M` and `5M`)**: Bypasses the cache entirely. Caching millions of complex records would trigger **Out-of-Memory (OOM)** heap crashes in browser environments. These arrays are generated fresh on demand and garbage collected immediately after use.

---

## Why is AG Grid so fast at large scales?

A key observation when running the benchmark at scale:
- At **100,000** rows, React Render Time remains extremely low (**`< 5ms`**), while the Total Load Time is around **`200ms`**.
- Even at **1,000,000** rows, the application is responsive.

### The Secret: DOM Virtualization
AG Grid does not render all rows in the browser DOM. Instead, it utilizes **DOM Virtualization**:
1. Only the visible rows (plus a small buffer) are drawn as HTML elements in the viewport.
2. As the user scrolls, AG Grid dynamically recycles the existing DOM nodes and swaps out their text/content rather than creating new nodes.
3. React only renders the outer shell container, bypassing the virtualization logic. This keeps React's Virtual DOM reconciliation extremely fast.
