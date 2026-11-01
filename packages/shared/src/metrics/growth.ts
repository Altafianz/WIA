import { round1 } from "./round.js";

/**
 * M-04: Pertumbuhan YoY
 * (prev === null || prev <= 0 || curr === null) ? null : round1((curr - prev) / prev * 100)
 */
export function calculateYoYGrowth(
  curr: number | null,
  prev: number | null
): number | null {
  if (prev === null || prev <= 0 || curr === null) {
    return null;
  }
  return round1(((curr - prev) / prev) * 100);
}
