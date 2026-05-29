import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ActiveBadge,
  RatingBadge,
  SkillsCell,
} from "@/components/dashboard-grid/cells";
import { TooltipProvider } from "@/components/ui/tooltip";

describe("dashboard grid cells", () => {
  it("renders active and inactive labels", () => {
    const { rerender } = render(<ActiveBadge value />);

    expect(screen.getByText("Active")).toBeInTheDocument();

    rerender(<ActiveBadge value={false} />);

    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("formats ratings to one decimal place", () => {
    render(<RatingBadge value={4.567} />);

    expect(screen.getByText("4.6")).toBeInTheDocument();
  });

  it("shows the first two skills and remaining count", () => {
    render(
      <TooltipProvider>
        <SkillsCell value={["React", "Node.js", "TypeScript"]} />
      </TooltipProvider>,
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });

  it("renders the skills cell with a tooltip trigger", () => {
    const skills = ["React", "Node.js", "TypeScript"];
    render(
      <TooltipProvider>
        <SkillsCell value={skills} />
      </TooltipProvider>,
    );

    const trigger = screen.getByText("React").closest("div");
    expect(trigger).toBeInTheDocument();
  });
});
