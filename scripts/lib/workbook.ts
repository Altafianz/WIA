import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import {
  normalizeKey,
  normalizeRegionCode,
  normalizeRegionName,
  parseSectorId,
  type RawFunctionRow,
} from "./transform.js";

export type Side = "anggaran" | "realisasi";

export interface RawFile {
  year: number;
  side: Side;
  fileName: string;
  filePath: string;
  modifiedAt: string;
}

export interface ReadResult {
  rows: RawFunctionRow[];
  sheetName: string;
  unknownSectorRows: number;
}

// Tanggal berkas mengikuti keterangan sumber DJPK yang diberikan pengguna.
// Nilai ISO dipakai agar snapshot tetap deterministik lintas mesin.
const SOURCE_FILE_DATES: Record<string, string> = {
  "Anggaran_Belanja_Fungsi_2021.xlsx": "2021-07-13T00:00:00.000Z",
  "Realisasi_Belanja_Fungsi_2021.xlsx": "2023-01-18T00:00:00.000Z",
  "Anggaran_Belanja_Fungsi_2022.xlsx": "2022-08-22T00:00:00.000Z",
  "Realisasi_Belanja_Fungsi_2022.xlsx": "2024-01-09T00:00:00.000Z",
  "Anggaran_Belanja_Fungsi_2023.xlsx": "2023-06-05T00:00:00.000Z",
  "Realisasi_Belanja_Fungsi_2023.xlsx": "2024-11-18T00:00:00.000Z",
  "Anggaran_Belanja_Fungsi_2024.xlsx": "2024-07-08T00:00:00.000Z",
  "Realisasi_Belanja_Fungsi_2024.xlsx": "2025-10-31T00:00:00.000Z",
  "Anggaran_Belanja_Fungsi_2025.xlsx": "2025-09-18T00:00:00.000Z",
  "Anggaran_Belanja_Fungsi_2026.xlsx": "2026-08-06T00:00:00.000Z",
};

export function discoverRawFiles(rawDir: string, fromYear: number): RawFile[] {
  if (!fs.existsSync(rawDir)) {
    throw new Error(`Folder data mentah tidak ditemukan: ${rawDir}`);
  }

  const files: RawFile[] = [];
  for (const fileName of fs.readdirSync(rawDir).sort()) {
    const match = fileName.match(/^(Anggaran|Realisasi)_Belanja_Fungsi_(\d{4})\.xlsx$/i);
    if (!match) continue;

    const year = Number(match[2]);
    if (year < fromYear) continue;

    const filePath = path.join(rawDir, fileName);
    files.push({
      year,
      side: match[1].toLowerCase() === "anggaran" ? "anggaran" : "realisasi",
      fileName,
      filePath,
      modifiedAt:
        SOURCE_FILE_DATES[fileName] ?? fs.statSync(filePath).mtime.toISOString(),
    });
  }

  return files.sort(
    (a, b) => a.year - b.year || a.side.localeCompare(b.side) || a.fileName.localeCompare(b.fileName),
  );
}

function desiredSheet(side: Side, year: number): string {
  if (side === "anggaran") {
    if (year === 2021) return "Sheet1";
    if (year === 2022) return "Sheet3";
    if (year === 2023) return "Datarow Fungsi_Kepmen050";
    return "Datarow Fungsi Kepmen";
  }

  if (year === 2021) return "datarow_proporsionalitas";
  if (year === 2024) return "Sheet1";
  return "Datarow Fungsi Kepmen";
}

function findSheet(
  workbook: ExcelJS.Workbook,
  desiredName: string,
): ExcelJS.Worksheet | undefined {
  const target = normalizeKey(desiredName);
  return workbook.worksheets.find((sheet) => normalizeKey(sheet.name) === target);
}

function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    if ("richText" in value) {
      return value.richText.map((part) => part.text).join("").trim();
    }
    if ("text" in value && typeof value.text === "string") return value.text.trim();
    if ("result" in value) return cellText(value.result as ExcelJS.CellValue);
  }
  return "";
}

