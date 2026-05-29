"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex rounded-md border border-border bg-muted p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-pressed={theme === "light"}
            className="h-10 w-12 p-0"
            variant={theme === "light" ? "secondary" : "ghost"}
            onClick={() => setTheme("light")}
          >
            <Sun className="h-6 w-6 pointer-events-none" />
            <span className="sr-only">Light mode</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to Light Mode</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-pressed={theme === "dark"}
            className="h-10 w-12 p-0"
            variant={theme === "dark" ? "secondary" : "ghost"}
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-6 w-6 pointer-events-none" />
            <span className="sr-only">Dark mode</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to Dark Mode</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
