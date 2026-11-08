import React, { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
    <>
      <PageMeta
        title={c.metaTitle}
        description={c.description}
        path="/glosarium"
      />

      <div className="w-full py-8">
        <h1 className="type-display mb-3">{c.title}</h1>
        <p className="prose-readable mb-6 text-base text-text-muted">{c.description}</p>

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
    </>
  );
}
