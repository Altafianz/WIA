import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api-client.js";
import { InsightsResponse } from "@danaterbuka/shared";

export function useInsights(region: string, year: number) {
  return useQuery<InsightsResponse>({
    queryKey: ["insights", region, year],
    queryFn: () =>
      fetchApi<InsightsResponse>("/api/insights", { region, year }),
    enabled: Boolean(region && year),
  });
}
