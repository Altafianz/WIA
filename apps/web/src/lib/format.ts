import { round1 } from "@danaterbuka/shared";

/**
 * VZ-07: formatRupiahCompact
 * Rp 2,4 T, Rp 600,0 M, Rp 12,5 jt, Rp 950
 */
export function formatRupiahCompact(value: number | null): string {
  if (value === null || value === undefined) return "-";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1e12) {
    return `${sign}Rp ${round1(abs / 1e12).toFixed(1).replace(".", ",")} T`;
  }
  if (abs >= 1e9) {
    return `${sign}Rp ${round1(abs / 1e9).toFixed(1).replace(".", ",")} M`;
  }
  if (abs >= 1e6) {
    return `${sign}Rp ${round1(abs / 1e6).toFixed(1).replace(".", ",")} jt`;
  }
  return `${sign}Rp ${abs.toLocaleString("id-ID")}`;
}

export function formatRupiahFull(value: number | null): string {
  if (value === null || value === undefined) return "-";
  const sign = value < 0 ? "-" : "";
  return `${sign}Rp ${Math.abs(value).toLocaleString("id-ID")}`;
}

export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return "-";
  return `${round1(value).toFixed(1).replace(".", ",")}%`;
}

export function formatDateId(isoString: string | null | undefined): string {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoString;
  }
}
