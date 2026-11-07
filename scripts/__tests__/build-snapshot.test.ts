import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildSnapshot,
  checkBuildResult,
  writeBuildResult,
} from "../lib/build.js";

const rawDir = path.resolve(import.meta.dirname, "..", "..", "data", "raw");
const hasRaw = fs.existsSync(rawDir);

describe.skipIf(!hasRaw)("build-snapshot dengan berkas DJPK", () => {
  it("menghasilkan snapshot 28 wilayah dan nilai acuan Jawa Barat 2024", async () => {
    const result = await buildSnapshot({ rawDir });

    expect(result.snapshot.regions).toHaveLength(28);
    expect(result.snapshot.sectors).toHaveLength(9);
    expect(result.snapshot.records).toHaveLength(1507);
    expect(result.snapshot.records.filter((record) => record.realisasi !== null)).toHaveLength(
      1003,
    );
    expect(result.quality.received).toBe(1507);
    expect(result.quality.accepted).toBe(1507);
    expect(result.quality.rejected).toBe(0);
    expect(result.quality.warnings).toBe(17);
    expect(result.quality.reasons).toContainEqual(
      expect.objectContaining({ code: "ASSUMED_ZERO", count: 17 }),
    );

    const westJava = result.snapshot.regions.find(
      (region) => region.name === "Provinsi Jawa Barat",
    );
    expect(westJava?.slug).toBe("provinsi-jawa-barat");

    const records2024 = result.snapshot.records.filter(
      (record) => record.regionId === westJava?.regionId && record.fiscalYear === 2024,
    );
    expect(records2024.reduce((total, record) => total + record.pagu, 0)).toBe(
      36_785_159_275_740,
    );
    expect(
      records2024.reduce((total, record) => total + (record.realisasi ?? 0), 0),
    ).toBe(35_548_852_207_356);
    expect(
      records2024.find((record) => record.sectorId === "F10")?.pagu,
    ).toBe(11_827_858_888_677);
    expect(
      records2024.find((record) => record.sectorId === "F01")?.pagu,
    ).toBe(18_682_087_096_156);

    const records2025 = result.snapshot.records.filter(
      (record) => record.regionId === westJava?.regionId && record.fiscalYear === 2025,
    );
    expect(records2025.every((record) => record.realisasi === null)).toBe(true);
    expect(records2025.every((record) => record.periodStatus === "approved")).toBe(true);

    const count2021 = result.snapshot.records.filter(
      (record) => record.fiscalYear === 2021,
    ).length;
    expect(count2021).toBe(247);
  });

  it("menulis snapshot atomik dan memeriksa hash tanpa menulis ulang", async () => {
    const result = await buildSnapshot({ rawDir });
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "danaterbuka-data-"));

    try {
      writeBuildResult(result, outDir);
      expect(checkBuildResult(result, outDir)).toBe(true);
      expect(fs.statSync(path.join(outDir, "snapshot.v1.json")).size).toBeLessThanOrEqual(
        2 * 1024 * 1024,
      );
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });
});
