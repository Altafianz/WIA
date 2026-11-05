import { GLOSSARY_ENTRIES, GlossaryEntry } from "@danaterbuka/shared";

/**
 * Filter glossary entries by query string.
 * Case-insensitive, trims whitespace, matches term + simpleDefinition + example.
 * Returns entries sorted alphabetically by term (id-ID locale).
 */
export function filterGlossary(query: string): GlossaryEntry[] {
  const q = query.toLowerCase().trim();
  const base = [...GLOSSARY_ENTRIES].sort((a, b) =>
    a.term.localeCompare(b.term, "id"),
  );
  if (!q) return base;
  return base.filter(
    (e) =>
      e.term.toLowerCase().includes(q) ||
      e.simpleDefinition.toLowerCase().includes(q) ||
      e.example.toLowerCase().includes(q),
  );
}

