import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRepository, SnapshotRepository } from "../repositories/index.js";

const fixturesDir = path.resolve(
  import.meta.dirname,
  "..",
  "..",
  "..",
  "..",
  "data",
  "fixtures",
);

const snapshotFixture = {
  schemaVersion: "1.0.0",
  generatedAt: "2026-11-06T00:00:00.000Z",
  contentHash: "a".repeat(64),
  sources: [
    {
      sourceId: "SRC-DJPK-APBD",
      sourceName: "DJPK Kementerian Keuangan RI",
      sourceUrl: "https://djpk.kemenkeu.go.id/",
      retrievedAt: "2026-11-06T00:00:00.000Z",
      sourceUpdatedAt: "2026-11-06T00:00:00.000Z",
      license: "Tidak dinyatakan pada berkas sumber",
      licenseUrl: null,
      attribution: "Sumber data: DJPK Kementerian Keuangan RI.",
      isFixture: false,
      snapshotVersion: "1.0.0",
    },
  ],
  regions: [
    {
      regionId: "ID-PEM-1000",
      slug: "provinsi-jawa-barat",
      name: "Provinsi Jawa Barat",
      level: "province",
      parentRegionId: null,
      bpsCode: null,
      hasData: true,
      isFixture: false,
    },
  ],
  sectors: [
    {
      sectorId: "F01",
      name: "Pelayanan Umum",
      shortName: "Pelayanan",
      description: "Belanja untuk pelayanan umum dan pemerintahan daerah.",
      iconKey: "general",
      colorToken: "sector-1",
      sortOrder: 1,
      isFixture: false,
    },
  ],
  records: [
    {
      recordId: "REC-1",
      regionId: "ID-PEM-1000",
      sectorId: "F01",
      fiscalYear: 2024,
      pagu: 100,
      realisasi: 75,
      periodStatus: "final",
      realizationAsOf: null,
      sourceId: "SRC-DJPK-APBD",
      updatedAt: "2026-11-06T00:00:00.000Z",
      isFixture: false,
    },
  ],
};

function writeSnapshot(content: unknown): string {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "danaterbuka-snapshot-"));
  const filePath = path.join(directory, "snapshot.v1.json");
  fs.writeFileSync(filePath, JSON.stringify(content));
  return filePath;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SnapshotRepository", () => {
  it("memuat meta, wilayah, sektor, dan record dari snapshot", () => {
    const repo = new SnapshotRepository(writeSnapshot(snapshotFixture));

    expect(repo.getMeta().isFixture).toBe(false);
    expect(repo.getMeta().dataStatus).toBe("ready");
    expect(repo.getMeta().recordCount).toBe(1);
    expect(repo.listRegions()).toHaveLength(1);
    expect(repo.listSectors()).toHaveLength(1);
    expect(repo.getRecords({ regionSlug: "provinsi-jawa-barat", fiscalYear: 2024 })).toHaveLength(
      1,
    );
    expect(repo.getRecords({ regionSlug: "tidak-ada" })).toHaveLength(0);
    expect(repo.getRecords({ fiscalYear: 2025 })).toHaveLength(0);
  });

  it("menolak snapshot tidak valid", () => {
    const invalid = writeSnapshot({ schemaVersion: "1.0.0" });
    expect(() => new SnapshotRepository(invalid)).toThrow();
  });

  it("fallback ke fixture dengan dataStatus degraded saat snapshot invalid", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const invalid = writeSnapshot({ invalid: true });

    const repo = createRepository({
      adapter: "snapshot",
      snapshotPath: invalid,
      fixturesDir,
    });

    expect(repo.getMeta().isFixture).toBe(true);
    expect(repo.getMeta().dataStatus).toBe("degraded");
    expect(repo.getMeta().recordCount).toBe(150);
  });
});
