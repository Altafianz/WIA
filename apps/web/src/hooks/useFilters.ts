import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_FISCAL_YEAR } from "@danaterbuka/shared";
import { resolveFilters } from "../lib/filters.js";
import { copy } from "../content/copy.id.js";

export function useFilters(
  validYears?: number[],
  validRegionSlugs?: string[],
  defaultYear: number = DEFAULT_FISCAL_YEAR,
  defaultRegion?: string
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [correctionMessage, setCorrectionMessage] = useState<string | null>(null);

  const rawRegion = searchParams.get("region");
  const rawYear = searchParams.get("year");
  const rawSector = searchParams.get("sector");

  const { region, year, sector, regionCorrected, yearCorrected } = resolveFilters(
    { region: rawRegion, year: rawYear, sector: rawSector },
    { validYears, validRegionSlugs, defaultYear, defaultRegion }
  );

  useEffect(() => {
    if (!regionCorrected && !yearCorrected) return;

    setCorrectionMessage(copy.states.filterCorrected);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("region", region);
        next.set("year", String(year));
        return next;
      },
      { replace: true }
    );
  }, [regionCorrected, yearCorrected, region, year, setSearchParams]);

  const dismissCorrection = useCallback(() => {
    setCorrectionMessage(null);
  }, []);

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
    correctionMessage,
    dismissCorrection,
  };
}
