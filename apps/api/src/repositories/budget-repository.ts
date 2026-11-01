import { Region, Sector, BudgetRecord, SourceMeta } from "@danaterbuka/shared";

export interface BudgetRepository {
  getMeta(): SourceMeta;
  listRegions(): Region[];
  listSectors(): Sector[];
  getRecords(filter?: { regionSlug?: string; fiscalYear?: number }): BudgetRecord[];
}
