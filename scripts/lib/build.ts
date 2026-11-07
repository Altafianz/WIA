import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  SnapshotSchema,
  type BudgetRecord,
  type Snapshot,
  type SourceFile,
} from "@danaterbuka/shared";
import {
  SECTORS,
  aggregateRows,
  buildRegions,
  mergeYear,
  regionIdFromCode,
  type AggregatedYear,
  type Issue,
} from "./transform.js";
import {
  checksumFiles,
  discoverRawFiles,
  readRawFile,
  type RawFile,
} from "./workbook.js";

export interface BuildOptions {
  rawDir?: string;
  outDir?: string;
  prefix?: string;
  fromYear?: number;
  generatedAt?: string;
}

export interface QualityReason {
  code: string;
  count: number;
  samples: string[];
}

export interface QualityReport {
  schemaVersion: "1.0.0";
  generatedAt: string;
  source: string;
  received: number;
  accepted: number;
  rejected: number;
  warnings: number;
  reasons: QualityReason[];
  durationMs: number;
  inputChecksum: string;
  snapshotHash: string;
  files: SourceFile[];
}

export interface BuildResult {
  snapshot: Snapshot;
  quality: QualityReport;
  files: RawFile[];
}

const MAX_SNAPSHOT_BYTES = 4 * 1024 * 1024;
const SOURCE_ID = "SRC-DJPK-APBD";
const DEFAULT_PREFIX = "09,10,11,13,28";
const DEFAULT_FROM_YEAR = 2021;

function repoPath(...parts: string[]): string {
  return path.resolve(import.meta.dirname, "..", "..", ...parts);
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function latestIso(files: RawFile[]): string {
  return files
    .map((file) => file.modifiedAt)
    .sort()
    .at(-1) as string;
}

function toSourceFile(file: RawFile, sheetName: string): SourceFile {
  return {
    fileName: file.fileName,
    sheetName: sheetName.trim(),
    period: String(file.year),
    kind: file.side,
    modifiedAt: file.modifiedAt,
  };
}

function summarizeIssues(issues: Issue[], unknownSectorRows: number): QualityReason[] {
  const byCode = new Map<string, QualityReason>();

  const add = (code: string, sample: string) => {
    const existing = byCode.get(code) ?? { code, count: 0, samples: [] };
    existing.count += 1;
    if (existing.samples.length < 5) existing.samples.push(sample);
    byCode.set(code, existing);
  };

  for (const issue of issues) add(issue.code, issue.detail);
  for (let index = 0; index < unknownSectorRows; index += 1) {
    add("UNKNOWN_SECTOR", "baris fungsi tidak dikenali");
  }

  return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code));
}

function buildQualityReport(input: {
  generatedAt: string;
  accepted: number;
  rejected: number;
  issues: Issue[];
  unknownSectorRows: number;
  durationMs: number;
  inputChecksum: string;
  snapshotHash: string;
  files: SourceFile[];
}): QualityReport {
  const reasons = summarizeIssues(input.issues, input.unknownSectorRows);
  const warnings = reasons
    .filter((reason) => reason.code !== "NEGATIVE_PAGU")
    .reduce((total, reason) => total + reason.count, 0);

  return {
    schemaVersion: "1.0.0",
    generatedAt: input.generatedAt,
    source: "DJPK Kementerian Keuangan RI",
    received: input.accepted + input.rejected,
    accepted: input.accepted,
    rejected: input.rejected,
    warnings,
    reasons,
    durationMs: input.durationMs,
    inputChecksum: input.inputChecksum,
    snapshotHash: input.snapshotHash,
    files: input.files,
  };
}

