import React from "react";
import { Search } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";

const c = copy.glossary;

interface GlossarySearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultCount: number;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function GlossarySearch({
  value,
  onChange,
  onClear,
  resultCount,
  inputRef,
}: GlossarySearchProps) {
  const resultText = c.resultCount.replace("{n}", String(resultCount));

  return (
    <div className="sticky top-16 z-20 bg-bg py-3 md:top-header">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="glossary-search" className="sr-only">
            {c.searchLabel}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
          />
          <input
            id="glossary-search"
            ref={inputRef}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={c.searchPlaceholder}
            aria-label={c.searchLabel}
            className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 text-base text-text shadow-sm placeholder:text-text-muted transition-colors duration-150 hover:border-border-strong"
          />
        </div>
        {value && (
          <Button variant="secondary" size="sm" onClick={onClear} className="self-start sm:self-auto">
            {c.clearSearch}
          </Button>
        )}
        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-sm font-medium text-text-muted sm:ml-auto sm:whitespace-nowrap"
        >
          {resultText}
        </p>
      </div>
    </div>
  );
}
