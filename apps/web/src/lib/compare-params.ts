import { DEFAULT_FISCAL_YEAR, DEFAULT_REGION_SLUG } from "@danaterbuka/shared";

export type CompareMode = "region" | "year";

export interface CompareRegionOption {
  slug: string;
  hasData: boolean;
}

export interface RawCompareInput {
  mode: string | null;
  a: string | null;
  b: string | null;
  year: string | null;
  yearA: string | null;
  yearB: string | null;
}

export interface CompareOptions {
  regions: CompareRegionOption[];
  years: number[];
  defaultRegion?: string;
  defaultYear?: number;
}

export interface ResolvedCompareParams {
  mode: CompareMode;
  a: string;
  b: string;
  year: number;
  yearA: number;
  yearB: number;
  needsReplace: boolean;
  regionCollision: boolean;
  yearCollision: boolean;
}

function parseYear(
  raw: string | null,
  fallback: number,
  validYears: number[]
): number {
  if (raw === null || raw.length === 0) return fallback;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && validYears.includes(parsed) ? parsed : fallback;
}

function pickOtherRegion(
  current: string,
  regions: CompareRegionOption[]
): string {
  const selectable = regions.filter((region) => region.hasData);
  const candidates = selectable.length > 0 ? selectable : regions;
  return candidates.find((region) => region.slug !== current)?.slug ?? current;
}

/**
 * Resolves compare URL params and flags EC-11 collisions so the page can
 * correct them with a replace navigation and a toast.
 */
export function resolveCompareParams(
  raw: RawCompareInput,
  options: CompareOptions
): ResolvedCompareParams {
  const years =
    options.years.length > 0 ? options.years : [DEFAULT_FISCAL_YEAR];
  const fallbackYear =
    options.defaultYear && years.includes(options.defaultYear)
      ? options.defaultYear
      : years[years.length - 1];

  const knownSlugs = options.regions.map((region) => region.slug);
  const selectableSlugs = options.regions
    .filter((region) => region.hasData)
    .map((region) => region.slug);
  const fallbackRegion =
    options.defaultRegion && selectableSlugs.includes(options.defaultRegion)
      ? options.defaultRegion
      : selectableSlugs[0] ?? options.defaultRegion ?? DEFAULT_REGION_SLUG;

  const mode: CompareMode = raw.mode === "year" ? "year" : "region";
  let needsReplace = raw.mode !== mode;

  const a = raw.a && knownSlugs.includes(raw.a) ? raw.a : fallbackRegion;
  if (raw.a !== a) needsReplace = true;

  let regionCollision = false;
  let b: string;
  if (raw.b !== null && raw.b.length > 0) {
    if (raw.b === a) {
      b = pickOtherRegion(a, options.regions);
      regionCollision = true;
      needsReplace = true;
    } else if (knownSlugs.includes(raw.b)) {
      b = raw.b;
    } else {
      b = pickOtherRegion(a, options.regions);
      needsReplace = true;
    }
  } else {
    b = pickOtherRegion(a, options.regions);
    needsReplace = true;
  }

  if (b === a) {
    b = pickOtherRegion(a, options.regions);
    if (raw.b !== null && raw.b === a) regionCollision = true;
  }

  const fallbackYearA =
    [...years].reverse().find((value) => value < fallbackYear) ??
    years[0] ??
    fallbackYear;
  const yearA = parseYear(raw.yearA, fallbackYearA, years);
  const year = parseYear(raw.year, fallbackYear, years);
  let yearB = parseYear(raw.yearB, fallbackYear, years);
  let yearCollision = false;

  if (yearA === yearB) {
    const otherYear = years.find((value) => value !== yearA);
    if (otherYear !== undefined) {
      yearB = otherYear;
      if (raw.yearA !== null && raw.yearB !== null) yearCollision = true;
      needsReplace = true;
    }
  }

  if (raw.year !== String(year)) needsReplace = true;
  if (raw.yearA !== String(yearA)) needsReplace = true;
  if (raw.yearB !== String(yearB)) needsReplace = true;

  return {
    mode,
    a,
    b,
    year,
    yearA,
    yearB,
    needsReplace,
    regionCollision,
    yearCollision,
  };
}

export function buildCompareSearchParams(params: ResolvedCompareParams): URLSearchParams {
  return new URLSearchParams({
    mode: params.mode,
    a: params.a,
    b: params.b,
    year: String(params.year),
    yearA: String(params.yearA),
    yearB: String(params.yearB),
  });
}