function cellNumber(value: ExcelJS.CellValue): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object" && "result" in value) {
    return cellNumber(value.result as ExcelJS.CellValue);
  }

  const text = cellText(value);
  if (text === "") return null;
  const direct = Number(text);
  if (Number.isFinite(direct)) return direct;

  const cleaned = text.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function findColumns(header: ExcelJS.Row, columnCount: number) {
  const indexes = {
    account: 0,
    regionCode: 0,
    regionName: 0,
    sector: 0,
    value: 0,
  };

  for (let column = 1; column <= columnCount; column += 1) {
    const key = normalizeKey(cellText(header.getCell(column).value));

    if (["akunanalisis", "akunanalisismap"].includes(key)) indexes.account = column;
    if (key === "kodepemda") indexes.regionCode = column;
    if (["namapemda", "urpemda"].includes(key)) indexes.regionName = column;
    if (
      [
        "standarfungsikepmen",
        "standarfungsikepmenfinal",
        "standarfungsiquery",
        "standarfungsi",
        "standarfungsiadj",
        "standarfungsikepmengroup",
        "standarfungsiproporsionalitas",
      ].includes(key)
    ) {
      indexes.sector = column;
    }
    if (["nilaianggaran", "nilai"].includes(key)) indexes.value = column;
  }

  if (!indexes.regionCode || !indexes.regionName || !indexes.sector || !indexes.value) {
    throw new Error(
      `Kolom wajib tidak ditemukan. Header: ${Array.from({ length: columnCount }, (_, i) =>
        cellText(header.getCell(i + 1).value),
      )
        .filter(Boolean)
        .join(" | ")}`,
    );
  }

  return indexes;
}

function hasPrefix(regionCode: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => regionCode.startsWith(`${prefix}.`));
}

function readLongSheet(
  sheet: ExcelJS.Worksheet,
  prefix: string,
): { rows: RawFunctionRow[]; unknownSectorRows: number } {
  const prefixes = prefix.split(",").map((value) => value.trim()).filter(Boolean);
  const indexes = findColumns(sheet.getRow(1), sheet.columnCount);
  const rows: RawFunctionRow[] = [];
  let unknownSectorRows = 0;

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const regionCode = normalizeRegionCode(row.getCell(indexes.regionCode).value);
    if (!regionCode || !hasPrefix(regionCode, prefixes)) continue;

    const sectorId = parseSectorId(cellText(row.getCell(indexes.sector).value));
    if (!sectorId) {
      unknownSectorRows += 1;
      continue;
    }

    const value = cellNumber(row.getCell(indexes.value).value) ?? 0;
    rows.push({
      regionCode,
      regionName: normalizeRegionName(
        cellText(row.getCell(indexes.regionName).value),
      ),
      sectorId,
      value,
    });
  }

  return { rows, unknownSectorRows };
}

function readWideSheet(
  sheet: ExcelJS.Worksheet,
  prefix: string,
): { rows: RawFunctionRow[]; unknownSectorRows: number } {
  const prefixes = prefix.split(",").map((value) => value.trim()).filter(Boolean);
  const groups: Array<{ column: number; sectorId: string }> = [];
  let currentSector: string | null = null;

  for (let column = 3; column <= sheet.columnCount; column += 1) {
    const label = cellText(sheet.getRow(5).getCell(column).value);
    if (label) currentSector = parseSectorId(label);
    if (currentSector) groups.push({ column, sectorId: currentSector });
  }

  if (groups.length === 0) {
    throw new Error(`Tidak ada kolom fungsi pada sheet ${sheet.name}`);
  }

  const rows: RawFunctionRow[] = [];
  for (let rowNumber = 7; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const regionCode = normalizeRegionCode(row.getCell(1).value);
    if (!regionCode || !hasPrefix(regionCode, prefixes)) continue;

    const regionName = normalizeRegionName(cellText(row.getCell(2).value));
    for (const group of groups) {
      const value = cellNumber(row.getCell(group.column).value);
      if (value === null) continue;
      rows.push({
        regionCode,
        regionName,
        sectorId: group.sectorId,
        value,
      });
    }
  }

  return { rows, unknownSectorRows: 0 };
}

export async function readRawFile(file: RawFile, prefix: string): Promise<ReadResult> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file.filePath);

  const sheet = findSheet(workbook, desiredSheet(file.side, file.year));
  if (!sheet) {
    throw new Error(
      `Sheet "${desiredSheet(file.side, file.year)}" tidak ditemukan di ${file.fileName}. ` +
        `Sheet tersedia: ${workbook.worksheets.map((item) => item.name).join(", ")}`,
    );
  }

  // Sheet3 pada berkas Anggaran 2022 adalah tabel lebar; berkas lain memakai
  // satu baris per kombinasi pemda-fungsi-akun.
  const result =
    file.side === "anggaran" && file.year === 2022
      ? readWideSheet(sheet, prefix)
      : readLongSheet(sheet, prefix);

  return {
    rows: result.rows,
    sheetName: sheet.name,
    unknownSectorRows: result.unknownSectorRows,
  };
}

export function checksumFiles(files: RawFile[]): string {
  return files
    .map((file) => `${file.fileName}:${fs.readFileSync(file.filePath).toString("base64")}`)
    .join("|");
}
