import React from "react";
import { Inbox } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";

interface EmptyStateProps {
  onResetYear?: () => void;
  title?: string;
  description?: string;
}

export function EmptyState({
  onResetYear,
  title = copy.states.emptyTitle,
  description = copy.states.emptyDescription,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center"
      data-testid="empty-state"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Inbox className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold text-text">{title}</h2>
      <p className="max-w-content text-sm text-text-muted">{description}</p>
      {onResetYear && (
        <Button variant="secondary" size="sm" onClick={onResetYear}>
          {copy.states.backToAvailableYear}
        </Button>
      )}
    </div>
  );
}
