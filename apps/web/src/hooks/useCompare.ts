import { useQuery } from "@tanstack/react-query";
import { CompareResponse } from "@danaterbuka/shared";
import { fetchApi } from "../lib/api-client.js";
import { CompareMode } from "../lib/compare-params.js";

export interface CompareQueryParams {
  mode: CompareMode;
  a: string;
  b: string;
  year: number;
  yearA: number;
  yearB: number;
}

export function useCompare(params: CompareQueryParams) {
  const { mode, a, b, year, yearA, yearB } = params;

  return useQuery<CompareResponse>({
    queryKey: ["budget", "compare", mode, a, b, year, yearA, yearB],
    queryFn: () =>
      fetchApi<CompareResponse>("/api/budget/compare", {
        mode,
        a,
        b,
        year,
        yearA,
        yearB,
      }),
    enabled:
      Boolean(a) &&
      (mode === "region" ? Boolean(b) : Boolean(yearA && yearB)),
    staleTime: 2 * 60_000,
  });
}
