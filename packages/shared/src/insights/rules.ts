import { BudgetRecord } from "../schemas/budget-record.js";
import { Sector } from "../schemas/sector.js";
import { Insight } from "../schemas/api.js";
import { LIMITATIONS } from "./disclaimers.js";
import { containsForbiddenWords } from "../content/forbidden-words.js";
import { calculateSectorShare } from "../metrics/share.js";
import { calculateRealizationRate, calculateRemainingBudget } from "../metrics/realization.js";
import { calculateYoYGrowth } from "../metrics/growth.js";
import { round1 } from "../metrics/round.js";

function formatPercent(value: number): string {
  return `${round1(value).toFixed(1).replace(".", ",")}%`;
}

function formatRupiahCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) {
    return `${sign}Rp ${round1(abs / 1e12).toFixed(1).replace(".", ",")} T`;
  }
  if (abs >= 1e9) {
    return `${sign}Rp ${round1(abs / 1e9).toFixed(1).replace(".", ",")} M`;
  }
  if (abs >= 1e6) {
    return `${sign}Rp ${round1(abs / 1e6).toFixed(1).replace(".", ",")} jt`;
  }
  return `${sign}Rp ${abs.toLocaleString("id-ID")}`;
}

function validateInsight(insight: Insight | null): Insight | null {
  if (!insight) return null;
  if (insight.sentence.length > 240 || insight.limitation.length > 240) return null;
  if (containsForbiddenWords(insight.sentence) || containsForbiddenWords(insight.limitation)) {
    return null;
  }
  return insight;
}

// INS-01: Pangsa sektor teratas >= 25.0%
export function ruleIns01(
  records: BudgetRecord[],
  totalPagu: number,
  sectorsMap: Map<string, Sector>,
  year: number
): Insight | null {
  if (records.length === 0 || totalPagu <= 0) return null;

  const sorted = [...records].sort((a, b) => b.pagu - a.pagu);
  const top = sorted[0];
  if (!top || top.pagu <= 0) return null;

  const share = calculateSectorShare(top.pagu, totalPagu);
  if (share === null || share < 25.0) return null;

  const sectorName = sectorsMap.get(top.sectorId)?.name ?? top.sectorId;
  const sentence = `Sektor ${sectorName} menerima ${formatPercent(share)} dari total pagu ${year}, porsi terbesar di wilayah ini.`;

  return validateInsight({
    ruleId: "INS-01",
    severity: "info",
    sentence,
    limitation: LIMITATIONS.INS_01,
    supportingValues: {
      sectorId: top.sectorId,
      sectorName,
      share,
      pagu: top.pagu,
      totalPagu,
      year,
    },
  });
}

// INS-02: Realisasi terendah (rate < 50.0% dan gap >= 0.5% totalPagu; pilih rate terendah)
export function ruleIns02(
  records: BudgetRecord[],
  totalPagu: number,
  sectorsMap: Map<string, Sector>
): Insight | null {
  if (records.length === 0 || totalPagu <= 0) return null;

  const thresholdGap = 0.005 * totalPagu; // 0.5% dari total pagu
  const candidates: Array<{ record: BudgetRecord; rate: number; gap: number }> = [];

  for (const r of records) {
    if (r.realisasi !== null && r.pagu > 0) {
      const rate = calculateRealizationRate(r.realisasi, r.pagu);
      const gap = calculateRemainingBudget(r.pagu, r.realisasi);
      if (rate !== null && rate < 50.0 && gap !== null && gap >= thresholdGap) {
        candidates.push({ record: r, rate, gap });
      }
    }
  }

  if (candidates.length === 0) return null;

  // Pilih rate terendah, tie-break gap terbesar
  candidates.sort((a, b) => a.rate - b.rate || b.gap - a.gap);
  const chosen = candidates[0];
  const sectorName = sectorsMap.get(chosen.record.sectorId)?.name ?? chosen.record.sectorId;
  const sentence = `Sektor ${sectorName} baru terealisasi ${formatPercent(chosen.rate)}, terendah di wilayah ini; selisih pagu-realisasi mencapai ${formatRupiahCompact(chosen.gap)}.`;

  return validateInsight({
    ruleId: "INS-02",
    severity: "attention",
    sentence,
    limitation: LIMITATIONS.INS_02,
    supportingValues: {
      sectorId: chosen.record.sectorId,
      sectorName,
      rate: chosen.rate,
      gap: chosen.gap,
      totalPagu,
    },
  });
}

