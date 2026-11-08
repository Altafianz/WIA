import React from "react";
import { copy } from "../../content/copy.id.js";
import { Button } from "../ui/Button.js";
import { Input } from "../ui/Input.js";

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
    <div className="sticky top-16 z-10 -mx-1 bg-bg px-1 py-3 md:top-header">
      <div className="flex items-center gap-2">
        <label htmlFor="glossary-search" className="sr-only">
          {c.searchLabel}
        </label>
        <Input
          id="glossary-search"
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={c.searchPlaceholder}
          aria-label={c.searchLabel}
          className="flex-1"
        />
        {value && (
          <Button variant="secondary" size="sm" onClick={onClear}>
            {c.clearSearch}
          </Button>
        )}
      </div>
      <p
        aria-live="polite"
        aria-atomic="true"
        className="mt-2 text-sm text-text-muted"
      >
        {resultText}
      </p>
    </div>
  );
}
