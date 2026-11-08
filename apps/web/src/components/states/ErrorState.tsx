import React from "react";
import { AlertTriangle } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";

interface ErrorStateProps {
  onRetry?: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-danger-200 bg-card px-6 py-16 text-center shadow-sm"
      data-testid="error-state"
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-50 text-danger-600"
      >
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h2 className="type-h3 text-danger-700">{copy.states.errorTitle}</h2>
      <p className="prose-readable text-sm text-text-muted">
        {copy.states.errorDescription}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {copy.states.retryButton}
        </Button>
      )}
    </div>
  );
}
