import { DEFAULT_FISCAL_YEAR, DEFAULT_REGION_SLUG } from "@danaterbuka/shared";

export interface RawFilterInput {
  region: string | null;
  year: string | null;
  sector: string | null;
}

export interface FilterOptions {
  validYears?: number[];
  validRegionSlugs?: string[];
  defaultRegion?: string;
  defaultYear?: number;
}

export interface ResolvedFilters {
  region: string;
  year: number;
  sector: string;
  regionCorrected: boolean;
  yearCorrected: boolean;
}

function pickDefaultYear(validYears: number[] | undefined, fallback: number): number {
  if (!validYears || validYears.length === 0) return fallback;
  if (validYears.includes(fallback)) return fallback;
  return validYears[validYears.length - 1] ?? fallback;
}

/**
 * Resolves URL filters to safe values and reports whether FR-022 correction is needed.
 * Pure function so the correction rules can be unit tested without a DOM.
 */
export function resolveFilters(
  raw: RawFilterInput,
  options: FilterOptions = {}
): ResolvedFilters {
  const defaultRegion = options.defaultRegion ?? DEFAULT_REGION_SLUG;
  const defaultYear = pickDefaultYear(options.validYears, options.defaultYear ?? DEFAULT_FISCAL_YEAR);

  let region = defaultRegion;
  let regionCorrected = false;

  if (raw.region !== null) {
    const isKnown =
      options.validRegionSlugs && options.validRegionSlugs.length > 0
        ? options.validRegionSlugs.includes(raw.region)
        : raw.region.length > 0;
    if (isKnown) {
      region = raw.region;
    } else {
      regionCorrected = true;
    }
  }

  let year = defaultYear;
  let yearCorrected = false;

  if (raw.year !== null) {
    const parsed = Number(raw.year);
    const isKnown =
      Number.isInteger(parsed) &&
      (options.validYears && options.validYears.length > 0
        ? options.validYears.includes(parsed)
        : true);
    if (isKnown) {
      year = parsed;
    } else {
      yearCorrected = true;
    }
  }

  return {
    region,
    year,
    sector: raw.sector && raw.sector.length > 0 ? raw.sector : "all",
    regionCorrected,
    yearCorrected,
  };
}
