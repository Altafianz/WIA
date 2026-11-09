import React, { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { PageMeta } from "../lib/seo.js";
import { filterGlossary } from "../lib/glossary-filter.js";
import { copy } from "../content/copy.id.js";
import { GlossarySearch } from "../components/glossary/GlossarySearch.js";
import { GlossaryList } from "../components/glossary/GlossaryList.js";

const c = copy.glossary;

export function GlossaryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const entries = filterGlossary(q);

  const handleSearch = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set("q", value);
      } else {
        next.delete("q");
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const clearSearch = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [searchParams, setSearchParams]);

  return (
    <div className="page-gutter flex w-full flex-col gap-6 py-6 lg:gap-8 lg:py-8">
      <PageMeta
        title={c.metaTitle}
        description={c.description}
        path="/glosarium"
      />

      <header className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 sm:flex"
        >
          <BookOpen className="h-6 w-6" />
        </span>
        <div className="max-w-prose">
          <h1 className="type-h1 text-text">{c.title}</h1>
          <p className="mt-2 text-base text-text-muted">{c.description}</p>
        </div>
      </header>

      <GlossarySearch
        value={q}
        onChange={handleSearch}
        onClear={clearSearch}
        resultCount={entries.length}
        inputRef={inputRef}
      />

      <GlossaryList
        terms={entries}
        query={q}
        onSelectTerm={handleSearch}
        onClear={clearSearch}
      />
    </div>
  );
}
