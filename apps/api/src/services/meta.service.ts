import { MetaData, ApiResponse } from "@danaterbuka/shared";
import { getRepository } from "../repositories/index.js";
import {
  getAvailableYears,
  getDefaultRegionSlug,
  getLatestFinalYear,
} from "../lib/data-meta.js";

export class MetaService {
  getMetaInfo(): ApiResponse<MetaData> {
    const repo = getRepository();
    const meta = repo.getMeta();
    const regions = repo.listRegions();
    const sectors = repo.listSectors();

    return {
      meta,
      data: {
        availableYears: getAvailableYears(repo),
        latestFinalYear: getLatestFinalYear(repo),
        defaultRegionSlug: getDefaultRegionSlug(repo),
        regions,
        sectors,
      },
    };
  }
}
