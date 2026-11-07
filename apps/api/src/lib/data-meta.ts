import type { BudgetRepository } from "../repositories/budget-repository.js";
import { env } from "../env.js";

export function getAvailableYears(repo: BudgetRepository): number[] {
  return [...new Set(repo.getRecords().map((record) => record.fiscalYear))].sort(
    (a, b) => a - b,
  );
}

export function getLatestFinalYear(repo: BudgetRepository): number {
  const yearsWithRealization = repo
    .getRecords()
    .filter((record) => record.realisasi !== null)
    .map((record) => record.fiscalYear);

  if (yearsWithRealization.length > 0) {
    return Math.max(...yearsWithRealization);
  }

  const availableYears = getAvailableYears(repo);
  return availableYears.at(-1) ?? new Date().getFullYear();
}

export function getDefaultRegionSlug(repo: BudgetRepository): string {
  const regions = repo.listRegions();
  const configured = regions.find((region) => region.slug === env.DEFAULT_REGION_SLUG);
  if (configured) return configured.slug;

  return regions.find((region) => region.hasData)?.slug ?? regions[0]?.slug ?? env.DEFAULT_REGION_SLUG;
}
