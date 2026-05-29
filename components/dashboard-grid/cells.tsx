import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ActiveBadge({ value }: { value: boolean }) {
  return (
    <Badge tone={value ? "green" : "zinc"}>
      {value ? "Active" : "Inactive"}
    </Badge>
  );
}

export function RatingBadge({ value }: { value: number }) {
  const tone = value >= 4.5 ? "violet" : value >= 4 ? "cyan" : "amber";

  return <Badge tone={tone}>{value.toFixed(1)}</Badge>;
}

export function SkillsCell({ value }: { value: string[] }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex h-full items-center gap-1.5 overflow-hidden">
          {value.slice(0, 2).map((skill) => (
            <Badge key={skill} tone="zinc">
              {skill}
            </Badge>
          ))}
          {value.length > 2 ? (
            <span className="text-xs text-muted-foreground">
              +{value.length - 2}
            </span>
          ) : null}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{value.join(", ")}</p>
      </TooltipContent>
    </Tooltip>
  );
}
