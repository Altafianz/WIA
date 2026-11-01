import { ApiResponse, InsightsData, generateInsights } from "@danaterbuka/shared";
import { getRepository } from "../repositories/index.js";

export class InsightService {
  getInsights(regionSlug: string, fiscalYear: number): ApiResponse<InsightsData> {
    const repo = getRepository();
    const meta = repo.getMeta();
    const currentRecords = repo.getRecords({ regionSlug, fiscalYear });
    const previousRecords = repo.getRecords({ regionSlug, fiscalYear: fiscalYear - 1 });
    const sectors = repo.listSectors();

    const totalPagu = currentRecords.reduce((acc, r) => acc + r.pagu, 0);

    const { items, globalDisclaimer } = generateInsights({
      currentRecords,
      previousRecords,
      sectors,
      totalPagu,
    });

    return {
      meta,
      data: {
        regionSlug,
        fiscalYear,
        items,
        globalDisclaimer,
      },
    };
  }
}
