import React from "react";
import { Lightbulb } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { Card } from "../ui/Card.js";

interface SimpleModeHelpProps {
  className?: string;
}

export function SimpleModeHelp({ className = "" }: SimpleModeHelpProps) {
  return (
    <Card
      className={["flex flex-col gap-2 border-brand-200 bg-brand-50", className]
        .filter(Boolean)
        .join(" ")}
      padding="sm"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-brand-700"
        >
          <Lightbulb className="h-4 w-4" />
        </span>
        <h2 className="text-base font-bold text-brand-900">
          {copy.dashboard.simpleModeHelpTitle}
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-brand-900">
        {copy.dashboard.simpleModeHelpBody}
      </p>
    </Card>
  );
}
