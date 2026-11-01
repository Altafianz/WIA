import { Request, Response } from "express";
import {
  InsightsQuerySchema,
  DEFAULT_REGION_SLUG,
  DEFAULT_FISCAL_YEAR,
} from "@danaterbuka/shared";
import { InsightService } from "../services/insight.service.js";

const insightService = new InsightService();

export function getInsights(req: Request, res: Response): void {
  const query = InsightsQuerySchema.parse(req.query);
  const region = query.region ?? DEFAULT_REGION_SLUG;
  const year = query.year ?? DEFAULT_FISCAL_YEAR;
  const result = insightService.getInsights(region, year);
  res.json(result);
}