export async function buildSnapshot(options: BuildOptions = {}): Promise<BuildResult> {
  const startedAt = Date.now();
  const rawDir = options.rawDir ?? repoPath("data", "raw");
  const prefix = options.prefix ?? DEFAULT_PREFIX;
  const fromYear = options.fromYear ?? DEFAULT_FROM_YEAR;
  const generatedAt = options.generatedAt ?? new Date().toISOString();

  const files = discoverRawFiles(rawDir, fromYear);
  const budgetFiles = files.filter((file) => file.side === "anggaran");
  const realizationFiles = files.filter((file) => file.side === "realisasi");

  if (budgetFiles.length === 0) {
    throw new Error(
      `Tidak ada berkas Anggaran_Belanja_Fungsi_*.xlsx di ${rawDir} untuk tahun >= ${fromYear}`,
    );
  }

  const budgetByYear = new Map<number, AggregatedYear>();
  const realizationByYear = new Map<number, AggregatedYear>();
  const sourceFiles: SourceFile[] = [];
  let unknownSectorRows = 0;

  for (const file of budgetFiles) {
    const result = await readRawFile(file, prefix);
    budgetByYear.set(file.year, aggregateRows(result.rows));
    unknownSectorRows += result.unknownSectorRows;
    sourceFiles.push(toSourceFile(file, result.sheetName));
  }

  for (const file of realizationFiles) {
    const result = await readRawFile(file, prefix);
    realizationByYear.set(file.year, aggregateRows(result.rows));
    unknownSectorRows += result.unknownSectorRows;
    sourceFiles.push(toSourceFile(file, result.sheetName));
  }

  const regions = buildRegions(budgetByYear);

  const records: BudgetRecord[] = [];
  const issues: Issue[] = [];
  let rejected = 0;
  const latest = latestIso(files);
  const sourceId = SOURCE_ID;

  for (const year of [...budgetByYear.keys()].sort((a, b) => a - b)) {
    const budget = budgetByYear.get(year);
    if (!budget) continue;

    const realization = realizationByYear.get(year) ?? null;
    const merged = mergeYear(year, budget, realization);
    issues.push(...merged.issues);
    rejected += merged.rejected;

    for (const record of merged.records) {
      const regionId = regionIdFromCode(record.regionCode);

      records.push({
        recordId: `REC-${regionId}-${record.fiscalYear}-${record.sectorId}`,
        regionId,
        sectorId: record.sectorId,
        fiscalYear: record.fiscalYear,
        pagu: record.pagu,
        realisasi: record.realisasi,
        periodStatus: record.periodStatus,
        realizationAsOf: null,
        sourceId,
        updatedAt: latest,
        isFixture: false,
      });
    }
  }

  records.sort(
    (a, b) =>
      a.fiscalYear - b.fiscalYear ||
      a.regionId.localeCompare(b.regionId) ||
      a.sectorId.localeCompare(b.sectorId),
  );

  const sourceMeta = {
    sourceId,
    sourceName: "DJPK Kementerian Keuangan RI",
    sourceUrl: "https://djpk.kemenkeu.go.id/",
    retrievedAt: latest,
    sourceUpdatedAt: latest,
    license: "Tidak dinyatakan pada berkas sumber",
    licenseUrl: null,
    attribution:
      "Sumber data: DJPK Kementerian Keuangan RI. Data diolah menjadi snapshot berkala, bukan laporan real-time.",
    isFixture: false,
    snapshotVersion: "1.0.0",
    dataStatus: "ready" as const,
    recordCount: records.length,
    sourceFiles: sourceFiles.sort(
      (a, b) => a.period.localeCompare(b.period) || a.kind.localeCompare(b.kind),
    ),
  };

  const baseSnapshot = SnapshotSchema.omit({ contentHash: true }).parse({
    schemaVersion: "1.0.0",
    generatedAt,
    sources: [sourceMeta],
    regions,
    sectors: SECTORS,
    records,
  });

  const hashable: Record<string, unknown> = { ...baseSnapshot };
  delete hashable.generatedAt;
  const hash = sha256(JSON.stringify(hashable));

  const snapshot = SnapshotSchema.parse({ ...baseSnapshot, contentHash: hash });
  const inputChecksum = sha256(checksumFiles(files));

  const quality = buildQualityReport({
    generatedAt,
    accepted: records.length,
    rejected,
    issues,
    unknownSectorRows,
    durationMs: Date.now() - startedAt,
    inputChecksum,
    snapshotHash: hash,
    files: sourceMeta.sourceFiles,
  });

  return { snapshot, quality, files };
}

function atomicWrite(filePath: string, content: string): void {
  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });
  const temporary = path.join(directory, `.${path.basename(filePath)}.${process.pid}.tmp`);
  fs.writeFileSync(temporary, content, "utf-8");
  fs.renameSync(temporary, filePath);
}

export function writeBuildResult(result: BuildResult, outDir?: string): void {
  const targetDir = outDir ?? repoPath("data", "processed");
  const snapshotContent = JSON.stringify(result.snapshot);

  if (Buffer.byteLength(snapshotContent, "utf-8") > MAX_SNAPSHOT_BYTES) {
    throw new Error(
      `Snapshot melebihi batas 4 MB (${Buffer.byteLength(snapshotContent, "utf-8")} byte)`,
    );
  }

  atomicWrite(path.join(targetDir, "snapshot.v1.json"), snapshotContent);
  atomicWrite(
    path.join(targetDir, "quality-report.json"),
    `${JSON.stringify(result.quality, null, 2)}\n`,
  );
}

export function checkBuildResult(result: BuildResult, outDir?: string): boolean {
  const targetDir = outDir ?? repoPath("data", "processed");
  const snapshotPath = path.join(targetDir, "snapshot.v1.json");

  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Snapshot belum ada: ${snapshotPath}`);
  }

  const existing = SnapshotSchema.parse(JSON.parse(fs.readFileSync(snapshotPath, "utf-8")));
  return existing.contentHash === result.snapshot.contentHash;
}
