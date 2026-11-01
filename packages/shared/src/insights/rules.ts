import { BudgetRecord } from "../schemas/budget-record.js";
import { Sector } from "../schemas/sector.js";
import { InsightItem } from "../schemas/api.js";
import { calculateSectorShare } from "../metrics/share.js";
import { calculateRealizationRate, calculateRemainingBudget } from "../metrics/realization.js";
import { calculateYoYGrowth } from "../metrics/growth.js";
import { LIMITATIONS } from "./disclaimers.js";

export function formatRupiahSimple(num: number): string {
  if (Math.abs(num) >= 1_000_000_000_000) {
    const val = (num / 1_000_000_000_000).toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return `Rp ${val} Triliun`;
  }
  if (Math.abs(num) >= 1_000_000_000) {
    const val = (num / 1_000_000_000).toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return `Rp ${val} Miliar`;
  }
  if (Math.abs(num) >= 1_000_000) {
    const val = (num / 1_000_000).toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return `Rp ${val} Juta`;
  }
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export function formatPercentId(num: number): string {
  return `${num.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

// INS-01: Pangsa sektor teratas >= 25.0%
export function ruleIns01(
  records: BudgetRecord[],
  sectorsMap: Map<string, Sector>,
  totalPagu: number
): InsightItem | null {
  if (records.length === 0 || totalPagu <= 0) return null;

  const sorted = [...records].sort((a, b) => b.pagu - a.pagu);
  const top = sorted[0];
  const share = calculateSectorShare(top.pagu, totalPagu);

  if (share !== null && share >= 25.0) {
    const sectorName = sectorsMap.get(top.sectorId)?.name ?? top.sectorId;
    return {
      id: "INS-01",
      ruleId: "INS-01",
      title: "Alokasi Anggaran Terkonsentrasi",
      summary: `Sektor ${sectorName} menerima alokasi terbesar yaitu ${formatRupiahSimple(top.pagu)} atau ${formatPercentId(share)} dari total pagu anggaran belanja daerah.`,
      limitation: LIMITATIONS.INS_01,
      category: "Alokasi",
      severity: "info",
    };
  }
  return null;
}

// INS-02: Ada sektor dengan rate < 50.0% dan gap >= 0.5% total pagu
export function ruleIns02(
  records: BudgetRecord[],
  sectorsMap: Map<string, Sector>,
  totalPagu: number
): InsightItem | null {
  if (records.length === 0 || totalPagu <= 0) return null;

  const thresholdGap = 0.005 * totalPagu;
  let candidate: { record: BudgetRecord; rate: number; gap: number } | null = null;

  for (const r of records) {
    if (r.realisasi !== null && r.pagu > 0) {
      const rate = calculateRealizationRate(r.realisasi, r.pagu);
      const gap = calculateRemainingBudget(r.pagu, r.realisasi);
      if (rate !== null && rate < 50.0 && gap !== null && gap >= thresholdGap) {
        if (!candidate || (gap > candidate.gap)) {
          candidate = { record: r, rate, gap };
        }
      }
    }
  }

  if (candidate) {
    const sectorName = sectorsMap.get(candidate.record.sectorId)?.name ?? candidate.record.sectorId;
    return {
      id: "INS-02",
      ruleId: "INS-02",
      title: "Penyerapan Anggaran Terendah",
      summary: `Sektor ${sectorName} memiliki tingkat penyerapan anggaran sebesar ${formatPercentId(candidate.rate)} dengan selisih pagu sebesar ${formatRupiahSimple(candidate.gap)}.`,
      limitation: LIMITATIONS.INS_02,
      category: "Realisasi",
      severity: "warning",
    };
  }
  return null;
}

// INS-03: |YoY| >= 15.0% pada sektor mana pun dibandingkan tahun sebelumnya
export function ruleIns03(
  currentRecords: BudgetRecord[],
  previousRecords: BudgetRecord[],
  sectorsMap: Map<string, Sector>
): InsightItem | null {
  if (currentRecords.length === 0 || previousRecords.length === 0) return null;

  const prevMap = new Map<string, BudgetRecord>();
  for (const r of previousRecords) {
    prevMap.set(r.sectorId, r);
  }

  let topGrowth: { sectorId: string; growth: number; currPagu: number; prevPagu: number } | null = null;

  for (const curr of currentRecords) {
    const prev = prevMap.get(curr.sectorId);
    if (prev && prev.pagu > 0) {
      const growth = calculateYoYGrowth(curr.pagu, prev.pagu);
      if (growth !== null && Math.abs(growth) >= 15.0) {
        if (!topGrowth || Math.abs(growth) > Math.abs(topGrowth.growth)) {
          topGrowth = { sectorId: curr.sectorId, growth, currPagu: curr.pagu, prevPagu: prev.pagu };
        }
      }
    }
  }

  if (topGrowth) {
    const sectorName = sectorsMap.get(topGrowth.sectorId)?.name ?? topGrowth.sectorId;
    const direction = topGrowth.growth > 0 ? "peningkatan" : "penurunan";
    return {
      id: "INS-03",
      ruleId: "INS-03",
      title: "Perubahan Alokasi Signifikan",
      summary: `Sektor ${sectorName} mengalami ${direction} alokasi anggaran sebesar ${formatPercentId(Math.abs(topGrowth.growth))} dibandingkan tahun anggaran sebelumnya.`,
      limitation: LIMITATIONS.INS_03,
      category: "Tren",
      severity: "info",
    };
  }
  return null;
}

// INS-04: Gap sektor terbesar >= 5.0% total pagu
export function ruleIns04(
  records: BudgetRecord[],
  sectorsMap: Map<string, Sector>,
  totalPagu: number
): InsightItem | null {
  if (records.length === 0 || totalPagu <= 0) return null;

  const thresholdGap = 0.05 * totalPagu;
  let maxGapItem: { record: BudgetRecord; gap: number } | null = null;

  for (const r of records) {
    if (r.realisasi !== null) {
      const gap = calculateRemainingBudget(r.pagu, r.realisasi);
      if (gap !== null && gap >= thresholdGap) {
        if (!maxGapItem || gap > maxGapItem.gap) {
          maxGapItem = { record: r, gap };
        }
      }
    }
  }

  if (maxGapItem) {
    const sectorName = sectorsMap.get(maxGapItem.record.sectorId)?.name ?? maxGapItem.record.sectorId;
    return {
      id: "INS-04",
      ruleId: "INS-04",
      title: "Selisih Alokasi Terbesar",
      summary: `Sektor ${sectorName} mencatatkan selisih pagu anggaran sebesar ${formatRupiahSimple(maxGapItem.gap)} yang belum terealisasi.`,
      limitation: LIMITATIONS.INS_04,
      category: "Realisasi",
      severity: "warning",
    };
  }
  return null;
}

// INS-05: Pangsa top-3 >= 50.0%
export function ruleIns05(
  records: BudgetRecord[],
  totalPagu: number
): InsightItem | null {
  if (records.length < 3 || totalPagu <= 0) return null;

  const sorted = [...records].sort((a, b) => b.pagu - a.pagu);
  const top3Pagu = sorted[0].pagu + sorted[1].pagu + sorted[2].pagu;
  const share = calculateSectorShare(top3Pagu, totalPagu);

  if (share !== null && share >= 50.0) {
    return {
      id: "INS-05",
      ruleId: "INS-05",
      title: "Konsentrasi Belanja Daerah",
      summary: `Tiga sektor dengan anggaran tertinggi menguasai ${formatPercentId(share)} dari total keseluruhan belanja daerah.`,
      limitation: LIMITATIONS.INS_05,
      category: "Alokasi",
      severity: "info",
    };
  }
  return null;
}
