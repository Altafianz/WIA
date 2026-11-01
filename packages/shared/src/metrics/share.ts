import { round1 } from "./round.js";

/**
 * M-03: Pangsa sektor terhadap total pagu
 * totalPagu <= 0 ? null : round1(sectorPagu / totalPagu * 100)
 */
export function calculateSectorShare(
  sectorPagu: number,
  totalPagu: number
): number | null {
  if (totalPagu <= 0) {
    return null;
  }
  return round1((sectorPagu / totalPagu) * 100);
}
