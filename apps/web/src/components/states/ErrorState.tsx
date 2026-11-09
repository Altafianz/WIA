import React from "react";
import { TriangleAlert } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";

interface ErrorStateProps {
  onRetry?: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center"
      data-testid="error-state"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-danger">
        <TriangleAlert className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold text-danger">{copy.states.errorTitle}</h2>
      <p className="max-w-content text-sm text-text-muted">{copy.states.errorDescription}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {copy.states.retryButton}
        </Button>
      )}
    </div>
  );
}
