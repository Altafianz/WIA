import fs from "node:fs";
import {
  BudgetRecord,
  Region,
  Sector,
  SnapshotSchema,
  SourceMeta,
  SourceMetaSchema,
} from "@danaterbuka/shared";
import { BudgetRepository } from "./budget-repository.js";
import { SNAPSHOT_PATH } from "../config/constants.js";

export class SnapshotRepository implements BudgetRepository {
  private meta: SourceMeta;
  private regions: Region[];
  private sectors: Sector[];
  private records: BudgetRecord[];
  private regionBySlug = new Map<string, Region>();

  constructor(snapshotPath: string = SNAPSHOT_PATH) {
    const raw = fs.readFileSync(snapshotPath, "utf-8");
    const snapshot = SnapshotSchema.parse(JSON.parse(raw));
    const source = snapshot.sources[0];

    if (!source) {
      throw new Error("SNAPSHOT_INVALID: sources kosong");
    }

    this.meta = SourceMetaSchema.parse({
      ...source,
      dataStatus: "ready",
      recordCount: snapshot.records.length,
    });
    this.regions = snapshot.regions;
    this.sectors = snapshot.sectors;
    this.records = snapshot.records;

    for (const region of this.regions) {
      this.regionBySlug.set(region.slug, region);
    }
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
      result = result.filter((record) => record.regionId === region.regionId);
    }

    if (filter?.fiscalYear !== undefined) {
      result = result.filter((record) => record.fiscalYear === filter.fiscalYear);
    }

    return result;
  }
}
