export class ApiClientError extends Error {
  code: string;
  requestId?: string;
  details?: unknown;

  constructor(message: string, code: string, requestId?: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}

export async function fetchApi<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(endpoint.startsWith("/") ? endpoint : `/${endpoint}`, window.location.origin);
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      }
    }
  }

  const res = await window.fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorObj = data?.error;
    const message = errorObj?.message || `HTTP ${res.status}: Gagal memuat data`;
    const code = errorObj?.code || "INTERNAL_ERROR";
    const reqId = errorObj?.requestId || res.headers.get("x-request-id") || undefined;
    throw new ApiClientError(message, code, reqId, errorObj?.details);
  }

  return data as T;
}
