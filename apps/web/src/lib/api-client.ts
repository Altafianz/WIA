export class ApiClientError extends Error {
  code: string;
  status?: number;
  requestId?: string;
  details?: unknown;

  constructor(
    message: string,
    code: string,
    requestId?: string,
    details?: unknown,
    status?: number
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.requestId = requestId;
    this.details = details;
    this.status = status;
  }
}

export interface FetchApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: Record<string, string | number | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function fetchApi<T>(
  endpoint: string,
  optionsOrParams?:
    | FetchApiRequestOptions
    | Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`,
    window.location.origin
  );

  let method = "GET";
  let body: string | undefined;
  let customHeaders: Record<string, string> = {};

  if (optionsOrParams) {
    if ("method" in optionsOrParams || "body" in optionsOrParams) {
      const opts = optionsOrParams as FetchApiRequestOptions;
      method = opts.method || "GET";
      if (opts.params) {
        for (const [key, val] of Object.entries(opts.params)) {
          if (val !== undefined && val !== null && val !== "") {
            url.searchParams.set(key, String(val));
          }
        }
      }
      if (opts.body !== undefined) {
        body = JSON.stringify(opts.body);
        customHeaders["Content-Type"] = "application/json";
      }
      if (opts.headers) {
        customHeaders = { ...customHeaders, ...opts.headers };
      }
    } else {
      for (const [key, val] of Object.entries(
        optionsOrParams as Record<string, string | number | undefined>
      )) {
        if (val !== undefined && val !== null && val !== "") {
          url.searchParams.set(key, String(val));
        }
      }
    }
  }

  const res = await window.fetch(url.toString(), {
    method,
    headers: {
      Accept: "application/json",
      ...customHeaders,
    },
    body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorObj = data?.error;
    const message = errorObj?.message || `HTTP ${res.status}: Gagal memuat data`;
    const code = errorObj?.code || "INTERNAL_ERROR";
    const reqId =
      errorObj?.requestId || res.headers.get("x-request-id") || undefined;
    throw new ApiClientError(
      message,
      code,
      reqId,
      errorObj?.details,
      res.status
    );
  }

  return data as T;
}
