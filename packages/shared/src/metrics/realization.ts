import { round1 } from "./round.js";

/**
 * M-01: Persentase realisasi anggaran
 * realisasi === null || pagu <= 0 ? null : round1(realisasi / pagu * 100)
 */
export function calculateRealizationRate(
  realisasi: number | null,
  pagu: number
): number | null {
  if (realisasi === null || pagu <= 0) {
    return null;
  }
  return round1((realisasi / pagu) * 100);
}

/**
 * M-02: Sisa anggaran (gap)
 * realisasi === null ? null : pagu - realisasi
 */
export function calculateRemainingBudget(
  pagu: number,
  realisasi: number | null
): number | null {
  if (realisasi === null) {
    return null;
  }
  return pagu - realisasi;
}
