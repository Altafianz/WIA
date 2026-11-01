import React from "react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";

interface EmptyStateProps {
  onResetYear?: () => void;
}

export function EmptyState({ onResetYear }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      data-testid="empty-state"
    >
      <div className="text-4xl" aria-hidden="true">📭</div>
      <h2 className="text-lg font-semibold text-text">{copy.states.emptyTitle}</h2>
      <p className="text-sm text-text-muted max-w-content">{copy.states.emptyDescription}</p>
      {onResetYear && (
        <Button variant="secondary" size="sm" onClick={onResetYear}>
          {copy.states.backToAvailableYear}
        </Button>
      )}
    </div>
  );
}
