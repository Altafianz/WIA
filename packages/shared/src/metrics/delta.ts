import { round1 } from "./round.js";

/**
 * M-06: Perbedaan absolut dan persentase
 * delta = a - b
 * deltaPercent = (b === null || b === 0) ? null : round1((a - b) / b * 100)
 */
export function calculateDelta(
  a: number,
  b: number
): { delta: number; deltaPercent: number | null } {
  const delta = a - b;
  const deltaPercent = b === 0 ? null : round1((delta / b) * 100);
  return { delta, deltaPercent };
}
