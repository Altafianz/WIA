import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "../lib/api-client.js";
import { MetaResponse } from "@danaterbuka/shared";

export function useMeta() {
  return useQuery<MetaResponse>({
    queryKey: ["meta"],
    queryFn: () => fetchApi<MetaResponse>("/api/meta"),
    staleTime: Infinity,
  });
}
