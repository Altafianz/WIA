import React from "react";
import type { GlossaryEntry } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";

const c = copy.glossary;

interface GlossaryListProps {
  terms: GlossaryEntry[];
  query: string;
  onSelectTerm: (term: string) => void;
  onClear: () => void;
}

export function GlossaryList({
  terms,
  query,
  onSelectTerm,
  onClear,
}: GlossaryListProps) {
  if (terms.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-3 py-16 text-center"
        data-testid="glossary-empty"
      >
        <h2 className="text-lg font-semibold text-text">{c.emptyTitle}</h2>
        <p className="max-w-content text-sm text-text-muted">
          {c.emptyDescription}
        </p>
        <Button variant="primary" size="sm" onClick={onClear}>
          {c.clearSearch}
        </Button>
      </div>
    );
  }

  return (
    <dl
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      data-query={query}
    >
      {terms.map((entry) => (
        <div
          key={entry.term}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <dt className="mb-1 text-base font-semibold text-text">
            {entry.term}
          </dt>
          <dd className="mb-2 text-sm text-text-muted">
            {entry.simpleDefinition}
          </dd>
          {entry.example && (
            <dd className="mb-2 text-sm text-text-muted">
              <span className="font-medium">{c.exampleLabel}</span>{" "}
              {entry.example}
            </dd>
          )}
          {entry.relatedTerms.length > 0 && (
            <dd className="mt-2 flex flex-wrap gap-2">
              <span className="self-center text-xs text-text-muted">
                {c.relatedLabel}
              </span>
              {entry.relatedTerms.map((related) => (
                <button
                  key={related}
                  type="button"
                  onClick={() => onSelectTerm(related)}
                  className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-text transition-colors hover:border-brand-600 hover:text-brand-600"
                >
                  {related}
                </button>
              ))}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
