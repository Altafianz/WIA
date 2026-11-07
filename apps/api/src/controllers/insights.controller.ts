import { Request, Response } from "express";
import { InsightsQuerySchema } from "@danaterbuka/shared";
import { InsightService } from "../services/insight.service.js";
import { getRepository } from "../repositories/index.js";
import { getDefaultRegionSlug, getLatestFinalYear } from "../lib/data-meta.js";

const insightService = new InsightService();

export function getInsights(req: Request, res: Response): void {
  const query = InsightsQuerySchema.parse(req.query);
  const repo = getRepository();
  const region = query.region ?? getDefaultRegionSlug(repo);
  const year = query.year ?? getLatestFinalYear(repo);
  const result = insightService.getInsights(region, year);
  res.json(result);
}
