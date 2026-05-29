"use client";

/**
 * TopLoadingBar
 *
 * A fixed, top-of-viewport loading bar built on shadcn's <Progress> component.
 * Uses the `indeterminate` prop (added to progress.tsx) for a continuous sweep
 * animation — no fake progress math required.
 *
 * Fades out smoothly for 350ms after `isVisible` flips false before unmounting.
 */

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Props = {
  isVisible: boolean;
};

export function TopLoadingBar({ isVisible }: Props) {
  const [rendered, setRendered] = useState(isVisible);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isVisible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setRendered(true);
    } else {
      // Stay in DOM long enough for the fade-out transition
      timerRef.current = setTimeout(() => setRendered(false), 400);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible]);

  if (!rendered) return null;

  return (
    <Progress
      indeterminate
      aria-label="Loading"
      aria-busy={isVisible}
      className={cn(
        // Pin to the very top of the viewport, above everything
        "fixed top-0 left-0 right-0 z-[9999]",
        // Height & shape
        "h-[3px] rounded-none",
        // Remove the muted track so only the animated indicator is visible
        "bg-transparent",
        // Non-interactive
        "pointer-events-none",
        // Fade in/out driven by isVisible
        "transition-opacity duration-350",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