// INS-03: Perubahan tahunan (|YoY| >= 15.0% pada sektor mana pun; pilih |YoY| terbesar)
export function ruleIns03(
  currentRecords: BudgetRecord[],
  prevRecords: BudgetRecord[],
  sectorsMap: Map<string, Sector>,
  year: number,
  prevYear: number
): Insight | null {
  if (currentRecords.length === 0 || prevRecords.length === 0) return null;

  const prevMap = new Map<string, number>();
  for (const r of prevRecords) {
    prevMap.set(r.sectorId, r.pagu);
  }

  const candidates: Array<{ record: BudgetRecord; yoy: number; absYoy: number }> = [];
  for (const cur of currentRecords) {
    const prevPagu = prevMap.get(cur.sectorId);
    if (prevPagu !== undefined && prevPagu > 0) {
      const yoy = calculateYoYGrowth(cur.pagu, prevPagu);
      if (yoy !== null && Math.abs(yoy) >= 15.0) {
        candidates.push({ record: cur, yoy, absYoy: Math.abs(yoy) });
      }
    }
  }

  if (candidates.length === 0) return null;

  // Pilih |YoY| terbesar
  candidates.sort((a, b) => b.absYoy - a.absYoy);
  const chosen = candidates[0];
  const sectorName = sectorsMap.get(chosen.record.sectorId)?.name ?? chosen.record.sectorId;
  const direction = chosen.yoy >= 0 ? "naik" : "turun";
  const sentence = `Pagu sektor ${sectorName} ${direction} ${formatPercent(chosen.absYoy)} pada ${year} dibanding ${prevYear}.`;

  return validateInsight({
    ruleId: "INS-03",
    severity: "info",
    sentence,
    limitation: LIMITATIONS.INS_03,
    supportingValues: {
      sectorId: chosen.record.sectorId,
      sectorName,
      direction,
      yoy: chosen.yoy,
      absYoy: chosen.absYoy,
      year,
      prevYear,
    },
  });
}

// INS-04: Selisih terbesar (gap = pagu - realisasi; gapShare >= 5.0%; pilih gap terbesar)
export function ruleIns04(
  records: BudgetRecord[],
  totalPagu: number,
  sectorsMap: Map<string, Sector>
): Insight | null {
  if (records.length === 0 || totalPagu <= 0) return null;

  const candidates: Array<{ record: BudgetRecord; gap: number; gapShare: number }> = [];

  for (const r of records) {
    if (r.realisasi !== null) {
      const gap = calculateRemainingBudget(r.pagu, r.realisasi);
      if (gap !== null && gap > 0) {
        const gapShare = (gap / totalPagu) * 100;
        if (round1(gapShare) >= 5.0) {
          candidates.push({ record: r, gap, gapShare: round1(gapShare) });
        }
      }
    }
  }

  if (candidates.length === 0) return null;

  // Pilih gap terbesar
  candidates.sort((a, b) => b.gap - a.gap);
  const chosen = candidates[0];
  const sectorName = sectorsMap.get(chosen.record.sectorId)?.name ?? chosen.record.sectorId;
  const sentence = `Sektor ${sectorName} memiliki selisih pagu-realisasi terbesar: ${formatRupiahCompact(chosen.gap)}, setara ${formatPercent(chosen.gapShare)} dari total pagu.`;

  return validateInsight({
    ruleId: "INS-04",
    severity: "attention",
    sentence,
    limitation: LIMITATIONS.INS_04,
    supportingValues: {
      sectorId: chosen.record.sectorId,
      sectorName,
      gap: chosen.gap,
      gapShare: chosen.gapShare,
      totalPagu,
    },
  });
}

// INS-05: Konsentrasi anggaran (top-3 pagu >= 50.0% dan jumlah sektor >= 3)
export function ruleIns05(
  records: BudgetRecord[],
  totalPagu: number,
  sectorsMap: Map<string, Sector>
): Insight | null {
  if (records.length < 3 || totalPagu <= 0) return null;

  const sorted = [...records].sort((a, b) => b.pagu - a.pagu);
  const top3Pagu = sorted[0].pagu + sorted[1].pagu + sorted[2].pagu;
  const top3Share = calculateSectorShare(top3Pagu, totalPagu);

  if (top3Share === null || top3Share < 50.0) return null;

  const sectorNames = [
    sectorsMap.get(sorted[0].sectorId)?.shortName ?? sorted[0].sectorId,
    sectorsMap.get(sorted[1].sectorId)?.shortName ?? sorted[1].sectorId,
    sectorsMap.get(sorted[2].sectorId)?.shortName ?? sorted[2].sectorId,
  ].join(", ");

  const sentence = `Tiga sektor teratas menyerap ${formatPercent(top3Share)} dari total pagu: ${sectorNames}.`;

  return validateInsight({
    ruleId: "INS-05",
    severity: "info",
    sentence,
    limitation: LIMITATIONS.INS_05,
    supportingValues: {
      top3Share,
      sectorNames,
      totalPagu,
    },
  });
}

// INS-06: Kelengkapan periode (aktif bila ada record approved atau partial)
export function ruleIns06(
  records: BudgetRecord[],
  year: number
): Insight | null {
  if (records.length === 0) return null;

  const hasApproved = records.some((r) => r.periodStatus === "approved");
  const hasPartial = records.some((r) => r.periodStatus === "partial");

  if (!hasApproved && !hasPartial) return null;

  const statusText = hasApproved ? "belum final" : "sementara";
  const sentence = `Data ${year} berstatus ${statusText}; angka realisasi dapat berubah setelah pembaruan.`;

  return validateInsight({
    ruleId: "INS-06",
    severity: "caution",
    sentence,
    limitation: LIMITATIONS.INS_06,
    supportingValues: {
      year,
      status: statusText,
    },
  });
}
