import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api-client.js";
import { TrendResponse } from "@danaterbuka/shared";

export function useTrend(region: string) {
  return useQuery<TrendResponse>({
    queryKey: ["budget", "trend", region],
    queryFn: () =>
      fetchApi<TrendResponse>("/api/budget/trend", { region }),
    enabled: Boolean(region),
  });
}
