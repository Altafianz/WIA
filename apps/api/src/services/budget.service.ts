import {
  ApiResponse,
  BudgetSummaryData,
  BudgetSectorsData,
  BudgetTrendData,
  CompareData,
  CompareQuery,
  CompareRow,
  SectorDelta,
  SectorSlice,
  TrendPoint,
  aggregateTotals,
  calculateDelta,
  calculateRealizationRate,
  calculateRemainingBudget,
  calculateSectorShare,
  calculateDenseRank,
  DEFAULT_FISCAL_YEAR,
  FISCAL_YEARS,
} from "@danaterbuka/shared";
import { getRepository } from "../repositories/index.js";
import { AppError } from "../lib/errors.js";

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

  getCompare(query: CompareQuery): ApiResponse<CompareData> {
    const repo = getRepository();
    const meta = repo.getMeta();
    const regions = repo.listRegions();
    const sectors = repo.listSectors();
    const sectorMap = new Map(sectors.map((s) => [s.sectorId, s]));

    if (query.mode === "region") {
      const year = query.year ?? DEFAULT_FISCAL_YEAR;
      const regionA = regions.find((r) => r.slug === query.a);
      const regionB = query.b ? regions.find((r) => r.slug === query.b) : undefined;

      if (!regionA || !regionB) {
        throw new AppError(
          404,
          "DATA_NOT_FOUND",
          "Wilayah pembanding belum tersedia."
        );
      }

      const recordsA = repo.getRecords({ regionSlug: regionA.slug, fiscalYear: year });
      const recordsB = repo.getRecords({ regionSlug: regionB.slug, fiscalYear: year });

      if (recordsA.length === 0 || recordsB.length === 0) {
        throw new AppError(
          404,
          "DATA_NOT_FOUND",
          "Wilayah pembanding belum tersedia."
        );
      }

      return {
        meta,
        data: {
          mode: "region",
          a: { label: regionA.name, slug: regionA.slug, year },
          b: { label: regionB.name, slug: regionB.slug, year },
          rows: this.buildCompareRows(recordsA, recordsB),
          topSectorDeltas: this.buildSectorDeltas(recordsA, recordsB, sectorMap),
        },
      };
    }

    const region = regions.find((r) => r.slug === query.a);
    if (!region) {
      throw new AppError(404, "DATA_NOT_FOUND", "Wilayah pembanding belum tersedia.");
    }

    const yearA = query.yearA;
    const yearB = query.yearB;
    if (!yearA || !yearB) {
      throw new AppError(400, "VALIDATION_ERROR", "Tahun pembanding wajib diisi.");
    }

    const recordsA = repo.getRecords({ regionSlug: region.slug, fiscalYear: yearA });
    const recordsB = repo.getRecords({ regionSlug: region.slug, fiscalYear: yearB });

    if (recordsA.length === 0 || recordsB.length === 0) {
      throw new AppError(404, "DATA_NOT_FOUND", "Wilayah pembanding belum tersedia.");
    }

    return {
      meta,
      data: {
        mode: "year",
        a: { label: `${region.name} ${yearA}`, slug: region.slug, year: yearA },
        b: { label: `${region.name} ${yearB}`, slug: region.slug, year: yearB },
        rows: this.buildCompareRows(recordsA, recordsB),
        topSectorDeltas: this.buildSectorDeltas(recordsA, recordsB, sectorMap),
      },
    };
  }

  private buildCompareRows(
    recordsA: Parameters<typeof aggregateTotals>[0],
    recordsB: Parameters<typeof aggregateTotals>[0]
  ): CompareRow[] {
    const aggA = aggregateTotals(recordsA);
    const aggB = aggregateTotals(recordsB);
    const rateA = calculateRealizationRate(aggA.totalRealisasi, aggA.totalPagu);
    const rateB = calculateRealizationRate(aggB.totalRealisasi, aggB.totalPagu);

    return [
      this.buildCompareRow("totalPagu", "Total Pagu", aggA.totalPagu, aggB.totalPagu),
      this.buildCompareRow(
        "totalRealisasi",
        "Total Realisasi",
        aggA.totalRealisasi,
        aggB.totalRealisasi
      ),
      this.buildCompareRow(
        "realizationRate",
        "Persentase Realisasi",
        rateA,
        rateB
      ),
    ];
  }

  private buildCompareRow(
    metric: CompareRow["metric"],
    label: string,
    aValue: number | null,
    bValue: number | null
  ): CompareRow {
    if (aValue === null || bValue === null) {
      return { metric, label, aValue, bValue, delta: null, deltaPercent: null };
    }
    const { delta, deltaPercent } = calculateDelta(aValue, bValue);
    return { metric, label, aValue, bValue, delta, deltaPercent };
  }

  private buildSectorDeltas(
    recordsA: Parameters<typeof aggregateTotals>[0],
    recordsB: Parameters<typeof aggregateTotals>[0],
    sectorMap: Map<string, { name: string; shortName: string }>
  ): SectorDelta[] {
    const bySector = new Map<string, { aPagu: number; bPagu: number }>();

    for (const record of recordsA) {
      const entry = bySector.get(record.sectorId) ?? { aPagu: 0, bPagu: 0 };
      entry.aPagu += record.pagu;
      bySector.set(record.sectorId, entry);
    }

    for (const record of recordsB) {
      const entry = bySector.get(record.sectorId) ?? { aPagu: 0, bPagu: 0 };
      entry.bPagu += record.pagu;
      bySector.set(record.sectorId, entry);
    }

    return Array.from(bySector.entries())
      .map(([sectorId, values]) => {
        const sector = sectorMap.get(sectorId);
        const { delta, deltaPercent } = calculateDelta(values.aPagu, values.bPagu);
        return {
          sectorId,
          name: sector?.name ?? sectorId,
          shortName: sector?.shortName ?? sectorId,
          aPagu: values.aPagu,
          bPagu: values.bPagu,
          delta,
          deltaPercent,
        };
      })
      .filter((item) => item.delta !== 0)
      .sort(
        (x, y) =>
          Math.abs(y.delta) - Math.abs(x.delta) ||
          x.sectorId.localeCompare(y.sectorId)
      )
      .slice(0, 3);
  }
}
