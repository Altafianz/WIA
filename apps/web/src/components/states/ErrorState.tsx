import React from "react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";

interface ErrorStateProps {
  onRetry?: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
      data-testid="error-state"
    >
      <div className="text-4xl" aria-hidden="true">⚠️</div>
      <h2 className="text-lg font-semibold text-danger">{copy.states.errorTitle}</h2>
      <p className="text-sm text-text-muted max-w-content">{copy.states.errorDescription}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {copy.states.retryButton}
        </Button>
      )}
    </div>
  );
}
