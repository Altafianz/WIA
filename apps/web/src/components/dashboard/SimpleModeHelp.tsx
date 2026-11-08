import React from "react";
import { copy } from "../../content/copy.id.js";
import { Card } from "../ui/Card.js";

interface SimpleModeHelpProps {
  className?: string;
}

export function SimpleModeHelp({ className = "" }: SimpleModeHelpProps) {
  return (
    <Card
      className={["border-brand-600 bg-brand-50 flex flex-col gap-1", className]
        .filter(Boolean)
        .join(" ")}
      padding="sm"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true">💡</span>
        <h2 className="text-sm font-semibold text-brand-700">
          {copy.dashboard.simpleModeHelpTitle}
        </h2>
      </div>
      <p className="text-xs text-text-muted leading-relaxed">
        {copy.dashboard.simpleModeHelpBody}
      </p>
    </Card>
  );
}

