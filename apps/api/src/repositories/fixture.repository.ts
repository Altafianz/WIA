import fs from "node:fs";
import path from "node:path";
import {
  Region,
  Sector,
  BudgetRecord,
  SourceMeta,
  RegionSchema,
  SectorSchema,
  BudgetRecordSchema,
  SourceMetaSchema,
} from "@danaterbuka/shared";
import { BudgetRepository } from "./budget-repository.js";
import { FIXTURES_DIR } from "../config/constants.js";

export class FixtureRepository implements BudgetRepository {
  private meta: SourceMeta;
  private regions: Region[];
  private sectors: Sector[];
  private records: BudgetRecord[];
  private regionBySlug: Map<string, Region> = new Map();
  private regionById: Map<string, Region> = new Map();

  constructor(customFixturesDir?: string) {
    const dir = customFixturesDir || FIXTURES_DIR;

    const sourceRaw = JSON.parse(fs.readFileSync(path.join(dir, "sources.json"), "utf-8"));
    this.meta = SourceMetaSchema.parse(sourceRaw);

    const regionsRaw = JSON.parse(fs.readFileSync(path.join(dir, "regions.json"), "utf-8"));
    this.regions = regionsRaw.map((r: unknown) => RegionSchema.parse(r));

    const sectorsRaw = JSON.parse(fs.readFileSync(path.join(dir, "sectors.json"), "utf-8"));
    this.sectors = sectorsRaw.map((s: unknown) => SectorSchema.parse(s));

    const recordsRaw = JSON.parse(fs.readFileSync(path.join(dir, "budget-records.json"), "utf-8"));
    this.records = recordsRaw.map((rec: unknown) => BudgetRecordSchema.parse(rec));

    for (const region of this.regions) {
      this.regionBySlug.set(region.slug, region);
      this.regionById.set(region.regionId, region);
    }

    this.meta.recordCount = this.records.length;
  }

  getMeta(): SourceMeta {
    return this.meta;
  }

  listRegions(): Region[] {
    return this.regions;
  }

  listSectors(): Sector[] {
    return this.sectors;
  }

  getRecords(filter?: { regionSlug?: string; fiscalYear?: number }): BudgetRecord[] {
    let result = this.records;

    if (filter?.regionSlug) {
      const region = this.regionBySlug.get(filter.regionSlug);
      if (!region) return [];
      result = result.filter((r) => r.regionId === region.regionId);
    }

    if (filter?.fiscalYear !== undefined) {
      result = result.filter((r) => r.fiscalYear === filter.fiscalYear);
    }

    return result;
  }
}
