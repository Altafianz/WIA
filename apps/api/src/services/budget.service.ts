import {
  ApiResponse,
  BudgetSummaryData,
  BudgetSectorsData,
  BudgetTrendData,
  SectorSlice,
  TrendPoint,
  aggregateTotals,
  calculateRealizationRate,
  calculateRemainingBudget,
  calculateSectorShare,
  calculateDenseRank,
  FISCAL_YEARS,
} from "@danaterbuka/shared";
import { getRepository } from "../repositories/index.js";

export class BudgetService {
  getSummary(regionSlug: string, fiscalYear: number): ApiResponse<BudgetSummaryData> {
    const repo = getRepository();
    const meta = repo.getMeta();
    const records = repo.getRecords({ regionSlug, fiscalYear });

    if (records.length === 0) {
      return {
        meta,
        data: {
          regionSlug,
          fiscalYear,
          totalPagu: 0,
          totalRealisasi: null,
          realizationRate: null,
          remainingBudget: null,
          sectorCount: 0,
          realisasiComplete: false,
          periodStatus: "approved",
        },
      };
    }

    const agg = aggregateTotals(records);
    const realizationRate = calculateRealizationRate(agg.totalRealisasi, agg.totalPagu);
    const remainingBudget = calculateRemainingBudget(agg.totalPagu, agg.totalRealisasi);

    return {
      meta,
      data: {
        regionSlug,
        fiscalYear,
        totalPagu: agg.totalPagu,
        totalRealisasi: agg.totalRealisasi,
        realizationRate,
        remainingBudget,
        sectorCount: records.length,
        realisasiComplete: agg.realisasiComplete,
        periodStatus: agg.periodStatus,
      },
    };
  }

  getSectors(regionSlug: string, fiscalYear: number): ApiResponse<BudgetSectorsData> {
    const repo = getRepository();
    const meta = repo.getMeta();
    const records = repo.getRecords({ regionSlug, fiscalYear });
    const sectors = repo.listSectors();
    const sectorMap = new Map(sectors.map((s) => [s.sectorId, s]));

    if (records.length === 0) {
      return {
        meta,
        data: {
          regionSlug,
          fiscalYear,
          totalPagu: 0,
          totalRealisasi: null,
          realisasiComplete: false,
          slices: [],
        },
      };
    }

    const agg = aggregateTotals(records);
    const totalPagu = agg.totalPagu;

    // Build raw slices
    const rawSlices = records.map((r) => {
      const s = sectorMap.get(r.sectorId);
      const name = s?.name ?? r.sectorId;
      const shortName = s?.shortName ?? name;
      const realizationRate = calculateRealizationRate(r.realisasi, r.pagu);
      const share = calculateSectorShare(r.pagu, totalPagu) ?? 0;
      return {
        sectorId: r.sectorId,
        name,
        shortName,
        pagu: r.pagu,
        realisasi: r.realisasi,
        realizationRate,
        share,
        isAggregate: false,
        colorToken: s?.colorToken,
      };
    });

    // Urutkan menurun berdasarkan pagu
    rawSlices.sort((a, b) => b.pagu - a.pagu);

    let finalSlices: SectorSlice[];

    if (rawSlices.length > 10) {
      // Top 10 + 1 agregat "Sektor lainnya"
      const top10 = rawSlices.slice(0, 10);
      const remaining = rawSlices.slice(10);

      const otherPagu = remaining.reduce((acc, r) => acc + r.pagu, 0);
      const hasAnyReal = remaining.some((r) => r.realisasi !== null);
      const otherRealisasi = hasAnyReal
        ? remaining.reduce((acc, r) => acc + (r.realisasi ?? 0), 0)
        : null;
      const otherRate = calculateRealizationRate(otherRealisasi, otherPagu);
      const otherShare = calculateSectorShare(otherPagu, totalPagu) ?? 0;

      const otherSlice: SectorSlice = {
        sectorId: "other",
        name: "Sektor lainnya",
        shortName: "Lainnya",
        pagu: otherPagu,
        realisasi: otherRealisasi,
        realizationRate: otherRate,
        share: otherShare,
        isAggregate: true,
        colorToken: "sector-10",
      };

      finalSlices = [...top10, otherSlice];
    } else {
      finalSlices = rawSlices;
    }

    // Rank slices
    const ranked = calculateDenseRank(
      finalSlices.map((s) => ({
        id: s.sectorId,
        value: s.pagu,
        data: s,
      }))
    );

    const slicesWithRank: SectorSlice[] = ranked.map((r) => ({
      ...r.data,
      rank: r.rank,
    }));

    return {
      meta,
      data: {
        regionSlug,
        fiscalYear,
        totalPagu: agg.totalPagu,
        totalRealisasi: agg.totalRealisasi,
        realisasiComplete: agg.realisasiComplete,
        slices: slicesWithRank,
      },
    };
  }

  getTrend(regionSlug: string): ApiResponse<BudgetTrendData> {
    const repo = getRepository();
    const meta = repo.getMeta();

    const points: TrendPoint[] = [];

    for (const year of FISCAL_YEARS) {
      const records = repo.getRecords({ regionSlug, fiscalYear: year });
      if (records.length > 0) {
        const agg = aggregateTotals(records);
        points.push({
          fiscalYear: year,
          pagu: agg.totalPagu,
          realisasi: agg.totalRealisasi,
          periodStatus: agg.periodStatus,
        });
      }
    }

    return {
      meta,
      data: {
        regionSlug,
        points,
      },
    };
  }
}
