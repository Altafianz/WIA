/**
 * The Express app mounts every route under `/api`. Vercel may hand the
 * function a rewritten URL (for example `/api` plus a catch-all `path`
 * parameter) instead of the original request URL, so normalise it before
 * Express sees it.
 */
export function toApiUrl(
  rawUrl: string | undefined,
  pathParam?: string | string[]
): string {
  const raw = rawUrl && rawUrl.length > 0 ? rawUrl : "/";
  const queryIndex = raw.indexOf("?");
  const pathname = queryIndex === -1 ? raw : raw.slice(0, queryIndex);
  const search = queryIndex === -1 ? "" : raw.slice(queryIndex);

  const joinedParam = Array.isArray(pathParam)
    ? pathParam.filter(Boolean).join("/")
    : (pathParam ?? "");
  const suffix = joinedParam
    .replace(/^\/+/, "")
    .replace(/^api(?:\/|$)/, "");

  const isApiRoot = pathname === "/api" || pathname === "/api/index";
  const hasApiPrefix = pathname === "/api" || pathname.startsWith("/api/");

  if (hasApiPrefix && !(isApiRoot && suffix.length > 0)) {
    return raw;
  }

  if (suffix.length > 0) {
    const params = new URLSearchParams(search);
    params.delete("path");
    const nextSearch = params.toString();
    return `/api/${suffix}${nextSearch ? `?${nextSearch}` : ""}`;
  }

  if (hasApiPrefix) return raw;
  return `/api${pathname === "/" ? "" : pathname}${search}`;
}
