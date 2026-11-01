export function round1(x: number): number {
  return Math.round((x + Number.EPSILON) * 10) / 10;
}
