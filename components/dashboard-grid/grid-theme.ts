import { themeQuartz } from "ag-grid-community";

export function getGridTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";

  return themeQuartz.withParams({
    accentColor: isDark ? "#60a5fa" : "#2563eb",
    backgroundColor: isDark ? "#18181b" : "#ffffff",
    borderColor: isDark ? "#3f3f46" : "#e2e8f0",
    borderRadius: 8,
    browserColorScheme: mode,
    cellHorizontalPadding: 14,
    columnBorder: false,
    fontFamily: "Arial, Helvetica, sans-serif",
    foregroundColor: isDark ? "#f8fafc" : "#0f172a",
    headerBackgroundColor: isDark ? "#27272a" : "#f1f5f9",
    headerFontWeight: 600,
    headerTextColor: isDark ? "#e4e4e7" : "#334155",
    oddRowBackgroundColor: isDark ? "#1f1f23" : "#f8fafc",
    rowBorder: true,
    rowHeight: 48,
  });
}
