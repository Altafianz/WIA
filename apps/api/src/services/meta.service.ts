import {
  MetaData,
  ApiResponse,
  DEFAULT_REGION_SLUG,
  DEFAULT_FISCAL_YEAR,
} from "@danaterbuka/shared";
import { getRepository } from "../repositories/index.js";

export class MetaService {
  getMetaInfo(): ApiResponse<MetaData> {
    const repo = getRepository();
    const meta = repo.getMeta();
    const regions = repo.listRegions();
    const sectors = repo.listSectors();

    const availableYears = [2021, 2022, 2023, 2024, 2025];
    const latestFinalYear = DEFAULT_FISCAL_YEAR;

    return {
      meta,
      data: {
        availableYears,
        latestFinalYear,
        defaultRegionSlug: DEFAULT_REGION_SLUG,
        regions,
        sectors,
      },
    };
  }
}
