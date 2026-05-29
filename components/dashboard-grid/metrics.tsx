import { Card, CardContent } from "@/components/ui/card";
import { currencyFormatter, type AssessmentMetrics } from "@/lib/assessment";

type MetricsSummaryProps = {
  metrics: AssessmentMetrics;
};

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <MetricCard label="Employees" value={String(metrics.employeeCount)} />
      <MetricCard label="Active employees" value={String(metrics.activeCount)} />
      <MetricCard
        label="Average rating"
        value={metrics.averageRating.toFixed(1)}
      />
      <MetricCard
        label="Average salary"
        value={currencyFormatter.format(metrics.averageSalary)}
      />
      <MetricCard
        label="Projects completed"
        value={String(metrics.projectsCompleted)}
      />
      <MetricCard label="Departments" value={String(metrics.departmentCount)} />
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-normal text-card-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
