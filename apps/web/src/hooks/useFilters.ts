import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import { DEFAULT_REGION_SLUG, DEFAULT_FISCAL_YEAR } from "@danaterbuka/shared";

export interface FiltersState {
  region: string;
  year: number;
  sector: string;
}

export function useFilters(validYears?: number[], validRegionSlugs?: string[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawRegion = searchParams.get("region");
  const rawYear = searchParams.get("year");
  const sector = searchParams.get("sector") || "all";

  let region = rawRegion || DEFAULT_REGION_SLUG;
  if (validRegionSlugs && validRegionSlugs.length > 0 && !validRegionSlugs.includes(region)) {
    region = DEFAULT_REGION_SLUG;
  }

  let year = DEFAULT_FISCAL_YEAR;
  if (rawYear) {
    const parsed = parseInt(rawYear, 10);
    if (!isNaN(parsed) && (!validYears || validYears.includes(parsed))) {
      year = parsed;
    }
  }

  const setRegion = useCallback(
    (newRegion: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("region", newRegion);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setYear = useCallback(
    (newYear: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("year", String(newYear));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setSector = useCallback(
    (newSector: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (newSector === "all") {
            next.delete("sector");
          } else {
            next.set("sector", newSector);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return {
    region,
    year,
    sector,
    setRegion,
    setYear,
    setSector,
  };
}
