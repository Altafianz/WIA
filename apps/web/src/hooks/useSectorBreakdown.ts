import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api-client.js";
import { BudgetSectorsResponse } from "@danaterbuka/shared";

export function useSectorBreakdown(region: string, year: number) {
  return useQuery<BudgetSectorsResponse>({
    queryKey: ["budget", "sectors", region, year],
    queryFn: () =>
      fetchApi<BudgetSectorsResponse>("/api/budget/sectors", { region, year }),
    enabled: Boolean(region && year),
  });
}
