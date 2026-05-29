"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  minStepsBetweenThumbs = 1,
  trackColors,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  trackColors?: string[];
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  const trackStyle = React.useMemo(() => {
    if (!trackColors || trackColors.length !== _values.length + 1) return undefined;
    const percentages = _values.map((v) => ((v - min) / (max - min)) * 100);
    
    // Build gradient string
    // color0 0% -> p0, color1 p0 -> p1, color2 p1 -> p2, color3 p2 -> 100%
    const stops: string[] = [];
    stops.push(`${trackColors[0]} 0%`, `${trackColors[0]} ${percentages[0]}%`);
    for (let i = 0; i < percentages.length - 1; i++) {
      stops.push(`${trackColors[i + 1]} ${percentages[i]}%`, `${trackColors[i + 1]} ${percentages[i + 1]}%`);
    }
    stops.push(`${trackColors[trackColors.length - 1]} ${percentages[percentages.length - 1]}%`, `${trackColors[trackColors.length - 1]} 100%`);

    return {
      background: `linear-gradient(to right, ${stops.join(", ")})`
    };
  }, [_values, min, max, trackColors]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        style={trackStyle}
      >
        {!trackColors && (
          <SliderPrimitive.Range
            data-slot="slider-range"
            className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        )}
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="relative block size-4 shrink-0 rounded-full border border-ring/50 bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] select-none hover:ring-2 focus-visible:ring-2 focus-visible:outline-hidden active:ring-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
