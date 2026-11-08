import React from "react";
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
        <span aria-hidden="true">💡</span>
        <h2 className="text-base font-semibold text-brand-800">
          {copy.dashboard.simpleModeHelpTitle}
        </h2>
      </div>
      <p className="text-base leading-relaxed text-text-muted">
        {copy.dashboard.simpleModeHelpBody}
      </p>
    </Card>
  );
}

