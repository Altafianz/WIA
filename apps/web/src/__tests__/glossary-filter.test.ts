import { describe, expect, it } from "vitest";
import { filterGlossary } from "../lib/glossary-filter.js";

describe("filterGlossary (FR-051, AC-051)", () => {
  it("finds SILPA with a lowercase query", () => {
    const results = filterGlossary("silpa");

    expect(results).toHaveLength(1);
    expect(results[0]?.term).toBe("SILPA");
  });

  it("returns no entries for an unknown query", () => {
    expect(filterGlossary("xyz")).toEqual([]);
  });

  it("ignores leading and trailing spaces", () => {
    const results = filterGlossary("   realisasi   ");

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((entry) => entry.term === "Realisasi")).toBe(true);
  });

  it("matches words inside examples as well as terms", () => {
    const results = filterGlossary("pajak");

    expect(results.some((entry) => entry.term === "Pendapatan")).toBe(true);
  });

  it("returns every entry in alphabetical order for an empty query", () => {
    const results = filterGlossary("");

    expect(results.length).toBeGreaterThanOrEqual(15);
    const sorted = [...results].sort((a, b) =>
      a.term.localeCompare(b.term, "id"),
    );
    expect(results.map((entry) => entry.term)).toEqual(
      sorted.map((entry) => entry.term),
    );
  });
});
