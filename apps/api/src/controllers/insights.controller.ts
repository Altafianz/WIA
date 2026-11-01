import { Request, Response } from "express";
import { InsightsQuerySchema } from "@danaterbuka/shared";
import { InsightService } from "../services/insight.service.js";

const insightService = new InsightService();

export function getInsights(req: Request, res: Response): void {
  const query = InsightsQuerySchema.parse(req.query);
  const result = insightService.getInsights(query.region, query.year);
  res.json(result);
}
