import { BudgetRecord, PeriodStatus } from "../schemas/budget-record.js";

export function aggregateTotals(records: BudgetRecord[]): {
  totalPagu: number;
  totalRealisasi: number | null;
  realisasiComplete: boolean;
  periodStatus: PeriodStatus;
} {
  if (records.length === 0) {
    return {
      totalPagu: 0,
      totalRealisasi: null,
      realisasiComplete: false,
      periodStatus: "approved",
    };
  }

  let totalPagu = 0;
  let sumRealisasi = 0;
  let hasAnyRealisasi = false;
  let hasNullRealisasi = false;

  let allFinal = true;
  let hasPartial = false;

  for (const r of records) {
    totalPagu += r.pagu;
    if (r.realisasi !== null) {
      sumRealisasi += r.realisasi;
      hasAnyRealisasi = true;
    } else {
      hasNullRealisasi = true;
    }

    if (r.periodStatus !== "final") {
      allFinal = false;
    }
    if (r.periodStatus === "partial") {
      hasPartial = true;
    }
  }

  let periodStatus: PeriodStatus = "approved";
  if (allFinal) {
    periodStatus = "final";
  } else if (hasPartial) {
    periodStatus = "partial";
  } else {
    periodStatus = "approved";
  }

  return {
    totalPagu,
    totalRealisasi: hasAnyRealisasi ? sumRealisasi : null,
    realisasiComplete: !hasNullRealisasi,
    periodStatus,
  };
}
