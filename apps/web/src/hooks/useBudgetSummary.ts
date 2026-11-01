import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api-client.js";
import { SummaryResponse } from "@danaterbuka/shared";

export function useBudgetSummary(region: string, year: number) {
  return useQuery<SummaryResponse>({
    queryKey: ["budget", "summary", region, year],
    queryFn: () =>
      fetchApi<SummaryResponse>("/api/budget/summary", { region, year }),
    enabled: Boolean(region && year),
  });
}
