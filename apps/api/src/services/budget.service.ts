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
  FISCAL_YEARS,
} from "@danaterbuka/shared";
import { getRepository } from "../repositories/index.js";

export class BudgetService {
  getSummary(regionSlug: string, fiscalYear: number): ApiResponse<BudgetSummaryData> {
    const repo = getRepository();
    const meta = repo.getMeta();
    const regions = repo.listRegions();
    const region = regions.find((r) => r.slug === regionSlug);

    const regionName = region?.name ?? regionSlug;
    const records = repo.getRecords({ regionSlug, fiscalYear });

    if (records.length === 0) {
      return {
        meta,
        data: {
          regionSlug,
          regionName,
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
        regionName,
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
          slices: [],
        },
      };
    }

    const totalPagu = records.reduce((acc, r) => acc + r.pagu, 0);

    const slices: SectorSlice[] = records.map((r) => {
      const s = sectorMap.get(r.sectorId);
      const name = s?.name ?? r.sectorId;
      const realizationRate = calculateRealizationRate(r.realisasi, r.pagu);
      const share = calculateSectorShare(r.pagu, totalPagu) ?? 0;
      return {
        sectorId: r.sectorId,
        name,
        pagu: r.pagu,
        realisasi: r.realisasi,
        realizationRate,
        share,
        colorToken: s?.colorToken,
      };
    });

    // Urutkan bar menurun berdasarkan pagu
    slices.sort((a, b) => b.pagu - a.pagu);

    return {
      meta,
      data: {
        regionSlug,
        fiscalYear,
        totalPagu,
        slices,
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
        const realizationRate = calculateRealizationRate(agg.totalRealisasi, agg.totalPagu);
        points.push({
          fiscalYear: year,
          pagu: agg.totalPagu,
          realisasi: agg.totalRealisasi,
          realizationRate,
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
