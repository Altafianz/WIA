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
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center"
        data-testid="glossary-empty"
      >
        <h2 className="text-xl font-bold text-text">{c.emptyTitle}</h2>
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
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      data-query={query}
    >
      {terms.map((entry) => (
        <div
          key={entry.term}
          className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md motion-reduce:hover:translate-y-0"
        >
          <dt className="mb-1.5 text-lg font-bold tracking-tight text-text">
            {entry.term}
          </dt>
          <dd className="mb-2 text-sm leading-relaxed text-text-muted">
            {entry.simpleDefinition}
          </dd>
          {entry.example && (
            <dd className="mb-2 text-sm leading-relaxed text-text-muted">
              <span className="font-semibold text-text">{c.exampleLabel}</span>{" "}
              {entry.example}
            </dd>
          )}
          {entry.relatedTerms.length > 0 && (
            <dd className="mt-auto flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm text-text-muted">{c.relatedLabel}</span>
              {entry.relatedTerms.map((related) => (
                <button
                  key={related}
                  type="button"
                  onClick={() => onSelectTerm(related)}
                  className="inline-flex min-h-[30px] items-center rounded-full border border-border bg-surface px-2.5 py-1 text-sm font-medium text-text transition-colors duration-150 hover:border-brand-600 hover:bg-brand-50 hover:text-brand-800"
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
