"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex rounded-md border border-border bg-muted p-1">
      {(["light", "dark"] as const).map((mode) => (
        <Button
          key={mode}
          aria-pressed={theme === mode}
          className="h-7 px-3 text-xs capitalize"
          variant={theme === mode ? "secondary" : "ghost"}
          onClick={() => setTheme(mode)}
        >
          {mode}
        </Button>
      ))}
    </div>
  );
}
