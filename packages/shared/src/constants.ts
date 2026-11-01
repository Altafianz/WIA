export const FISCAL_YEARS = [2021, 2022, 2023, 2024, 2025] as const;
export type FiscalYear = (typeof FISCAL_YEARS)[number];

export const DEFAULT_REGION_SLUG = "provinsi-nusa-utara";
export const DEFAULT_FISCAL_YEAR = 2024;
export const DEFAULT_SECTOR_SLUG = "all";
export const DEFAULT_SIMPLE_MODE = 0;
