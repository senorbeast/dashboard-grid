import { Badge } from "@/components/ui/badge";

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
    <div className="flex h-full w-full items-center justify-center gap-1.5 overflow-hidden">
      {value.slice(0, 2).map((skill) => (
        <Badge key={skill} tone="zinc">
          {skill}
        </Badge>
      ))}
      {value.length > 2 ? (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          +{value.length - 2}
        </span>
      ) : null}
    </div>
  );
}
