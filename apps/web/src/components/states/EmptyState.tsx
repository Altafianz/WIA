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
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm"
      data-testid="empty-state"
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-brand-600"
      >
        <Inbox className="h-7 w-7" />
      </span>
      <h2 className="type-h3">{title}</h2>
      <p className="prose-readable text-sm text-text-muted">{description}</p>
      {onResetYear && (
        <Button variant="secondary" onClick={onResetYear}>
          {copy.states.backToAvailableYear}
        </Button>
      )}
    </div>
  );
}
